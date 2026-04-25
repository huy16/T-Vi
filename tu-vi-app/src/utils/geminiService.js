/**
 * Hugging Face Inference API Service (Mistral Version)
 */

import { searchRelevantContext, formatRAGContext } from './ragService';
import { ENV_FALLBACK } from './envFallback';

// Thử lấy token từ nhiều nguồn khác nhau
let hfToken = import.meta.env.VITE_HF_TOKEN || ENV_FALLBACK.VITE_HF_TOKEN;

// Ghi nhật ký để debug (chỉ ghi 4 ký tự đầu)
console.log("HF Token status:", hfToken ? `Found (${hfToken.substring(0, 4)}...)` : "Not found");


const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2";


export const startTuViChat = async (chartData) => {
  const greetingPrompt = `<s>[INST] Bạn là "Mệnh Thư Đại Sư". Hãy gửi lời chào ngắn gọn (tối đa 2 câu) tới người dùng tên là ${chartData.name || "con"}. Hãy xưng "Thầy" gọi "con". Chỉ ra một điểm tích cực trong lá số và hỏi con muốn hỏi về mảng nào. [/INST]`;

  try {
    const response = await callHFAPI(greetingPrompt);
    return {
      chatSession: { history: [] },
      initialGreeting: response
    };
  } catch (error) {
    console.error("HF Start Chat Error:", error);
    throw error;
  }
};

export const sendMessageStreamWithRAG = async (chatSession, userMessage, onChunk) => {
  try {
    const ragResults = await searchRelevantContext(userMessage, 3);
    const ragContext = formatRAGContext(ragResults);

    const fullPrompt = `<s>[INST] Bạn là "Mệnh Thư Đại Sư" (Thầy). Xưng "Thầy" gọi "con".
    Kiến thức tham khảo: ${ragContext}
    
    Câu hỏi: ${userMessage}
    Hãy luận giải sâu sắc và trích dẫn sách. Cuối câu hãy gợi ý 3 câu hỏi tiếp theo theo định dạng:
    [GỢI Ý]
    - Câu 1?
    - Câu 2?
    - Câu 3? [/INST]`;

    const fullResponse = await callHFAPI(fullPrompt);
    
    if (onChunk) {
      const words = fullResponse.split(' ');
      let current = '';
      for (let i = 0; i < words.length; i++) {
        current += words[i] + ' ';
        onChunk(words[i] + ' ', current);
        await new Promise(r => setTimeout(r, 15));
      }
    }

    return {
      text: fullResponse,
      sources: ragResults.map(r => ({
        book: r.metadata?.book || 'Sách Tử Vi',
        similarity: r.similarity
      }))
    };
  } catch (error) {
    console.error("HF Stream Error:", error);
    throw error;
  }
};

async function callHFAPI(prompt) {
  if (!hfToken || hfToken.length < 10) {
    throw new Error("API Key missing");
  }

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${MODEL_ID}`,
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.5,
          top_p: 0.9,
          return_full_text: false
        }
      }),
    }
  );

  const result = await response.json();
  
  if (!response.ok) {
    if (result.error && result.error.includes("loading")) {
      throw new Error("Model đang khởi động. Con đợi 20 giây nhé.");
    }
    throw new Error(result.error || "Lỗi API");
  }

  // Mistral standard output parsing
  let text = Array.isArray(result) ? result[0].generated_text : result.generated_text;
  return text || "Thầy chưa luận được, con hỏi lại nhé.";
}
