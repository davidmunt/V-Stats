import { useState, useRef, useEffect } from "react";
import { useChatMutation } from "@/queries/chat/useChatMutation";

interface Message {
  role: "user" | "bot";
  content: string;
}

export const CoachAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "¡Hola Coach! Soy tu asistente de V-Stats. Pregúntame sobre la liga, tus próximos partidos o el rendimiento de tu equipo.",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const chatMutation = useChatMutation((response) => {
    setMessages((prev) => [...prev, { role: "bot", content: response.text }]);
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");

    chatMutation.mutate({ text: userText });
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-10 duration-300">
          <div className="p-5 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-lg">🤖</div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest italic">V-Stats AI</h4>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">En línea</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`
                  max-w-[85%] p-3.5 rounded-2xl text-xs font-bold shadow-sm
                  ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                  }
                `}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu duda..."
                className="flex-1 px-4 py-3 bg-slate-100 border-none rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
              <button
                onClick={handleSend}
                disabled={chatMutation.isPending || !input.trim()}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-500 disabled:opacity-50 transition-all shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-90" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95
          ${isOpen ? "bg-slate-800 rotate-90" : "bg-blue-600"}
        `}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-blue-600 rounded-full"></span>
          </div>
        )}
      </button>
    </div>
  );
};
