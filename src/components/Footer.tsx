import type { Page } from '../types';
import type { CatalogNavOpts } from '../App';
import { TruckIcon, ShieldIcon, InstagramIcon, FacebookIcon, TikTokIcon, MailIcon, PhoneIcon } from './Icons';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onNavigateCatalog: (opts: CatalogNavOpts) => void;
}

export default function Footer({ onNavigate, onNavigateCatalog }: FooterProps) {
  return (
    <footer className="bg-charcoal text-white mt-20">
      {/* Trust bar */}
      <div className="border-b border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center gap-8 md:gap-16">
          {[
            { icon: <TruckIcon size={24} className="text-gold" />, title: 'Entrega 24–48h', sub: 'Online, On Time' },
            { icon: <ShieldIcon size={24} className="text-gold" />, title: 'Pago 100% Seguro', sub: 'SSL y encriptación' },
            { icon: <span className="text-xl text-gold">↩</span>, title: 'Devoluciones', sub: '30 días sin preguntas' },
            { icon: <span className="text-xl text-gold">💬</span>, title: 'Soporte 24/7', sub: 'WhatsApp y chat' },
          ].map((v, i) => (
            <div key={i} className="flex items-center gap-3">
              {v.icon}
              <div>
                <p className="text-sm font-semibold font-sans">{v.title}</p>
                <p className="text-xs text-white/60 font-sans">{v.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <span className="text-gold-gradient font-serif text-2xl font-bold block">CAZANA</span>
          <span className="font-sans text-white/70 text-xs tracking-[0.2em] uppercase">STORE</span>
          <p className="text-sm text-white/60 font-sans leading-relaxed mt-3 mb-4">
            Tu destino premium para hogar y tecnología. <em className="text-gold not-italic">Online, On Time</em>.
          </p>
          <div className="flex gap-3">
            {[
              { icon: <InstagramIcon size={16} /> },
              { icon: <TikTokIcon size={16} /> },
              { icon: <FacebookIcon size={16} /> },
            ].map((s, i) => (
              <a key={i} href="#" className="w-9 h-9 bg-white/10 hover:bg-gold/20 rounded-full flex items-center justify-center text-white/70 hover:text-gold transition-all">
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Categorías */}
        <div>
          <h4 className="font-sans font-semibold text-sm tracking-widest uppercase text-gold mb-4">Categorías</h4>
          <ul className="space-y-2">
            {[
              { label: 'Hogar', opts: { category: 'hogar' as const } },
              { label: 'Tecnología', opts: { category: 'tecnologia' as const } },
              { label: 'Ofertas', opts: { onlyOffers: true } },
              { label: 'Nuevos Ingresos', opts: { onlyNew: true } },
            ].map((item) => (
              <li key={item.label}>
                <button onClick={() => onNavigateCatalog(item.opts)} className="text-sm text-white/60 hover:text-gold font-sans transition-colors text-left">
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-sans font-semibold text-sm tracking-widest uppercase text-gold mb-4">Información</h4>
          <ul className="space-y-2">
            {[
              { label: 'Nosotros', page: 'about' as Page },
              { label: 'Contacto', page: 'contact' as Page },
              { label: 'Mi cuenta', page: 'account' as Page },
            ].map((link) => (
              <li key={link.label}>
                <button onClick={() => onNavigate(link.page)} className="text-sm text-white/60 hover:text-gold font-sans transition-colors text-left">
                  {link.label}
                </button>
              </li>
            ))}
            {['Política de envíos', 'Devoluciones', 'Términos y condiciones', 'Privacidad'].map((item) => (
              <li key={item}><a href="#" className="text-sm text-white/60 hover:text-gold font-sans transition-colors">{item}</a></li>
            ))}
          </ul>
        </div>

        {/* Contacto + Newsletter */}
        <div>
          <h4 className="font-sans font-semibold text-sm tracking-widest uppercase text-gold mb-4">Contacto</h4>
          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-white/60 font-sans"><PhoneIcon size={14} className="text-gold shrink-0" />+51 999 123 456</li>
            <li className="flex items-center gap-2 text-sm text-white/60 font-sans"><MailIcon size={14} className="text-gold shrink-0" />hola@cazanastore.com</li>
          </ul>
          <h4 className="font-sans font-semibold text-sm tracking-widest uppercase text-gold mb-3">Newsletter</h4>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="tu@email.com" className="flex-1 bg-white/10 border border-white/20 rounded-full px-3 py-2 text-xs font-sans text-white placeholder-white/40 focus:outline-none focus:border-gold min-w-0" />
            <button type="submit" className="bg-gold hover:bg-gold-dark text-white text-xs font-semibold font-sans px-4 py-2 rounded-full transition-colors whitespace-nowrap">
              Suscribir
            </button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-white/40 font-sans">© 2026 Cazana Store. Todos los derechos reservados.</p>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 font-sans">Pagos seguros:</span>
            <div className="flex gap-2 text-white/50 text-xs font-sans">
              {['Visa', 'Mastercard', 'Yape', 'Plin', 'PayPal'].map((p) => (
                <span key={p} className="bg-white/10 px-2 py-0.5 rounded">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
