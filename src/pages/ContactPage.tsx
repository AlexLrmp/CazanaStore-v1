import { useState } from 'react';
import { PhoneIcon, MailIcon, MapPinIcon, WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon } from '../components/Icons';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-light py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase block mb-3">Estamos para ayudarte</span>
          <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-4">Contacto y Soporte</h1>
          <p className="text-charcoal-light font-sans">Respuesta garantizada en menos de 2 horas en horario hábil</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Info */}
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-charcoal">Canales de atención</h2>

            {/* WhatsApp */}
            <a
              href="https://wa.me/51999123456"
              target="_blank"
              rel="noreferrer"
              className="flex gap-4 p-5 bg-[#25D366]/10 border border-[#25D366]/30 rounded-2xl hover:border-[#25D366] transition-all group"
            >
              <div className="w-12 h-12 bg-[#25D366] rounded-xl flex items-center justify-center shrink-0">
                <WhatsAppIcon size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold font-sans text-charcoal text-sm group-hover:text-[#128C7E] transition-colors">WhatsApp Directo</p>
                <p className="text-charcoal-light font-sans text-sm mt-0.5">+51 999 123 456</p>
                <p className="text-xs text-gray-text font-sans mt-1">Lun–Sáb 9am–8pm</p>
              </div>
            </a>

            {[
              { icon: <PhoneIcon size={20} className="text-gold" />, label: 'Teléfono', value: '+51 999 123 456', sub: 'Lun–Sáb, 9am–6pm' },
              { icon: <MailIcon size={20} className="text-gold" />, label: 'Email', value: 'hola@cazanastore.com', sub: 'Respuesta en <2 horas' },
              { icon: <MapPinIcon size={20} className="text-gold" />, label: 'Showroom', value: 'Av. Larco 1234, Miraflores', sub: 'Lima, Perú — solo con cita previa' },
            ].map((item) => (
              <div key={item.label} className="flex gap-4 p-5 bg-white border border-gray-light rounded-2xl">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                <div>
                  <p className="text-xs text-gray-text font-sans uppercase tracking-wide">{item.label}</p>
                  <p className="font-semibold font-sans text-charcoal text-sm mt-0.5">{item.value}</p>
                  <p className="text-xs text-gray-text font-sans mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="bg-white border border-gray-light rounded-2xl p-5">
              <p className="font-semibold font-sans text-charcoal text-sm mb-4">Síguenos en redes</p>
              <div className="flex gap-3">
                {[
                  { icon: <InstagramIcon size={18} />, label: '@cazanastore', color: 'hover:bg-pink-50 hover:border-pink-400 hover:text-pink-600' },
                  { icon: <TikTokIcon size={18} />, label: '@cazana', color: 'hover:bg-gray-100 hover:border-gray-600 hover:text-gray-900' },
                  { icon: <FacebookIcon size={18} />, label: '/cazanastore', color: 'hover:bg-blue-50 hover:border-blue-500 hover:text-blue-700' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    className={`flex flex-col items-center gap-1 flex-1 border border-gray-mid rounded-xl py-3 text-charcoal-light text-xs font-sans transition-all ${s.color}`}
                  >
                    {s.icon}
                    <span className="text-[10px]">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl text-charcoal mb-6">Envíanos un mensaje</h2>
            {sent ? (
              <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 bg-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">✓</span>
                </div>
                <h3 className="font-serif text-xl text-charcoal mb-2">¡Mensaje enviado!</h3>
                <p className="text-charcoal-light font-sans text-sm">Te responderemos en menos de 2 horas por el mismo correo. ¡Gracias por contactarnos!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Nombre *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Tu nombre"
                      required
                      className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Correo electrónico *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="tu@correo.com"
                      required
                      className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Asunto *</label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    required
                    className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold text-charcoal"
                  >
                    <option value="">Selecciona un asunto</option>
                    <option>Consulta sobre un producto</option>
                    <option>Estado de mi pedido</option>
                    <option>Devolución o garantía</option>
                    <option>Problema con mi pago</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Mensaje *</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    required
                    rows={6}
                    className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans py-4 px-10 rounded-full transition-colors text-sm"
                >
                  Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FAQ strip */}
      <section className="bg-gray-light py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl text-charcoal mb-8 text-center">Preguntas Frecuentes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { q: '¿Cuánto tarda la entrega?', a: 'Garantizamos entrega en 24–48 horas hábiles en Lima. Para otras ciudades puede ser 3–5 días.' },
              { q: '¿Puedo devolver un producto?', a: 'Sí, tienes 30 días desde la recepción para devolver cualquier producto en su estado original.' },
              { q: '¿Cómo rastro mi pedido?', a: 'Recibirás un número de seguimiento por email cuando tu pedido sea despachado.' },
              { q: '¿Qué métodos de pago aceptan?', a: 'Tarjeta de crédito/débito, transferencia bancaria, Yape, Plin y PayPal.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl p-5">
                <h4 className="font-sans font-semibold text-sm text-charcoal mb-2">{faq.q}</h4>
                <p className="text-sm text-charcoal-light font-sans leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
