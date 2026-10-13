import { useState } from 'react';
import type { Page } from '../types';
import type { CatalogNavOpts, UserRole } from '../App';
import { SearchIcon, CartIcon, UserIcon, MenuIcon, CloseIcon, HeartIcon } from './Icons';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  onNavigate: (page: Page, productId?: string) => void;
  onNavigateCatalog: (opts: CatalogNavOpts) => void;
  onCartOpen: () => void;
  onChatOpen: () => void;
  userRole: UserRole;
}

export default function Header({
  cartCount, wishlistCount, onNavigate, onNavigateCatalog, onCartOpen, userRole,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateCatalog({ search: search.trim(), category: 'all', onlyOffers: false, onlyNew: false });
    setMobileOpen(false);
  };

  const navItems = [
    { label: 'Hogar', action: () => onNavigateCatalog({ category: 'hogar' }) },
    { label: 'Tecnología', action: () => onNavigateCatalog({ category: 'tecnologia' }) },
    { label: 'Ofertas', action: () => onNavigateCatalog({ onlyOffers: true, category: 'all' }) },
    { label: 'Nuevos', action: () => onNavigateCatalog({ onlyNew: true, category: 'all' }) },
    { label: 'Nosotros', action: () => onNavigate('about') },
    { label: 'Contacto', action: () => onNavigate('contact') },
  ];

  const handleNav = (action: () => void) => {
    action();
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top promo bar */}
      <div className="bg-charcoal text-white text-xs py-2 px-4 text-center font-sans tracking-wide">
        🚚 Envío gratis en compras mayores a <span className="text-gold font-semibold">S/ 150</span> — Entrega garantizada 24–48h
      </div>

      {/* Main row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 py-4">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex flex-col items-start shrink-0 group">
            <span className="text-gold-gradient font-serif text-2xl font-bold leading-none tracking-wide group-hover:opacity-90 transition-opacity">
              CAZANA
            </span>
            <div className="flex items-center gap-1">
              <span className="font-sans text-charcoal text-xs font-semibold tracking-[0.2em] uppercase leading-none">STORE</span>
              <span className="text-gray-text text-[10px] font-sans italic leading-none ml-1 hidden sm:inline">— Online, On Time</span>
            </div>
          </button>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 hidden sm:flex">
            <div className="relative w-full max-w-2xl mx-auto">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos, marcas, categorías..."
                className="w-full border border-gray-mid rounded-full py-2.5 pl-5 pr-12 text-sm font-sans text-charcoal placeholder-gray-text focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-gold transition-colors">
                <SearchIcon size={18} />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Wishlist */}
            <button
              onClick={() => onNavigate('account')}
              className="relative flex flex-col items-center p-2 text-charcoal hover:text-gold transition-colors group"
              title="Favoritos"
            >
              <HeartIcon size={21} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="text-[10px] font-sans mt-0.5 hidden sm:block text-gray-text group-hover:text-gold">Favoritos</span>
            </button>

            {/* Account */}
            <button
              onClick={() => onNavigate('account')}
              className="flex flex-col items-center p-2 text-charcoal hover:text-gold transition-colors group"
              title="Mi cuenta"
            >
              <UserIcon size={21} />
              <span className="text-[10px] font-sans mt-0.5 hidden sm:block text-gray-text group-hover:text-gold">
                {userRole === 'guest' ? 'Ingresar' : userRole === 'admin' ? 'Admin' : 'Mi cuenta'}
              </span>
            </button>

            {/* Cart */}
            <button
              onClick={onCartOpen}
              className="relative flex flex-col items-center p-2 text-charcoal hover:text-gold transition-colors group"
              title="Carrito"
            >
              <CartIcon size={21} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-emerald text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
              <span className="text-[10px] font-sans mt-0.5 hidden sm:block text-gray-text group-hover:text-gold">Carrito</span>
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="sm:hidden p-2 text-charcoal hover:text-gold transition-colors"
            >
              {mobileOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1 pb-3 border-t border-gray-light pt-2">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={item.action}
              className="px-4 py-1.5 text-sm font-sans font-medium text-charcoal-light hover:text-gold hover:bg-gray-light rounded-full transition-all"
            >
              {item.label}
            </button>
          ))}
          <div className="ml-auto flex gap-2">
            <button
              onClick={() => onNavigate('admin')}
              className="px-4 py-1.5 text-xs font-sans font-medium text-gray-text hover:text-gold border border-gray-mid hover:border-gold rounded-full transition-all"
            >
              Área Admin
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-gray-light px-4 pb-4">
          <form onSubmit={handleSearch} className="pt-4 pb-3">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full border border-gray-mid rounded-full py-2.5 pl-4 pr-12 text-sm font-sans focus:outline-none focus:border-gold"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-text hover:text-gold">
                <SearchIcon size={18} />
              </button>
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNav(item.action)}
                className="text-left px-3 py-2.5 text-sm font-sans font-medium text-charcoal hover:text-gold hover:bg-gray-light rounded-lg transition-all"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { onNavigate('admin'); setMobileOpen(false); }}
              className="text-left px-3 py-2.5 text-sm font-sans font-medium text-gray-text hover:text-gold hover:bg-gray-light rounded-lg"
            >
              Área Admin
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
