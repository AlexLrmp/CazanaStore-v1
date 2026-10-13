import { useState } from 'react';
import type { CartItem, Page, Product } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import ChatWidget from './components/ChatWidget';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

export type UserRole = 'guest' | 'client' | 'admin';

export interface CatalogNavOpts {
  category?: 'all' | 'hogar' | 'tecnologia';
  onlyOffers?: boolean;
  onlyNew?: boolean;
  search?: string;
}

export default function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Catalog config with version counter — incrementing version forces CatalogPage re-mount
  const [catalogConfig, setCatalogConfig] = useState<{
    category: 'all' | 'hogar' | 'tecnologia';
    onlyOffers: boolean;
    onlyNew: boolean;
    search: string;
    version: number;
  }>({ category: 'all', onlyOffers: false, onlyNew: false, search: '', version: 0 });

  const navigate = (p: Page, productId?: string) => {
    setPage(p);
    if (productId !== undefined) setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateCatalog = (opts: CatalogNavOpts) => {
    setCatalogConfig((prev) => ({
      category: opts.category ?? 'all',
      onlyOffers: opts.onlyOffers ?? false,
      onlyNew: opts.onlyNew ?? false,
      search: opts.search ?? '',
      version: prev.version + 1,
    }));
    setPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.product.id !== productId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
      );
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        onNavigate={navigate}
        onNavigateCatalog={navigateCatalog}
        onCartOpen={() => setCartOpen(true)}
        onChatOpen={() => setChatOpen(true)}
        userRole={userRole}
      />

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={updateQuantity}
        onRemove={(id) => setCart((prev) => prev.filter((i) => i.product.id !== id))}
        onCheckout={() => { setCartOpen(false); navigate('checkout'); }}
        onNavigate={navigate}
        total={cartTotal}
      />

      <ChatWidget
        isOpen={chatOpen}
        onOpen={() => setChatOpen(true)}
        onClose={() => setChatOpen(false)}
      />

      <main className="flex-1">
        {page === 'home' && (
          <HomePage
            onNavigate={navigate}
            onNavigateCatalog={navigateCatalog}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />
        )}
        {page === 'catalog' && (
          <CatalogPage
            key={catalogConfig.version}
            onNavigate={navigate}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            initialCategory={catalogConfig.category}
            initialOnlyOffers={catalogConfig.onlyOffers}
            initialOnlyNew={catalogConfig.onlyNew}
            initialSearch={catalogConfig.search}
          />
        )}
        {page === 'product' && selectedProductId && (
          <ProductPage
            productId={selectedProductId}
            onNavigate={navigate}
            onAddToCart={addToCart}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
          />
        )}
        {page === 'checkout' && (
          <CheckoutPage
            cart={cart}
            total={cartTotal}
            onComplete={() => { setCart([]); navigate('home'); }}
          />
        )}
        {page === 'account' && (
          <AccountPage
            userRole={userRole}
            onSetRole={setUserRole}
            onNavigate={navigate}
            wishlist={wishlist}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
          />
        )}
        {page === 'about' && <AboutPage onNavigate={navigate} />}
        {page === 'contact' && <ContactPage />}
        {page === 'admin' && (
          <AdminPage
            adminLoggedIn={adminLoggedIn}
            onAdminLogin={() => { setAdminLoggedIn(true); setUserRole('admin'); }}
          />
        )}
      </main>

      <Footer onNavigate={navigate} onNavigateCatalog={navigateCatalog} />
    </div>
  );
}
