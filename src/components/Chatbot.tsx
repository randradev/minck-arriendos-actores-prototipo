import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  ChevronRight,
  Maximize2,
  Minimize2,
  Sparkles,
  Navigation,
  RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useChatAgent } from '../hooks/useChatAgent';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: {
    type: 'nav' | 'update' | 'query' | 'none' | 'info';
    label: string;
  };
}

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Bienvenido a MINCK-PILOT! Soy tu asistente especializado en la gestión del Directorio de Actores. Puedo ayudarte a buscar arrendatarios, navegar entre perfiles, actualizar datos de contacto o gestionar estados operativos. ¿Qué gestión deseas realizar hoy?',
      timestamp: new Date()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { processMessage, isProcessing } = useChatAgent();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await processMessage(input);
    
    const assistantMessage: Message = {
      role: 'assistant',
      content: response.text,
      timestamp: new Date(),
      action: response.action
    };

    setMessages(prev => [...prev, assistantMessage]);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full primary-gradient text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95 z-[100] group"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce"></div>
      </button>
    );
  }

  return (
    <div className={cn(
      "fixed right-6 bottom-6 bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-[100] border border-outline-variant/10 overflow-hidden",
      isMinimized ? "w-72 h-14" : "w-96 h-[550px]"
    )}>
      {/* Header */}
      <div className="p-4 primary-gradient text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold leading-none">MINCK-PILOT</h3>
            <span className="text-[10px] opacity-70 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              En línea
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn(
                "flex flex-col max-w-[85%] animate-in fade-in slide-in-from-bottom-2 duration-300",
                msg.role === 'user' ? "ml-auto items-end" : "items-start"
              )}>
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm shadow-sm",
                  msg.role === 'user' 
                    ? "bg-primary text-white rounded-tr-none" 
                    : "bg-white text-on-surface border border-outline-variant/10 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
                
                {msg.action && (
                  <div className="mt-2 flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20 animate-in zoom-in-95 duration-200">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-[9px] font-extrabold uppercase tracking-tighter">{msg.action.label}: EJECUTADO</span>
                  </div>
                )}
                
                <span className="text-[9px] text-on-surface-variant/40 font-medium mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
            {isProcessing && (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="bg-white border border-outline-variant/10 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-xs text-on-surface-variant font-medium">Pensando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-outline-variant/10 bg-white">
            <div className="relative group">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu consulta..."
                className="w-full pl-4 pr-12 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="absolute right-2 top-1.5 p-1.5 rounded-lg bg-primary text-white shadow-md hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                '¿Cuántos actores hay?',
                '¿Quiénes están bloqueados?',
                'Ir al perfil de Juan Pablo',
                'Bloquea a Roberto Carlos'
              ].map(hint => (
                <button 
                  key={hint}
                  onClick={() => setInput(hint)}
                  className="px-2 py-1 bg-surface-container border border-outline-variant/10 rounded-md text-[9px] font-bold text-on-surface-variant/60 hover:bg-primary/5 hover:text-primary transition-colors uppercase tracking-wider"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
