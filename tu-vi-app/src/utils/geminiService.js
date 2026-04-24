import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchRelevantContext, formatRAGContext } from './ragService';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || 'placeholder');

export const startTuViChat = async (chartData) => {
  if (!apiKey) {
    throw new Error("Gemini API Key missing. Please check your .env file.");
  }

  const systemInstruction = `
    Bạn là "Mệnh Thư Đại Sư" (Thầy), một chuyên gia bậc thầy về Tử Vi Đẩu Số với hơn 30 năm kinh nghiệm. 
    Người đang xem là học trò của bạn (gọi là "con").
    Tên của con là: ${chartData.name || "con"}. Hãy xưng hô là "Thầy" và gọi tên người dùng (VD: "Đạt ơi, Thầy thấy...").
    
    Dưới đây là toàn bộ thông tin lá số Tử Vi của con (dạng JSON):
    ${JSON.stringify(chartData, null, 2)}
    
    Nhiệm vụ của bạn:
    - Khi bắt đầu, hãy gửi MỘT lời chào cực kỳ ngắn gọn (tối đa 2 câu), chỉ ra 1 điểm nổi bật nhất trong lá số (ví dụ: cung Quan Lộc mạnh, hoặc cung Phu Thê có vấn đề) và hỏi xem con muốn hỏi về mảng nào trước. KHÔNG BAO GIỜ tự phân tích dài dòng ở câu chào đầu tiên.
    - Trong các câu trả lời tiếp theo (khi con hỏi về một mảng cụ thể như Sự nghiệp, Tài chính, Tình duyên...), BẮT BUỘC PHẢI PHÂN TÍCH THẬT SÂU SẮC, CHI TIẾT VÀ TƯỜNG TẬN.
    - Phải trích dẫn cụ thể các sao (Chính tinh, Phụ tinh tốt/xấu), cách cục, ngũ hành, âm dương trong cung tương ứng để giải thích tại sao lại có kết luận đó. KHÔNG ĐƯỢC trả lời chung chung, hời hợt.
    - Văn phong: điềm đạm, uyên bác, ân cần nhưng dứt khoát của một người Thầy.
    - Có thể dùng Markdown để in đậm các sao quan trọng giúp con dễ đọc.
    - LUÔN LUÔN giữ vai diễn "Thầy", xưng "Thầy", gọi "con" hoặc tên của con.
    - Khi có KIẾN THỨC THAM KHẢO TỪ SÁCH được cung cấp, hãy tích cực trích dẫn và dẫn nguồn (tên sách, trang). Điều này giúp con tin tưởng lời Thầy hơn.
    - QUAN TRỌNG: Ở CUỐI MỖI CÂU TRẢ LỜI, Thầy BẮT BUỘC phải gợi ý 2-3 câu hỏi liên quan tiếp theo mà con nên hỏi để đào sâu vấn đề. Định dạng CHÍNH XÁC như sau ở cuối cùng:
[GỢI Ý]
- Câu gợi ý 1?
- Câu gợi ý 2?
- Câu gợi ý 3?
  `;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-flash-latest",
    systemInstruction: systemInstruction
  });

  try {
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    });

    // Generate the initial greeting
    const initialPrompt = "Hãy gửi lời chào đầu tiên tới con theo đúng System Instruction (ngắn gọn, chỉ ra 1 điểm nổi bật và hỏi con muốn xem gì).";
    const result = await chat.sendMessage(initialPrompt);
    const greeting = result.response.text();

    return {
      chatSession: chat,
      initialGreeting: greeting
    };
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

/**
 * Send a message with RAG-augmented context.
 * Searches relevant book excerpts before sending to Gemini.
 */
export const sendMessageWithRAG = async (chatSession, userMessage) => {
  try {
    // Search for relevant book context
    const ragResults = await searchRelevantContext(userMessage, 5);
    const ragContext = formatRAGContext(ragResults);

    // Build the message with context
    let augmentedMessage = userMessage;
    if (ragContext) {
      augmentedMessage = `${userMessage}\n\n${ragContext}`;
    }

    // Send to Gemini
    const result = await chatSession.sendMessage(augmentedMessage);
    return {
      text: result.response.text(),
      sources: ragResults.map(r => ({
        book: r.metadata?.book || 'Sách Tử Vi',
        page: r.metadata?.page,
        similarity: r.similarity,
        preview: r.content?.substring(0, 100) + '...',
      })),
    };
  } catch (error) {
    console.error("RAG Chat Error:", error);
    throw error;
  }
};
