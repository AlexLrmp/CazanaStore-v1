import { useState, useMemo } from 'react';
import type { Product, Page } from '../types';
import { products } from '../data/products';
import { SearchIcon, StarIcon, HeartIcon } from '../components/Icons';

interface CatalogPageProps {
  onNavigate: (page: Page, productId?: string) => void;
  onAddToCart: (product: Product) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  initialCategory?: 'all' | 'hogar' | 'tecnologia';
  initialOnlyOffers?: boolean;
  initialOnlyNew?: boolean;
  initialSearch?: string;
}

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} size={11} className={s <= Math.round(rating) ? 'text-gold fill-gold' : 'text-gray-mid'} filled={s <= Math.round(rating)} />
      ))}
    </div>
  );
}

export default function CatalogPage({
  onNavigate, onAddToCart, wishlist, onToggleWishlist,
  initialCategory = 'all', initialOnlyOffers = false, initialOnlyNew = false, initialSearch = '',
}: CatalogPageProps) {
  // These are initial values — component re-mounts on each catalog navigation (key prop in App.tsx)
  const [category, setCategory] = useState<'all' | 'hogar' | 'tecnologia'>(initialCategory);
  const [sort, setSort] = useState<SortOption>('relevance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOffers, setOnlyOffers] = useState(initialOnlyOffers);
  const [onlyNew, setOnlyNew] = useState(initialOnlyNew);
  const [search, setSearch] = useState(initialSearch);
  const [adding, setAdding] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (onlyInStock) list = list.filter((p) => p.stock > 0);
    if (onlyOffers) list = list.filter((p) => p.isOffer);
    if (onlyNew) list = list.filter((p) => p.isNew);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'rating': return list.sort((a, b) => b.rating - a.rating);
      case 'newest': return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default: return list.sort((a, b) => b.sold - a.sold);
    }
  }, [category, sort, priceRange, onlyInStock, onlyOffers, onlyNew, search]);

  const handleAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setAdding(product.id);
    onAddToCart(product);
    setTimeout(() => setAdding(null), 1000);
  };

  const resetFilters = () => {
    setCategory('all'); setSort('relevance'); setPriceRange([0, 1000]);
    setOnlyInStock(false); setOnlyOffers(false); setOnlyNew(false); setSearch('');
  };

  // Build page title based on active filters
  const pageTitle =
    onlyOffers ? 'Ofertas Especiales' :
    onlyNew ? 'Nuevos Ingresos' :
    category === 'hogar' ? 'Artículos para el Hogar' :
    category === 'tecnologia' ? 'Tecnología' :
    search ? `Resultados para "${search}"` :
    'Catálogo Completo';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">{pageTitle}</h1>
        <p className="text-gray-text font-sans text-sm mt-1">{filtered.length} productos encontrados</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-60 shrink-0">
          <div className="bg-white border border-gray-light rounded-2xl p-5 sticky top-24 space-y-6">
            {/* Search */}
            <div>
              <h3 className="font-sans font-semibold text-xs text-charcoal mb-2.5 uppercase tracking-widest">Buscar</h3>
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nombre, categoría..."
                  className="w-full border border-gray-mid rounded-full py-2 pl-4 pr-8 text-xs font-sans focus:outline-none focus:border-gold"
                />
                <SearchIcon size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text" />
              </div>
            </div>

            {/* Category */}
            <div>
              <h3 className="font-sans font-semibold text-xs text-charcoal mb-2.5 uppercase tracking-widest">Categoría</h3>
              <div className="space-y-2">
                {[
                  { value: 'all', label: 'Todo el catálogo' },
                  { value: 'hogar', label: 'Hogar' },
                  { value: 'tecnologia', label: 'Tecnología' },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="category" checked={category === opt.value} onChange={() => setCategory(opt.value as typeof category)} className="accent-gold" />
                    <span className="text-sm font-sans text-charcoal-light">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <h3 className="font-sans font-semibold text-xs text-charcoal mb-2.5 uppercase tracking-widest">Precio</h3>
              <div className="space-y-2">
                {[
                  { label: 'Hasta S/ 100', range: [0, 100] as [number, number] },
                  { label: 'S/ 100 – 200', range: [100, 200] as [number, number] },
                  { label: 'S/ 200 – 400', range: [200, 400] as [number, number] },
                  { label: 'Más de S/ 400', range: [400, 1000] as [number, number] },
                  { label: 'Todos', range: [0, 1000] as [number, number] },
                ].map((p) => (
                  <label key={p.label} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="price" checked={priceRange[0] === p.range[0] && priceRange[1] === p.range[1]} onChange={() => setPriceRange(p.range)} className="accent-gold" />
                    <span className="text-sm font-sans text-charcoal-light">{p.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div>
              <h3 className="font-sans font-semibold text-xs text-charcoal mb-2.5 uppercase tracking-widest">Filtros</h3>
              <div className="space-y-2">
                {[
                  { label: 'Solo disponibles', value: onlyInStock, set: setOnlyInStock },
                  { label: 'En oferta', value: onlyOffers, set: setOnlyOffers },
                  { label: 'Nuevos ingresos', value: onlyNew, set: setOnlyNew },
                ].map((f) => (
                  <label key={f.label} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={f.value} onChange={(e) => f.set(e.target.checked)} className="accent-gold" />
                    <span className="text-sm font-sans text-charcoal-light">{f.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button onClick={resetFilters} className="w-full text-center text-xs text-gray-text hover:text-gold font-sans transition-colors py-1">
              Limpiar filtros
            </button>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {/* Sort + quick tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-gray-light">
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Todo', fn: () => { setCategory('all'); setOnlyOffers(false); setOnlyNew(false); } },
                { label: 'Hogar', fn: () => { setCategory('hogar'); setOnlyOffers(false); setOnlyNew(false); } },
                { label: 'Tecnología', fn: () => { setCategory('tecnologia'); setOnlyOffers(false); setOnlyNew(false); } },
                { label: 'Ofertas', fn: () => { setCategory('all'); setOnlyOffers(true); setOnlyNew(false); } },
                { label: 'Nuevos', fn: () => { setCategory('all'); setOnlyNew(true); setOnlyOffers(false); } },
              ].map((t) => {
                const isActive =
                  (t.label === 'Todo' && category === 'all' && !onlyOffers && !onlyNew) ||
                  (t.label === 'Hogar' && category === 'hogar') ||
                  (t.label === 'Tecnología' && category === 'tecnologia') ||
                  (t.label === 'Ofertas' && onlyOffers) ||
                  (t.label === 'Nuevos' && onlyNew);
                return (
                  <button
                    key={t.label}
                    onClick={t.fn}
                    className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all ${isActive ? 'bg-charcoal text-white' : 'bg-gray-light text-charcoal-light hover:bg-gray-mid'}`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="text-xs font-sans border border-gray-mid rounded-full px-3 py-1.5 focus:outline-none focus:border-gold text-charcoal"
            >
              <option value="relevance">Relevancia</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="rating">Mejor valorados</option>
              <option value="newest">Nuevos primero</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-charcoal mb-2">Sin resultados</p>
              <p className="text-gray-text font-sans text-sm mb-4">Prueba con otros filtros</p>
              <button onClick={resetFilters} className="text-emerald font-semibold font-sans text-sm hover:underline">Limpiar filtros</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((product) => {
                const inWish = wishlist.includes(product.id);
                return (
                  <div
                    key={product.id}
                    onClick={() => onNavigate('product', product.id)}
                    className="group bg-white border border-gray-light hover:border-gold/40 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <div className="relative aspect-square bg-gray-light overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.isNew && <span className="bg-charcoal text-white text-[9px] font-bold font-sans px-2 py-0.5 rounded-full">NUEVO</span>}
                        {product.isOffer && product.originalPrice && (
                          <span className="bg-gold text-white text-[9px] font-bold font-sans px-2 py-0.5 rounded-full">
                            -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                          </span>
                        )}
                      </div>
                      {/* Wishlist */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
                        className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${inWish ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-text hover:text-red-400'}`}
                      >
                        <HeartIcon size={13} filled={inWish} />
                      </button>
                      {/* Add to cart */}
                      <button
                        onClick={(e) => handleAdd(e, product)}
                        className="absolute bottom-2 right-2 bg-emerald hover:bg-emerald-dark text-white text-[10px] font-semibold font-sans px-2.5 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md"
                      >
                        {adding === product.id ? '✓' : '+ Carrito'}
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-gray-text font-sans mb-0.5">{product.subcategory}</p>
                      <h3 className="font-sans font-medium text-charcoal text-xs leading-snug line-clamp-2 mb-1.5">{product.name}</h3>
                      <Stars rating={product.rating} />
                      <div className="flex items-center justify-between mt-2">
                        <div>
                          <span className="font-bold text-charcoal font-sans text-sm">S/ {product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-[10px] text-gray-text font-sans line-through ml-1">S/ {product.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        {product.stock <= 5 && product.stock > 0 && <span className="text-[9px] text-orange-500 font-sans font-medium">¡Últimas!</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
