import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatBot.css';
import { startTuViChat, sendMessageStreamWithRAG, setGeminiToken } from '../utils/geminiChatService';

const ChatBot = ({ chartData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [showTopics, setShowTopics] = useState(true);
  
  const [isMissingKey, setIsMissingKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const messagesEndRef = useRef(null);

  const SUGGESTED_QUESTIONS = [
    { id: 'nam-nay', label: 'Vận hạn năm nay thế nào?', icon: '📅' },
    { id: 'su-nghiep', label: 'Con nên làm kinh doanh hay làm thuê?', icon: '💼' },
    { id: 'tai-loc', label: 'Tài lộc của con năm nay ra sao?', icon: '💰' },
    { id: 'tinh-duyen', label: 'Đường tình duyên có gì khởi sắc không?', icon: '❤️' },
    { id: 'hoc-van', label: 'Đường học hành, bằng cấp của con thế nào?', icon: '🎓' },
    { id: 'gia-dao', label: 'Gia đạo và nhà cửa của con có ổn định không?', icon: '🏠' },
    { id: 'cung-menh', label: 'Điểm mạnh nhất trong cung Mệnh của con?', icon: '🌟' },
    { id: 'suc-khoe', label: 'Con cần lưu ý gì về sức khỏe?', icon: '🏥' }
  ];

  useEffect(() => {
    // Initialize chat session when component mounts and chartData is available
    const initChat = async () => {
      if (!chartData) return;
      
      try {
        setIsLoading(true);
        setIsMissingKey(false);
        const { chatSession: newSession, initialGreeting } = await startTuViChat(chartData);
        setChatSession(newSession);
        setMessages([{ role: 'model', text: initialGreeting }]);
        setShowTopics(true);
      } catch (err) {
        console.error("Failed to init chat:", err);
        if (err.message && err.message.includes("API Key missing")) {
          setIsMissingKey(true);
          setMessages([{ role: 'model', text: "Thầy chưa nhận được kết nối tinh tủy (HuggingFace API Token). Con vui lòng nhập Token vào đây để Thầy luận giải nhé." }]);
        } else {
          // Instead of locking out completely, create a dummy session so input works for retries
          setChatSession({ history: [] });
          const errorMsg = `Lỗi kết nối: ${err.message || "Không xác định"}. Con hãy kiểm tra lại Token hoặc đợi model khởi động nhé.`;
          setMessages([{ role: 'model', text: errorMsg }]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, [chartData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text) => {
    const currentSession = chatSession || { history: [] };
    if (!text.trim() || isLoading) return;

    const userText = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setShowTopics(false);
    setIsLoading(true);

    // Placeholder for the AI response that we will update
    setMessages(prev => [...prev, { role: 'model', text: '', isStreaming: true }]);

    try {
      const streamResult = await sendMessageStreamWithRAG(
        currentSession, 
        userText, 
        (_chunk, fullText) => {
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { 
              ...newMessages[newMessages.length - 1], 
              text: fullText 
            };
            return newMessages;
          });
        }
      );

      const aiResponseRaw = streamResult.text;
      const sources = streamResult.sources || [];
      
      let mainText = aiResponseRaw;
      let suggestions = [];

      const suggestionMatch = aiResponseRaw.match(/\[GỢI Ý\]([\s\S]*)$/i);
      if (suggestionMatch) {
        mainText = aiResponseRaw.substring(0, suggestionMatch.index).trim();
        const suggestionBlock = suggestionMatch[1];
        suggestions = suggestionBlock.split('\n')
          .map(line => line.replace(/^-\s*/, '').trim())
          .filter(line => line.length > 0);
      }

      // Add source attribution
      if (sources.length > 0) {
        const sourceBooks = [...new Set(sources.map(s => s.book))];
        mainText += `\n\n---\n📚 *Tham khảo: ${sourceBooks.join(', ')}*`;
      }

      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'model', 
          text: mainText, 
          suggestions,
          isStreaming: false 
        };
        return newMessages;
      });
      
      // Update session if it was newly created
      if (!chatSession) {
        setChatSession(currentSession);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'model', 
          text: `Thầy đang gặp chút vấn đề kết nối (${error.message}). Con hãy kiểm tra lại Token hoặc mạng rồi hỏi lại nhé.`,
          isStreaming: false 
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleResetChat = async () => {
    if (isLoading) return;
    if (window.confirm("Con có muốn xóa hội thoại cũ để bắt đầu cuộc trò chuyện mới với Thầy không?")) {
      try {
        setIsLoading(true);
        setMessages([]);
        setChatSession(null);
        
        const { chatSession: newSession, initialGreeting } = await startTuViChat(chartData);
        setChatSession(newSession);
        setMessages([{ role: 'model', text: initialGreeting }]);
        setShowTopics(true);
      } catch (err) {
        console.error("Failed to reset chat:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) {
    return (
      <button className="chatbot-floating-btn" onClick={() => setIsOpen(true)}>
        <span className="chatbot-icon">師</span>
        <span className="chatbot-label">Hỏi Đại Sư</span>
      </button>
    );
  }

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <span className="chatbot-header-icon">師</span>
          <span className="chatbot-title">Mệnh Thư Đại Sư</span>
        </div>
        <div className="chatbot-header-right">
          <button className="chatbot-btn-refresh" onClick={() => setIsMissingKey(!isMissingKey)} title="Cài đặt Token">🔑</button>
          <button className="chatbot-btn-refresh" onClick={handleResetChat} title="Bắt đầu lại">🔄</button>
          <button className="chatbot-btn-minimize" onClick={() => setIsOpen(false)}>−</button>
          <button className="chatbot-btn-close" onClick={() => setIsOpen(false)}>×</button>
        </div>
      </div>

      <div className="chatbot-messages">
        {isMissingKey && (
           <div className="chat-bubble-container model">
             <div className="chat-bubble model-greeting key-input-bubble" style={{ width: '100%', maxWidth: '100%' }}>
               <ReactMarkdown>Thầy cần kết nối năng lượng (Gemini API Key) để bắt đầu luận giải. Con hãy nhập vào đây nhé:</ReactMarkdown>
               <div className="key-input-wrapper">
                 <input 
                   type="password" 
                   placeholder="AIzaSy..." 
                   value={apiKeyInput}
                   onChange={e => setApiKeyInput(e.target.value)}
                 />
                 <button 
                   onClick={() => {
                     setGeminiToken(apiKeyInput);
                     setIsMissingKey(false);
                     handleResetChat();
                   }}
                   disabled={apiKeyInput.length < 10}
                 >
                   Kết Nối / Lưu
                 </button>
                 <p className="key-help-text">Token này chỉ lưu trên trình duyệt của con, hoàn toàn bảo mật.</p>
               </div>
             </div>
           </div>
        )}

        {!isMissingKey && messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble-container ${msg.role === 'user' ? 'user' : 'model'}`}>
            {msg.role === 'model' && messages.length === 1 && (
               <div className="chat-bubble model-greeting">
                 <ReactMarkdown>{msg.text}</ReactMarkdown>
               </div>
            )}
            {!(msg.role === 'model' && messages.length === 1) && (
               <div className={`chat-bubble ${msg.role}`}>
                 {msg.role === 'model' ? (
                   <>
                     <ReactMarkdown>{msg.text}</ReactMarkdown>
                     {msg.suggestions && msg.suggestions.length > 0 && (
                       <div className="dynamic-suggestions">
                         {msg.suggestions.map((sug, i) => (
                           <button 
                             key={i} 
                             className="suggestion-pill"
                             onClick={() => handleSendMessage(sug)}
                           >
                             {sug}
                           </button>
                         ))}
                       </div>
                     )}
                   </>
                 ) : (
                   msg.text
                 )}
               </div>
            )}
          </div>
        ))}

        {showTopics && messages.length === 1 && (
          <div className="quick-topics-section">
            <div className="topics-header">CON CÓ THỂ HỎI THẦY VỀ</div>
            <div className="topics-grid">
              {SUGGESTED_QUESTIONS.slice(0, 6).map(q => (
                <button 
                  key={q.id} 
                  className="topic-btn" 
                  onClick={() => handleSendMessage(q.label)}
                >
                  <span className="topic-icon">{q.icon}</span>
                  <span className="topic-text">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="chat-bubble-container model">
            <div className="chat-bubble model typing-indicator">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-area">
        {/* Persistent Suggested Questions Chips */}
        <div className="suggested-chips-container">
          <div className="suggested-chips-scroll">
            {SUGGESTED_QUESTIONS.map(q => (
              <button 
                key={q.id} 
                className="chip-btn" 
                onClick={() => handleSendMessage(q.label)}
                disabled={isLoading}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Thưa Thầy, con muốn hỏi..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage(inputValue);
            }}
            disabled={isLoading}
          />
          <button 
            className="btn-send" 
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
          >
            ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
