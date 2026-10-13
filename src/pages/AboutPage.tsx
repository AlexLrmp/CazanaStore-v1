import type { Page } from '../types';
import { TruckIcon, ShieldIcon, HeadsetIcon, InfoIcon } from '../components/Icons';

interface AboutPageProps {
  onNavigate: (page: Page) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&h=600&fit=crop&auto=format&q=80"
          alt="Cazana Store"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/70" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase block mb-3">Nuestra historia</span>
            <h1 className="font-serif text-4xl sm:text-5xl text-white font-bold">Sobre Cazana Store</h1>
            <p className="text-white/70 font-sans mt-3 max-w-xl">Tu destino premium para hogar y tecnología — <em className="text-gold not-italic">Online, On Time</em></p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase block mb-3">Quiénes somos</span>
            <h2 className="font-serif text-3xl text-charcoal mb-5">Nacimos para hacer la diferencia</h2>
            <p className="text-charcoal-light font-sans leading-relaxed mb-4">
              Cazana Store nació en Lima, Perú, con una misión clara: traer productos de calidad premium para el hogar y la tecnología al alcance de todos, sin sacrificar la experiencia de compra.
            </p>
            <p className="text-charcoal-light font-sans leading-relaxed mb-4">
              Combinamos lo mejor de dos mundos: la confianza y variedad de un marketplace como Amazon, con el cuidado y curación de una boutique de alta gama. Cada producto en nuestro catálogo pasa por un proceso de selección riguroso.
            </p>
            <p className="text-charcoal-light font-sans leading-relaxed">
              Nuestra promesa es simple: <strong className="text-charcoal">Online, On Time</strong>. Compramos que tu pedido llegue en 24–48 horas, con la atención personalizada que mereces.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27272f0a86a6?w=600&h=500&fit=crop&auto=format&q=80"
              alt="Nuestro equipo"
              className="rounded-3xl w-full object-cover"
            />
            <div className="absolute -bottom-4 -left-4 bg-gold text-white rounded-2xl p-4 shadow-xl">
              <p className="font-serif text-2xl font-bold">+2,000</p>
              <p className="text-xs font-sans">clientes satisfechos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-light py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase">Lo que nos mueve</span>
            <h2 className="font-serif text-3xl text-charcoal mt-2">Nuestros Valores</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: <TruckIcon size={36} className="text-gold" />,
                title: 'Velocidad de Entrega',
                desc: 'Nos comprometemos con un tiempo de entrega visible desde la home, no solo en el checkout. Nuestro slogan "Online, On Time" es una promesa que cumplimos todos los días.',
              },
              {
                icon: <HeadsetIcon size={36} className="text-gold" />,
                title: 'Hospitalidad y Trato',
                desc: 'Atención cercana y personalizada, no un bot frío. Nuestro equipo está disponible 24/7 por WhatsApp y chat para resolver cualquier duda antes, durante y después de tu compra.',
              },
              {
                icon: <InfoIcon size={36} className="text-gold" />,
                title: 'Claridad al Explicar',
                desc: 'Fichas de producto completas, sin letra chica ni ambigüedad. Soporte que resuelve dudas de forma simple y directa. Sabemos que una compra informada es una compra feliz.',
              },
              {
                icon: <ShieldIcon size={36} className="text-gold" />,
                title: 'Compra 100% Segura',
                desc: 'Integración con pasarelas de pago seguras: Culqi, Niubiz, Mercado Pago y PayPal. Encriptación SSL de 256 bits en cada transacción. Tu dinero siempre protegido.',
              },
            ].map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-7 flex gap-5">
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center shrink-0">{v.icon}</div>
                <div>
                  <h3 className="font-sans font-semibold text-charcoal mb-2">{v.title}</h3>
                  <p className="text-sm text-charcoal-light font-sans leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-charcoal py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '+2,000', label: 'Clientes felices' },
              { value: '98%', label: 'Satisfacción' },
              { value: '24h', label: 'Entrega promedio' },
              { value: '+100', label: 'Productos premium' },
            ].map((s, i) => (
              <div key={i}>
                <p className="font-serif text-4xl text-gold font-bold">{s.value}</p>
                <p className="text-white/60 text-sm font-sans mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center px-4">
        <h2 className="font-serif text-3xl text-charcoal mb-4">¿Listo para empezar?</h2>
        <p className="text-gray-text font-sans mb-8">Descubre nuestro catálogo completo de productos premium.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans px-8 py-4 rounded-full transition-colors text-sm"
          >
            Ver Catálogo
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="border-2 border-charcoal hover:border-gold hover:text-gold text-charcoal font-semibold font-sans px-8 py-4 rounded-full transition-all text-sm"
          >
            Contactar
          </button>
        </div>
      </section>
    </div>
  );
}
