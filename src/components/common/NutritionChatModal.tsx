import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { askNutritionAi } from '../../services/api';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldAlert,
  Loader2,
  Bot,
  User as UserIcon,
} from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const QUICK_QUESTIONS = [
  'What is INS 330 in my food?',
  'Why is Palmolein oil widely used in Indian snacks?',
  'How to spot hidden sugars on biscuit labels?',
  'How much sodium is recommended per day by ICMR?',
];

export const NutritionChatModal: React.FC = () => {
  const { isNutritionChatOpen, toggleNutritionChat, user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content:
        "Namaste! I'm your WhatsInit AI Nutrition Guide. I help translate complex Indian packaged food ingredients, additive codes (INS numbers), and nutrient facts into plain, everyday English. How can I help you understand your food today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isNutritionChatOpen) {
    return (
      <button
        onClick={toggleNutritionChat}
        className="fixed bottom-6 right-6 z-40 bg-[#F58220] hover:bg-[#e07116] text-white p-3.5 rounded-full shadow-xl shadow-[#F58220]/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 group"
        title="Ask AI Nutrition Guide"
      >
        <Sparkles className="w-5 h-5 text-white animate-pulse" />
        <span className="text-xs font-bold pr-1 hidden sm:inline-block">AI Nutrition Guide</span>
      </button>
    );
  }

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: q };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const reply = await askNutritionAi(newHistory, user || undefined);
      setMessages((prev) => [...prev, { role: 'model', content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'I could not retrieve an answer right now. Please try again shortly.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 w-[95vw] sm:w-[420px] h-[550px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-[#252525]/12 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#F58220] to-[#FFAB66] text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h3 className="text-xs font-bold">AI Nutrition Guide</h3>
              <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                Educational
              </span>
            </div>
            <p className="text-[10px] text-white/90">Translating food labels into simple terms</p>
          </div>
        </div>
        <button
          onClick={toggleNutritionChat}
          className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="px-3.5 py-1.5 bg-amber-50 border-b border-amber-100 flex items-center space-x-2 text-[10px] text-amber-900 leading-tight">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
        <span>
          Educational AI guidance only. Not medical advice. Consult registered dietitians for individual therapy.
        </span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FFFAF5]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-2 ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'model' && (
              <div className="w-6 h-6 rounded-full bg-[#F58220] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-xs">
                AI
              </div>
            )}
            <div
              className={`max-w-[85%] text-xs rounded-2xl px-4 py-2.5 leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#F58220] text-white rounded-tr-xs shadow-xs font-medium'
                  : 'bg-white text-[#252525] border border-[#252525]/8 shadow-xs rounded-tl-xs whitespace-pre-line'
              }`}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-slate-200 text-[#252525] flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                <UserIcon className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-[#77716B]">
            <div className="w-6 h-6 rounded-full bg-[#F58220] text-white flex items-center justify-center text-[10px] font-bold">
              AI
            </div>
            <div className="bg-white px-3.5 py-2 rounded-xl border border-[#252525]/8 flex items-center space-x-2 shadow-xs">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F58220]" />
              <span>Analyzing nutritional references...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      {messages.length <= 2 && (
        <div className="px-3 py-2 bg-white border-t border-[#252525]/6 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {QUICK_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[10px] whitespace-nowrap bg-[#FFFAF5] hover:bg-[#FFF0E3] hover:text-[#F58220] text-[#252525] px-3 py-1.5 rounded-full border border-[#252525]/10 transition-colors font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-[#252525]/8 flex items-center space-x-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about ingredients, salt, sugar, palm oil..."
          className="flex-1 text-xs px-3.5 py-2.5 border border-[#252525]/15 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F58220] focus:border-[#F58220] bg-[#FFFAF5]"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-[#F58220] hover:bg-[#e07116] disabled:opacity-40 text-white transition-all shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
