import { useState } from 'react';
import type { Product, Page } from '../types';
import { products, reviews, getBestsellers, getNewArrivals } from '../data/products';
import type { CatalogNavOpts } from '../App';
import { TruckIcon, ShieldIcon, HeadsetIcon, InfoIcon, StarIcon, ChevronRightIcon, HeartIcon } from '../components/Icons';

interface HomePageProps {
  onNavigate: (page: Page, productId?: string) => void;
  onNavigateCatalog: (opts: CatalogNavOpts) => void;
  onAddToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} size={12} className={s <= Math.round(rating) ? 'text-gold fill-gold' : 'text-gray-mid'} filled={s <= Math.round(rating)} />
      ))}
    </div>
  );
}

function ProductCard({
  product, onNavigate, onAddToCart, wishlist, onToggleWishlist,
}: { product: Product; onNavigate: (p: Page, id?: string) => void; onAddToCart: (p: Product) => void; wishlist: string[]; onToggleWishlist: (id: string) => void }) {
  const [adding, setAdding] = useState(false);
  const inWish = wishlist.includes(product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    onAddToCart(product);
    setTimeout(() => setAdding(false), 1000);
  };

  return (
    <div
      onClick={() => onNavigate('product', product.id)}
      className="group bg-white border border-gray-light hover:border-gold/40 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="relative aspect-square bg-gray-light overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.isNew && <span className="bg-charcoal text-white text-[10px] font-semibold font-sans px-2 py-0.5 rounded-full">NUEVO</span>}
          {product.isOffer && product.originalPrice && (
            <span className="bg-gold text-white text-[10px] font-semibold font-sans px-2 py-0.5 rounded-full">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${inWish ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-text hover:text-red-400'}`}
        >
          <HeartIcon size={14} filled={inWish} />
        </button>
        <button
          onClick={handleAdd}
          className="absolute bottom-3 right-3 bg-emerald hover:bg-emerald-dark text-white text-xs font-semibold font-sans px-3 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg"
        >
          {adding ? '✓ Agregado' : '+ Carrito'}
        </button>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-text font-sans mb-1">{product.subcategory}</p>
        <h3 className="font-sans font-medium text-charcoal text-sm leading-snug line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={product.rating} />
          <span className="text-xs text-gray-text font-sans">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-bold text-charcoal font-sans text-lg">S/ {product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="text-xs text-gray-text font-sans line-through ml-2">S/ {product.originalPrice.toFixed(2)}</span>}
          </div>
          {product.stock <= 10 && <span className="text-[10px] text-orange-500 font-sans">Quedan {product.stock}</span>}
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ onNavigate, onNavigateCatalog, onAddToCart, wishlist, onToggleWishlist }: HomePageProps) {
  const bestsellers = getBestsellers();
  const newArrivals = getNewArrivals();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const cardProps = { onNavigate, onAddToCart, wishlist, onToggleWishlist };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1586023492125-27272f0a86a6?w=1920&h=900&fit=crop&auto=format&q=85" alt="Cazana Store" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-xl">
              <span className="inline-block bg-gold/20 border border-gold/40 text-gold text-xs font-sans font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide">
                ✦ Online, On Time — Entrega garantizada
              </span>
              <h1 className="font-serif text-5xl sm:text-6xl text-white font-bold leading-tight mb-5">
                Tu hogar,<br /><span className="text-gold-gradient">más inteligente</span>
              </h1>
              <p className="text-white/80 text-lg font-sans mb-8 leading-relaxed">
                Electrodomésticos y tecnología premium con entrega en 24–48 horas.
              </p>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => onNavigateCatalog({})} className="bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans px-8 py-4 rounded-full transition-all text-sm shadow-lg hover:-translate-y-0.5">
                  Comprar Ahora
                </button>
                <button onClick={() => onNavigateCatalog({})} className="border-2 border-gold/70 hover:border-gold text-gold hover:bg-gold/10 font-semibold font-sans px-8 py-4 rounded-full transition-all text-sm">
                  Ver Catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white border-b border-gray-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: <TruckIcon size={32} className="text-gold" />, title: 'Entrega 24–48h', desc: 'Online, On Time — siempre' },
              { icon: <HeadsetIcon size={32} className="text-gold" />, title: 'Atención Cercana', desc: 'Soporte real, no bots' },
              { icon: <InfoIcon size={32} className="text-gold" />, title: 'Información Clara', desc: 'Sin letra chica ni sorpresas' },
              { icon: <ShieldIcon size={32} className="text-gold" />, title: 'Compra Segura', desc: 'Pagos encriptados SSL' },
            ].map((v, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center">{v.icon}</div>
                <div>
                  <h3 className="font-sans font-semibold text-charcoal text-sm">{v.title}</h3>
                  <p className="text-xs text-gray-text font-sans mt-0.5">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mb-3">Nuestras Categorías</h2>
          <p className="text-gray-text font-sans">Lo mejor para tu hogar y tu vida digital</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Hogar', sub: 'Artículos para el', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&auto=format&q=80', opts: { category: 'hogar' as const } },
            { label: 'Tecnología', sub: 'Lo último en', img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&auto=format&q=80', opts: { category: 'tecnologia' as const } },
          ].map((cat) => (
            <button key={cat.label} onClick={() => onNavigateCatalog(cat.opts)} className="relative h-72 rounded-3xl overflow-hidden group text-left">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/30 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-gold/80 text-xs font-sans font-semibold tracking-widest uppercase block mb-1">{cat.sub}</span>
                <h3 className="font-serif text-3xl text-white font-bold">{cat.label}</h3>
                <span className="inline-flex items-center gap-1 text-white/80 text-sm font-sans mt-2 group-hover:text-gold transition-colors">
                  Explorar <ChevronRightIcon size={14} />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-gray-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase">Más populares</span>
              <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mt-1">Más Vendidos</h2>
            </div>
            <button onClick={() => onNavigateCatalog({})} className="hidden sm:flex items-center gap-1 text-sm font-sans text-gray-text hover:text-gold transition-colors">
              Ver todos <ChevronRightIcon size={16} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((p) => <ProductCard key={p.id} product={p} {...cardProps} />)}
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="bg-charcoal py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase block mb-2">Oferta especial</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold mb-3">Hasta 25% off en electrodomésticos</h2>
            <p className="text-white/60 font-sans text-sm">Válido hasta el 30 de septiembre.</p>
          </div>
          <button onClick={() => onNavigateCatalog({ onlyOffers: true })} className="bg-gold hover:bg-gold-dark text-white font-semibold font-sans px-10 py-4 rounded-full transition-all text-sm shrink-0 shadow-lg">
            Ver Ofertas
          </button>
        </div>
      </section>

      {/* New arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase">Recién llegados</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mt-1">Nuevos Ingresos</h2>
          </div>
          <button onClick={() => onNavigateCatalog({ onlyNew: true })} className="hidden sm:flex items-center gap-1 text-sm font-sans text-gray-text hover:text-gold transition-colors">
            Ver todos <ChevronRightIcon size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivals.map((p) => <ProductCard key={p.id} product={p} {...cardProps} />)}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-light py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase">Clientes felices</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mt-2">Reseñas Verificadas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[1,2,3,4,5].map((s) => <StarIcon key={s} size={14} className="text-gold fill-gold" filled />)}
                </div>
                <p className="text-sm text-charcoal-light font-sans leading-relaxed mb-4 line-clamp-3">"{r.comment}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.author} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <p className="font-sans font-semibold text-sm text-charcoal">{r.author}</p>
                    <p className="text-xs text-gray-text font-sans">{r.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All products preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase">Todo el catálogo</span>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mt-1">Explora Productos</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} {...cardProps} />)}
        </div>
        <div className="text-center mt-10">
          <button onClick={() => onNavigateCatalog({})} className="bg-charcoal hover:bg-charcoal-light text-white font-semibold font-sans px-10 py-4 rounded-full transition-colors text-sm">
            Ver todos los productos
          </button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gold/10 border-y border-gold/20 py-14">
        <div className="max-w-xl mx-auto px-4 text-center">
          <span className="text-gold text-xs font-sans font-semibold tracking-widest uppercase">Newsletter</span>
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mt-2 mb-3">Ofertas exclusivas en tu correo</h2>
          <p className="text-gray-text font-sans text-sm mb-6">Suscríbete y recibe un 10% de descuento en tu primera compra.</p>
          {subscribed ? (
            <div className="bg-emerald/10 border border-emerald/30 text-emerald rounded-2xl py-4 px-6 font-sans text-sm font-semibold">
              ✓ ¡Gracias! Revisa tu correo para confirmar la suscripción.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex gap-2 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" required className="flex-1 border border-gray-mid rounded-full py-3 px-5 text-sm font-sans focus:outline-none focus:border-gold min-w-0" />
              <button type="submit" className="bg-gold hover:bg-gold-dark text-white font-semibold font-sans px-6 py-3 rounded-full transition-colors text-sm whitespace-nowrap">
                Suscribir
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
