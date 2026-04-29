import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchRelevantContext, formatRAGContext } from './ragService';
import { ENV_FALLBACK } from './envFallback';

// Fetch token from LocalStorage, Environment, or Fallback
export const getGeminiToken = () => {
  return localStorage.getItem('GEMINI_API_KEY') || import.meta.env.VITE_GEMINI_API_KEY || ENV_FALLBACK.VITE_GEMINI_API_KEY;
};

export const setGeminiToken = (token) => {
  if (token) {
    localStorage.setItem('GEMINI_API_KEY', token);
  } else {
    localStorage.removeItem('GEMINI_API_KEY');
  }
};

/**
 * Helper: retry a function when hitting 429/503 errors.
 * Waits progressively: 5s → 15s → 30s
 */
async function retryOnQuota(fn, maxRetries = 3) {
  const delays = [5000, 15000, 30000];
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const msg = error.message || '';
      const isRetryable = msg.includes('429') || msg.includes('503') || msg.includes('quota') || msg.includes('high demand');
      if (isRetryable && attempt < maxRetries) {
        const waitMs = delays[attempt] || 30000;
        console.warn(`Gemini API rate limited (attempt ${attempt + 1}/${maxRetries}). Retrying in ${waitMs / 1000}s...`);
        await new Promise(r => setTimeout(r, waitMs));
      } else {
        throw error;
      }
    }
  }
}

// Ordered list of models to try — fallback chain
const CHAT_MODELS = [
  'gemini-2.0-flash-lite',   // Lightest, highest quota
  'gemini-2.0-flash',        // Standard
  'gemini-flash-latest',     // Auto-routed
];

/**
 * Try to create a model instance, falling back through the model list.
 */
function createModelWithFallback(genAI) {
  // We'll return the first model; if it fails at call time, sendMessage will throw
  // and the retry logic will handle it. But we start with the lightest model.
  return genAI.getGenerativeModel({ model: CHAT_MODELS[0] });
}

export const startTuViChat = async (chartData) => {
  const token = getGeminiToken();
  if (!token) {
    throw new Error("API Key missing");
  }

  const genAI = new GoogleGenerativeAI(token);

  const systemInstruction = `Bạn là "Mệnh Thư Đại Sư", một bậc thầy về Tử Vi Đẩu Số.
Hãy xưng "Thầy" và gọi người dùng là "con".
Người dùng tên là: ${chartData.name || "con"}.
Lá số có Chính Tinh tại Mệnh: ${chartData.chinhTinh || "chưa rõ"}.
Nhiệm vụ đầu tiên: Gửi lời chào ngắn gọn (tối đa 2-3 câu). Chỉ ra một điểm sáng hoặc một ngôi sao tốt trong bản mệnh để khích lệ, sau đó hỏi con muốn hỏi Thầy về mảng nào (Tình duyên, Sự nghiệp, Tài lộc...).
`;

  // Try each model in the fallback chain
  for (let i = 0; i < CHAT_MODELS.length; i++) {
    try {
      const model = genAI.getGenerativeModel({ model: CHAT_MODELS[i] });
      const chatSession = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: systemInstruction }],
          }
        ],
        generationConfig: {
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      });

      const result = await retryOnQuota(() => chatSession.sendMessage("Xin chào Thầy!"));
      const responseText = result.response.text();

      console.log(`✅ Gemini connected successfully using model: ${CHAT_MODELS[i]}`);
      return {
        chatSession: chatSession,
        initialGreeting: responseText,
        modelUsed: CHAT_MODELS[i]
      };
    } catch (error) {
      console.warn(`❌ Model ${CHAT_MODELS[i]} failed:`, error.message);
      if (i === CHAT_MODELS.length - 1) {
        // All models exhausted
        throw error;
      }
      // Try next model
    }
  }
};

export const sendMessageStreamWithRAG = async (chatSession, userMessage, onChunk) => {
  const token = getGeminiToken();
  if (!token) {
    throw new Error("API Key missing");
  }
  
  try {
    // RAG: tìm kiến thức liên quan từ Supabase (không block nếu lỗi)
    let ragResults = [];
    let ragContext = '';
    try {
      ragResults = await searchRelevantContext(userMessage, 3);
      ragContext = formatRAGContext(ragResults);
      if (ragResults.length > 0) {
        console.log(`📚 RAG: Tìm thấy ${ragResults.length} đoạn sách liên quan`);
      }
    } catch (ragErr) {
      console.warn('RAG search failed (non-blocking):', ragErr.message);
    }

    const fullPrompt = `Câu hỏi của con: ${userMessage}

${ragContext ? `Kiến thức Tử Vi tham khảo:\n${ragContext}\n` : ''}
Hãy phân tích chi tiết dựa trên lá số và kiến thức trên. Cuối câu trả lời, hãy gợi ý 3 câu hỏi tiếp theo theo định dạng sau (để hệ thống tạo nút bấm):
[GỢI Ý]
- Câu hỏi gợi ý 1?
- Câu hỏi gợi ý 2?
- Câu hỏi gợi ý 3?`;

    // If chatSession is just a dummy object, initialize a real one
    let activeSession = chatSession;
    if (!chatSession.sendMessageStream) {
      const genAI = new GoogleGenerativeAI(token);
      const model = createModelWithFallback(genAI);
      activeSession = model.startChat({ history: [] });
    }

    const resultStream = await retryOnQuota(() => activeSession.sendMessageStream(fullPrompt));
    
    let fullText = '';
    for await (const chunk of resultStream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) {
        onChunk(chunkText, fullText);
      }
    }

    return {
      text: fullText,
      sources: ragResults.map(r => ({
        book: r.metadata?.book || 'Sách Tử Vi',
        similarity: r.similarity
      }))
    };
  } catch (error) {
    console.error("Gemini Stream Error:", error);
    throw error;
  }
};
