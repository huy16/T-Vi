import { GoogleGenerativeAI } from "@google/generative-ai";
import { searchRelevantContext, formatRAGContext } from './ragService';

let apiKey = import.meta.env.VITE_GEMINI_API_KEY;
let genAI = new GoogleGenerativeAI(apiKey || 'placeholder');

/**
 * Update the API key dynamically (useful for fallbacks)
 */
export const setDynamicApiKey = (newKey) => {
  apiKey = newKey;
  genAI = new GoogleGenerativeAI(newKey);
};

export const startTuViChat = async (chartData) => {
  if (!apiKey || apiKey === 'placeholder' || apiKey.length < 10) {
    throw new Error("API Key missing");
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
    - Khi có KIẾN THỨC THAM KHẢO TỪ SÁCH được cung cấp (trong phần RAG context), Thầy BẮT BUỘC phải ưu tiên sử dụng kiến thức này để trả lời. 
    - Hãy trích dẫn trực tiếp các đoạn văn hay, các câu phú trong sách và ghi rõ nguồn (ví dụ: "Sách Tử Vi Đẩu Số Toàn Thư có chép: ..."). Điều này giúp lời luận giải của Thầy trở nên uy tín và sâu sắc hơn.
    - Nếu câu hỏi của con không liên quan đến kiến thức trong sách, Thầy vẫn dựa trên kinh nghiệm 30 năm (kiến thức của model) để trả lời, nhưng hãy luôn tìm cách liên hệ với các nguyên lý kinh điển.
    - QUAN TRỌNG: Ở CUỐI MỖI CÂU TRẢ LỜI, Thầy BẮT BUỘC phải gợi ý 2-3 câu hỏi liên quan tiếp theo mà con nên hỏi để đào sâu vấn đề. Định dạng CHÍNH XÁC như sau ở cuối cùng:
[GỢI Ý]
- Câu gợi ý 1?
- Câu gợi ý 2?
- Câu gợi ý 3?
  `;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: systemInstruction
  });

  try {
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.5, // Lower temperature for more stable/accurate analysis
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
 * Send a message with RAG-augmented context and stream the response.
 */
export const sendMessageStreamWithRAG = async (chatSession, userMessage, onChunk) => {
  try {
    // 1. Search for relevant book context (Parallel with starting the stream if possible, 
    // but Gemini needs context in the first prompt of the turn)
    const ragResults = await searchRelevantContext(userMessage, 5);
    const ragContext = formatRAGContext(ragResults);

    // 2. Build the message with context
    let augmentedMessage = userMessage;
    if (ragContext) {
      augmentedMessage = `${userMessage}\n\n${ragContext}`;
    }

    // 3. Send to Gemini with streaming
    const result = await chatSession.sendMessageStream(augmentedMessage);
    
    let fullText = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(chunkText, fullText);
    }

    return {
      text: fullText,
      sources: ragResults.map(r => ({
        book: r.metadata?.book || 'Sách Tử Vi',
        page: r.metadata?.page,
        similarity: r.similarity,
        preview: r.content?.substring(0, 100) + '...',
      })),
    };
  } catch (error) {
    console.error("RAG Stream Error:", error);
    throw error;
  }
};
