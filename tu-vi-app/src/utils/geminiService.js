/**
 * Hugging Face Inference API Service
 * Thay thế cho Gemini API để chạy ổn định hơn trên Hugging Face Spaces.
 */

import { searchRelevantContext, formatRAGContext } from './ragService';

let hfToken = import.meta.env.VITE_HF_TOKEN;
const MODEL_ID = "meta-llama/Meta-Llama-3-8B-Instruct"; // Model cực mạnh và nhanh

export const startTuViChat = async (chartData) => {
  // Với HF Inference API, chúng ta không cần "startChat" như Gemini, 
  // chỉ cần chuẩn bị lời chào đầu tiên.
  
  const greetingPrompt = `Bạn là "Mệnh Thư Đại Sư", một chuyên gia Tử Vi. 
  Hãy gửi lời chào ngắn gọn (tối đa 2 câu) tới người dùng tên là ${chartData.name || "con"}. 
  Hãy xưng "Thầy" gọi "con". Chỉ ra một điểm tích cực trong lá số và hỏi con muốn xem gì.`;

  try {
    const response = await callHFAPI([
      { role: "system", content: "Bạn là Mệnh Thư Đại Sư, chuyên gia Tử Vi Đẩu Số uyên bác." },
      { role: "user", content: greetingPrompt }
    ]);

    return {
      chatSession: { history: [] }, // Giả lập session
      initialGreeting: response
    };
  } catch (error) {
    console.error("HF Start Chat Error:", error);
    throw error;
  }
};

export const sendMessageStreamWithRAG = async (chatSession, userMessage, onChunk) => {
  try {
    // 1. RAG Search
    const ragResults = await searchRelevantContext(userMessage, 3);
    const ragContext = formatRAGContext(ragResults);

    // 2. Build Message
    const systemPrompt = `Bạn là "Mệnh Thư Đại Sư" (Thầy). Xưng "Thầy" gọi "con".
    Sử dụng kiến thức Tử Vi và thông tin sau để trả lời:
    ${ragContext}
    
    Luôn trích dẫn nguồn sách nếu có. Cuối câu trả lời hãy gợi ý 3 câu hỏi tiếp theo theo định dạng:
    [GỢI Ý]
    - Câu 1?
    - Câu 2?
    - Câu 3?`;

    // 3. Call HF API (Simulating stream as HF Inference API direct fetch is easier as non-stream for now, 
    // but we can simulate the callback for UX)
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatSession.history,
      { role: "user", content: userMessage }
    ];

    const fullResponse = await callHFAPI(messages);
    
    // Simulate streaming for UX
    if (onChunk) {
      const words = fullResponse.split(' ');
      let current = '';
      for (let i = 0; i < words.length; i++) {
        current += words[i] + ' ';
        onChunk(words[i] + ' ', current);
        await new Promise(r => setTimeout(r, 20)); // Mượt mà
      }
    }

    // Update history
    chatSession.history.push({ role: "user", content: userMessage });
    chatSession.history.push({ role: "assistant", content: fullResponse });

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

async function callHFAPI(messages) {
  if (!hfToken || hfToken.length < 10) {
    throw new Error("API Key missing");
  }

  // Sử dụng endpoint Chat Completions chuẩn của Hugging Face
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${MODEL_ID}/v1/chat/completions`,
    {
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        messages: messages,
        model: MODEL_ID,
        max_tokens: 1024,
        temperature: 0.5,
        stream: false
      }),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    // Xử lý lỗi model đang tải (loading)
    if (result.error && result.error.includes("loading")) {
      throw new Error("Model đang khởi động trên Hugging Face. Con đợi khoảng 20 giây rồi thử lại nhé.");
    }
    throw new Error(result.error || "HF API Error");
  }

  return result.choices?.[0]?.message?.content || "Thầy chưa luận giải được, con hỏi lại nhé.";
}

