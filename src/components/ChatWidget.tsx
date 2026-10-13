import { useState, useRef, useEffect } from 'react';
import { CloseIcon, WhatsAppIcon } from './Icons';

interface Message {
  id: string;
  text: string;
  sender: 'client' | 'agent';
  time: string;
}

const BOT_REPLIES = [
  '¡Hola! Soy el asistente de Cazana Store 👋 ¿En qué puedo ayudarte hoy?',
  'Gracias por tu mensaje. Un asesor revisará tu consulta en breve.',
  'Recuerda que ofrecemos envío gratis en compras mayores a S/ 150 y entrega en 24–48h.',
  '¿Tienes alguna consulta sobre un producto, un envío o una devolución?',
  'Puedes contactarnos también por WhatsApp al +51 999 123 456 (Lun–Sáb 9am–8pm).',
];

interface ChatWidgetProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function ChatWidget({ isOpen, onOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: '¡Bienvenido a Cazana Store! ¿En qué podemos ayudarte? Estamos disponibles Lun–Sáb de 9am a 8pm.',
      sender: 'agent',
      time: new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [replyIndex, setReplyIndex] = useState(1);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnread(0);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }, [isOpen, messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const now = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    const clientMsg: Message = { id: Date.now().toString(), text: input.trim(), sender: 'client', time: now };
    setMessages((prev) => [...prev, clientMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = BOT_REPLIES[replyIndex % BOT_REPLIES.length];
      setReplyIndex((i) => i + 1);
      const agentMsg: Message = { id: (Date.now() + 1).toString(), text: reply, sender: 'agent', time: now };
      setMessages((prev) => [...prev, agentMsg]);
      setIsTyping(false);
      if (!isOpen) setUnread((n) => n + 1);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {isOpen && (
        <div className="w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-gray-light flex flex-col overflow-hidden"
          style={{ height: '460px' }}>
          {/* Header */}
          <div className="bg-charcoal px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 bg-gold/20 rounded-full flex items-center justify-center">
                  <span className="text-gold text-sm font-serif font-bold">C</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald rounded-full border-2 border-charcoal" />
              </div>
              <div>
                <p className="font-sans font-semibold text-white text-sm">Cazana Soporte</p>
                <p className="text-white/60 text-xs font-sans">En línea • Respuesta rápida</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/51999123456"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-full flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <WhatsAppIcon size={15} className="text-[#25D366]" />
              </a>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <CloseIcon size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-light/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mr-2 mt-1">
                    C
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm font-sans leading-relaxed ${
                    msg.sender === 'client'
                      ? 'bg-emerald text-white rounded-br-sm'
                      : 'bg-white text-charcoal shadow-sm rounded-bl-sm border border-gray-light'
                  }`}
                >
                  {msg.text}
                  <p className={`text-[10px] mt-1 ${msg.sender === 'client' ? 'text-white/60 text-right' : 'text-gray-text'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-[10px] font-bold text-white">C</div>
                <div className="bg-white border border-gray-light rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 bg-gray-text rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="px-4 py-3 border-t border-gray-light bg-white flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje..."
              className="flex-1 text-sm font-sans bg-gray-light rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/40 min-w-0"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 bg-emerald hover:bg-emerald-dark disabled:opacity-40 rounded-full flex items-center justify-center text-white transition-colors shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={isOpen ? onClose : onOpen}
        className="relative w-14 h-14 bg-emerald hover:bg-emerald-dark shadow-xl rounded-full flex items-center justify-center text-white transition-all hover:scale-105"
        title="Chat con soporte"
      >
        {isOpen ? (
          <CloseIcon size={22} />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        )}
        {!isOpen && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </div>
  );
}
