import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Bot, User, Loader2, Download, Trash2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../../api/client';
import { addMessage, setLoading, setError, clearChat } from '../../store/chatSlice';
import parseMarkdown from '../../utils/parseMarkdown';
import VoiceInput from '../VoiceInput';

const suggestedPrompts = [
  "How does voting work?",
  "What is EVM?",
  "How are results counted?",
  "Who can contest elections?"
];

export default function ChatWindow() {
  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);
  
  const { messages, isLoading } = useSelector(state => state.chat);
  const { sessionId, country, electionType, userLevel } = useSelector(state => state.session);
  const dispatch = useDispatch();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const msgText = text || input.trim();
    if (!msgText || isLoading) return;

    setInput('');
    dispatch(addMessage({ role: 'user', content: msgText }));
    dispatch(setLoading(true));

    try {
      const response = await client.post('/chat', {
        message: msgText,
        sessionId,
        country,
        electionType,
        userLevel
      });

      dispatch(addMessage({ 
        role: 'assistant', 
        content: response.data.reply,
        suggestedFollowUps: response.data.suggestedFollowUps 
      }));
    } catch (error) {
      console.error('Chat error:', error);
      dispatch(setError('Failed to get response. Please try again.'));
      dispatch(addMessage({ 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check if the backend server is running and try again.', 
        isError: true 
      }));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript);
  };

  return (
    <div className="flex flex-col h-full bg-transparent relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8 pb-32">
        {messages.length === 0 ? (
          <motion.div 
            className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-24 h-24 glass-panel rounded-3xl flex items-center justify-center mb-8 glass-glow-blue border-blue-500/20">
              <Bot size={48} className="text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold text-bold mb-3">Welcome to ElectBot</h2>
            <p className="text-muted mb-10 leading-relaxed">
              Your premium, neutral guide to the democratic process. 
              How can I assist you today?
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {suggestedPrompts.map((prompt, idx) => (
                <motion.button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-6 py-3 rounded-2xl glass-panel border-white/5 hover:border-primary/50 text-sm font-medium text-muted hover:text-bold transition-all hover:glass-glow-blue"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {prompt}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="max-w-4xl mx-auto w-full space-y-8">
            <AnimatePresence initial={false}>
              {messages.map((msg, idx) => (
                <MessageBubble 
                  key={idx} 
                  message={msg} 
                  index={idx}
                  onSend={handleSend} 
                />
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4 max-w-[80%]"
                >
                  <div className="w-10 h-10 rounded-2xl glass-panel flex items-center justify-center flex-shrink-0 border-white/5">
                    <Bot size={20} className="text-blue-500" />
                  </div>
                  <div className="glass-panel rounded-3xl rounded-tl-none px-6 py-4 border-white/5 flex items-center gap-4">
                    <div className="dot-typing ml-4" />
                    <span className="text-sm text-muted font-medium ml-8">ElectBot is thinking...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Redesigned Input Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-deep via-deep to-transparent">
        <div className="max-w-4xl mx-auto relative group">
          <div className="glass-panel rounded-[2rem] p-2 flex items-center gap-2 border-white/10 input-glow transition-all">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="w-full bg-transparent border-none pl-6 pr-4 py-3 text-main placeholder-muted focus:ring-0 text-base"
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center gap-1 pr-2">
              <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />
              <motion.button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 flex items-center justify-center transition-all text-white shadow-xl shadow-blue-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send size={20} />
              </motion.button>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-[10px] text-muted font-medium uppercase tracking-[0.2em]">
              Neutral Educational Assistant • Strictly Non-Partisan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message, onSend }) {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 w-full ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div className="w-10 h-10 rounded-2xl glass-panel flex items-center justify-center flex-shrink-0 border-white/5 shadow-lg shadow-black/20">
          <Bot size={20} className="text-blue-500" />
        </div>
      )}
      
      <div className={`flex flex-col gap-3 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-6 py-4 rounded-[2rem] shadow-2xl relative transition-all ${
          isUser 
            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none border border-white/10 shadow-blue-500/10' 
            : `glass-panel border-white/5 rounded-tl-none text-slate-200 ${message.isError ? 'border-red-500/20 bg-red-500/5' : ''}`
        }`}>
          {isUser ? (
            <p className="text-[15px] leading-relaxed font-medium">{message.content}</p>
          ) : (
            <div 
              className="prose prose-sm md:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }} 
            />
          )}
        </div>

        {/* Horizontal Scrollable Follow ups */}
        {!isUser && message.suggestedFollowUps?.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 w-full custom-scrollbar no-scrollbar scroll-smooth">
            {message.suggestedFollowUps.map((chip, i) => (
              <motion.button
                key={i}
                onClick={() => onSend(chip)}
                className="whitespace-nowrap px-4 py-2 rounded-full glass-panel border-blue-500/20 text-xs font-bold text-blue-400 hover:text-white hover:border-blue-500/50 hover:glass-glow-blue transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {chip}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
          <User size={20} className="text-white" />
        </div>
      )}
    </motion.div>
  );
}
