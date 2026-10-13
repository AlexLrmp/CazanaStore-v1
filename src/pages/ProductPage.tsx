import { useState } from 'react';
import type { Product, Page } from '../types';
import { getProductById, products, reviews } from '../data/products';
import {
  StarIcon, PlusIcon, MinusIcon, TruckIcon, ShieldIcon,
  HeartIcon, ChevronLeftIcon, ChevronRightIcon,
} from '../components/Icons';

interface ProductPageProps {
  productId: string;
  onNavigate: (page: Page, productId?: string) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  wishlist?: string[];
  onToggleWishlist?: (id: string) => void;
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarIcon key={s} size={16} className={s <= Math.round(rating) ? 'text-gold fill-gold' : 'text-gray-mid'} filled={s <= Math.round(rating)} />
        ))}
      </div>
      <span className="font-semibold text-charcoal font-sans text-sm">{rating}</span>
      <span className="text-gray-text font-sans text-sm">({count} reseñas)</span>
    </div>
  );
}

export default function ProductPage({ productId, onNavigate, onAddToCart, wishlist = [], onToggleWishlist }: ProductPageProps) {
  const product = getProductById(productId);
  const [imageIdx, setImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const wished = product ? wishlist.includes(product.id) : false;
  const [activeTab, setActiveTab] = useState<'desc' | 'features' | 'reviews'>('desc');

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="font-serif text-2xl text-charcoal mb-3">Producto no encontrado</p>
        <button onClick={() => onNavigate('catalog')} className="text-emerald font-sans font-semibold">
          Volver al catálogo
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    onAddToCart(product, quantity);
    onNavigate('checkout');
  };

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-sans text-gray-text mb-8">
        <button onClick={() => onNavigate('home')} className="hover:text-gold transition-colors">Inicio</button>
        <ChevronRightIcon size={12} />
        <button onClick={() => onNavigate('catalog')} className="hover:text-gold transition-colors">Catálogo</button>
        <ChevronRightIcon size={12} />
        <span className="text-charcoal capitalize">{product.category}</span>
        <ChevronRightIcon size={12} />
        <span className="text-charcoal line-clamp-1 max-w-xs">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square bg-gray-light rounded-3xl overflow-hidden mb-4">
            <img
              src={product.images[imageIdx]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => setImageIdx((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                >
                  <ChevronLeftIcon size={16} />
                </button>
                <button
                  onClick={() => setImageIdx((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-all"
                >
                  <ChevronRightIcon size={16} />
                </button>
              </>
            )}
            <div className="absolute top-4 left-4 flex flex-col gap-1">
              {product.isNew && <span className="bg-charcoal text-white text-xs font-bold font-sans px-3 py-1 rounded-full">NUEVO</span>}
              {product.isOffer && product.originalPrice && (
                <span className="bg-gold text-white text-xs font-bold font-sans px-3 py-1 rounded-full">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
          </div>
          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setImageIdx(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  imageIdx === i ? 'border-gold' : 'border-transparent hover:border-gray-mid'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div>
          <p className="text-xs text-gray-text font-sans uppercase tracking-widest mb-2">{product.subcategory}</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-charcoal font-bold leading-tight mb-4">{product.name}</h1>

          <StarRating rating={product.rating} count={product.reviewCount} />

          <div className="flex items-baseline gap-3 mt-5 mb-6">
            <span className="font-serif text-4xl text-charcoal font-bold">S/ {product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className="text-gray-text font-sans text-lg line-through">S/ {product.originalPrice.toFixed(2)}</span>
                <span className="bg-gold/15 text-gold-dark text-sm font-semibold font-sans px-2 py-0.5 rounded-full">
                  Ahorras S/ {(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-emerald' : 'bg-red-400'}`} />
            <span className="text-sm font-sans text-charcoal-light">
              {product.stock > 10
                ? 'En stock'
                : product.stock > 0
                ? `Solo quedan ${product.stock} unidades`
                : 'Sin stock'}
            </span>
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-sans text-charcoal font-medium">Cantidad:</span>
            <div className="flex items-center gap-3 border border-gray-mid rounded-full px-4 py-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="text-charcoal hover:text-gold transition-colors"
              >
                <MinusIcon size={14} />
              </button>
              <span className="text-sm font-semibold font-sans w-5 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="text-charcoal hover:text-gold transition-colors"
              >
                <PlusIcon size={14} />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 bg-emerald hover:bg-emerald-dark disabled:opacity-50 text-white font-semibold font-sans py-4 rounded-full transition-colors text-sm tracking-wide"
            >
              Comprar Ahora
            </button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex-1 border-2 font-semibold font-sans py-4 rounded-full transition-all text-sm ${
                added
                  ? 'border-emerald bg-emerald/10 text-emerald'
                  : 'border-charcoal hover:border-gold hover:text-gold text-charcoal'
              }`}
            >
              {added ? '✓ Agregado al carrito' : 'Agregar al Carrito'}
            </button>
            <button
              onClick={() => product && onToggleWishlist?.(product.id)}
              className={`w-14 border-2 rounded-full flex items-center justify-center transition-all ${
                wished ? 'border-red-400 bg-red-50 text-red-400' : 'border-gray-mid hover:border-gold text-gray-text hover:text-gold'
              }`}
            >
              <HeartIcon size={18} filled={wished} />
            </button>
          </div>

          {/* Trust signals */}
          <div className="bg-gray-light rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm font-sans text-charcoal-light">
              <TruckIcon size={20} className="text-gold shrink-0" />
              <span>Entrega garantizada en <strong className="text-charcoal">24–48 horas</strong> — Online, On Time</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-sans text-charcoal-light">
              <ShieldIcon size={20} className="text-gold shrink-0" />
              <span>Pago 100% seguro con encriptación SSL. <strong className="text-charcoal">Devolución en 30 días</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-light flex gap-6">
          {[
            { key: 'desc', label: 'Descripción' },
            { key: 'features', label: 'Características' },
            { key: 'reviews', label: `Reseñas (${product.reviewCount})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`pb-4 text-sm font-sans font-medium transition-all border-b-2 -mb-px ${
                activeTab === tab.key
                  ? 'border-gold text-charcoal'
                  : 'border-transparent text-gray-text hover:text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === 'desc' && (
            <p className="text-charcoal-light font-sans leading-relaxed max-w-2xl">{product.description}</p>
          )}
          {activeTab === 'features' && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 bg-gray-light rounded-xl p-3">
                  <span className="w-5 h-5 bg-gold/20 rounded-full flex items-center justify-center text-gold text-xs font-bold shrink-0">✓</span>
                  <span className="text-sm font-sans text-charcoal">{f}</span>
                </li>
              ))}
            </ul>
          )}
          {activeTab === 'reviews' && (
            <div className="space-y-5 max-w-2xl">
              {reviews.slice(0, 3).map((r) => (
                <div key={r.id} className="bg-gray-light rounded-2xl p-5">
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <StarIcon key={s} size={14} className="text-gold fill-gold" filled />
                    ))}
                  </div>
                  <p className="text-sm font-sans text-charcoal-light leading-relaxed mb-3">"{r.comment}"</p>
                  <div className="flex items-center gap-2">
                    <img src={r.avatar} alt={r.author} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="text-xs font-semibold font-sans text-charcoal">{r.author}</p>
                      <p className="text-[11px] text-gray-text font-sans">{r.city} · {r.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-8 pt-12 border-t border-gray-light">
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-8">Productos Relacionados</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <div
                key={p.id}
                onClick={() => { onNavigate('product', p.id); setImageIdx(0); setQuantity(1); }}
                className="group bg-white border border-gray-light hover:border-gold/40 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="aspect-square bg-gray-light overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3">
                  <h3 className="font-sans font-medium text-charcoal text-xs line-clamp-2 mb-1">{p.name}</h3>
                  <span className="font-bold text-charcoal font-sans text-sm">S/ {p.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
