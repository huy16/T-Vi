import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './ChatBot.css';
import { startTuViChat, sendMessageStreamWithRAG } from '../utils/geminiService';

const ChatBot = ({ chartData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);
  const [showTopics, setShowTopics] = useState(true);
  
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
        console.log("ChatBot: Initializing with chartData...");
        setIsLoading(true);
        const { chatSession: newSession, initialGreeting } = await startTuViChat(chartData);
        setChatSession(newSession);
        setMessages([{ role: 'model', text: initialGreeting }]);
        setShowTopics(true);
      } catch (err) {
        console.error("Failed to init chat:", err);
        setMessages([{ role: 'model', text: "Thầy đang gặp chút vấn đề về pháp lực (kết nối). Con vui lòng thử tải lại trang (Ctrl+F5) nhé." }]);
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, [chartData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (text) => {
    if (!text.trim() || !chatSession || isLoading) return;

    const userText = text.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputValue('');
    setShowTopics(false);
    setIsLoading(true);

    // Placeholder for the AI response that we will update
    setMessages(prev => [...prev, { role: 'model', text: '', isStreaming: true }]);

    try {
      let currentFullText = '';
      const streamResult = await sendMessageStreamWithRAG(
        chatSession, 
        userText, 
        (chunk, fullText) => {
          currentFullText = fullText;
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
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { 
          role: 'model', 
          text: "Thầy đang gặp chút vấn đề kết nối. Con hỏi lại nhé.",
          isStreaming: false 
        };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleTopicClick = (topicLabel) => {
    handleSendMessage(`Thưa Thầy, con muốn hỏi về ${topicLabel} ạ.`);
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
          <button className="chatbot-btn-refresh" onClick={handleResetChat} title="Bắt đầu lại">🔄</button>
          <button className="chatbot-btn-minimize" onClick={() => setIsOpen(false)}>−</button>
          <button className="chatbot-btn-close" onClick={() => setIsOpen(false)}>×</button>
        </div>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, idx) => (
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
            disabled={isLoading || !chatSession}
          />
          <button 
            className="btn-send" 
            onClick={() => handleSendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading || !chatSession}
          >
            ➔
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
