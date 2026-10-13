import { useState } from 'react';
import type { Page, Product } from '../types';
import type { UserRole } from '../App';
import { products } from '../data/products';
import { PackageIcon, UserIcon, MapPinIcon, LogoutIcon, ChevronRightIcon, HeartIcon, TrashIcon } from '../components/Icons';

interface AccountPageProps {
  userRole: UserRole;
  onSetRole: (role: UserRole) => void;
  onNavigate: (page: Page) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

type Tab = 'orders' | 'profile' | 'addresses' | 'wishlist';

const mockOrders = [
  {
    id: 'CAZ-2026-8821', date: '20 Sep 2026', status: 'enviado' as const, tracking: 'OLVA-4892817',
    items: [{ name: 'Auriculares Noise Cancelling Pro X', qty: 1, price: 199.99 }, { name: 'Cargador Inalámbrico 15W', qty: 2, price: 34.99 }],
    total: 269.97,
  },
  {
    id: 'CAZ-2026-7654', date: '12 Sep 2026', status: 'entregado' as const, tracking: 'OLVA-4712233',
    items: [{ name: 'Cafetera Espresso Premium 1200W', qty: 1, price: 89.99 }],
    total: 89.99,
  },
  {
    id: 'CAZ-2026-6103', date: '5 Sep 2026', status: 'entregado' as const, tracking: 'SHALOM-22019',
    items: [{ name: 'Juego de Ollas Inox 12 Piezas', qty: 1, price: 149.99 }, { name: 'Licuadora de Alta Potencia', qty: 1, price: 74.99 }],
    total: 224.98,
  },
];

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700' },
  procesando: { label: 'Procesando', color: 'bg-blue-100 text-blue-700' },
  enviado: { label: 'En camino', color: 'bg-gold/15 text-gold-dark' },
  entregado: { label: 'Entregado', color: 'bg-emerald/15 text-emerald' },
};

export default function AccountPage({ userRole, onSetRole, onNavigate, wishlist, onToggleWishlist, onAddToCart }: AccountPageProps) {
  const [tab, setTab] = useState<Tab>('orders');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginMode, setLoginMode] = useState<null | 'client' | 'admin'>(null);
  const [profile, setProfile] = useState({ name: 'María García', email: 'maria@email.com', phone: '+51 999 555 888' });

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleLogout = () => {
    onSetRole('guest');
    onNavigate('home');
  };

  // Role selection screen
  if (userRole === 'guest' && loginMode === null) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="text-center mb-10">
            <span className="text-gold-gradient font-serif text-3xl font-bold block mb-1">CAZANA</span>
            <p className="text-gray-text font-sans text-sm">¿Cómo deseas ingresar?</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Cliente */}
            <button
              onClick={() => setLoginMode('client')}
              className="bg-white border-2 border-gray-light hover:border-emerald rounded-3xl p-8 flex flex-col items-center gap-4 transition-all hover:shadow-lg group"
            >
              <div className="w-16 h-16 bg-emerald/10 rounded-2xl flex items-center justify-center group-hover:bg-emerald/20 transition-colors">
                <UserIcon size={32} className="text-emerald" />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl text-charcoal mb-1">Soy Cliente</h3>
                <p className="text-xs text-gray-text font-sans">Ver mis pedidos, favoritos y perfil</p>
              </div>
              <span className="mt-auto bg-emerald text-white text-xs font-semibold font-sans px-5 py-2 rounded-full group-hover:bg-emerald-dark transition-colors">
                Ingresar como cliente
              </span>
            </button>

            {/* Admin */}
            <button
              onClick={() => onNavigate('admin')}
              className="bg-white border-2 border-gray-light hover:border-gold rounded-3xl p-8 flex flex-col items-center gap-4 transition-all hover:shadow-lg group"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-gold">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="font-serif text-xl text-charcoal mb-1">Administrador</h3>
                <p className="text-xs text-gray-text font-sans">Panel de control y estadísticas</p>
              </div>
              <span className="mt-auto bg-gold text-white text-xs font-semibold font-sans px-5 py-2 rounded-full group-hover:bg-gold-dark transition-colors">
                Ir al panel admin
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Client login form
  if (userRole === 'guest' && loginMode === 'client') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <button onClick={() => setLoginMode(null)} className="flex items-center gap-1 text-gray-text hover:text-gold font-sans text-sm mb-6 transition-colors">
            ← Volver
          </button>
          <div className="bg-white border border-gray-light rounded-3xl p-8 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <UserIcon size={28} className="text-emerald" />
              </div>
              <h2 className="font-serif text-2xl text-charcoal">Iniciar Sesión</h2>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); onSetRole('client'); }} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Correo electrónico</label>
                <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="tu@correo.com" required className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
              </div>
              <div>
                <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Contraseña</label>
                <input type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} placeholder="••••••••" required className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
              </div>
              <button type="submit" className="w-full bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans py-4 rounded-full transition-colors">
                Ingresar
              </button>
            </form>
            <div className="mt-5 text-center">
              <p className="text-xs text-gray-text font-sans">¿No tienes cuenta? <button onClick={() => onSetRole('client')} className="text-gold font-semibold hover:underline">Regístrate gratis</button></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Client dashboard
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Mi Cuenta</h1>
          <p className="text-gray-text font-sans text-sm mt-1">Bienvenida, <span className="text-charcoal font-medium">{profile.name}</span></p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-text hover:text-red-500 font-sans text-sm transition-colors">
          <LogoutIcon size={16} />
          Cerrar sesión
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <div className="bg-white border border-gray-light rounded-2xl overflow-hidden">
            {[
              { key: 'orders', label: 'Mis Pedidos', icon: <PackageIcon size={16} />, badge: mockOrders.filter(o => o.status === 'enviado').length },
              { key: 'wishlist', label: 'Mis Favoritos', icon: <HeartIcon size={16} />, badge: wishlist.length },
              { key: 'profile', label: 'Mis Datos', icon: <UserIcon size={16} /> },
              { key: 'addresses', label: 'Direcciones', icon: <MapPinIcon size={16} /> },
            ].map((item, i) => (
              <button
                key={item.key}
                onClick={() => setTab(item.key as Tab)}
                className={`w-full flex items-center justify-between px-5 py-4 text-sm font-sans transition-all ${tab === item.key ? 'bg-gold/10 text-gold font-semibold border-l-2 border-gold' : 'text-charcoal-light hover:bg-gray-light'} ${i > 0 ? 'border-t border-gray-light' : ''}`}
              >
                <span className="flex items-center gap-2">{item.icon} {item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge ? <span className="bg-gold text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{item.badge}</span> : null}
                  <ChevronRightIcon size={14} />
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1">
          {/* Orders */}
          {tab === 'orders' && (
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-charcoal mb-5">Historial de Pedidos</h2>
              {mockOrders.map((order) => {
                const cfg = statusConfig[order.status];
                return (
                  <div key={order.id} className="bg-white border border-gray-light rounded-2xl p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                      <div>
                        <span className="text-xs text-gray-text font-sans">Pedido #</span>
                        <span className="font-semibold font-sans text-charcoal text-sm ml-1">{order.id}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-text font-sans">{order.date}</span>
                        <span className={`text-xs font-semibold font-sans px-3 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm font-sans text-charcoal-light">
                          <span>{item.name} ×{item.qty}</span>
                          <span>S/ {(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-light">
                      <div className="text-xs text-gray-text font-sans">
                        {order.tracking && <span>Seguimiento: <strong className="text-charcoal">{order.tracking}</strong></span>}
                      </div>
                      <span className="font-bold font-sans text-charcoal">S/ {order.total.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Wishlist */}
          {tab === 'wishlist' && (
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-5">Mis Favoritos</h2>
              {wishlistProducts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-light rounded-full flex items-center justify-center mx-auto mb-4">
                    <HeartIcon size={28} className="text-gray-text" />
                  </div>
                  <p className="font-serif text-lg text-charcoal mb-2">Sin favoritos aún</p>
                  <p className="text-gray-text font-sans text-sm">Guarda los productos que te gusten con el ícono ♡</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlistProducts.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-light rounded-2xl p-4 flex gap-4">
                      <img src={product.image} alt={product.name} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-text font-sans">{product.subcategory}</p>
                        <h4 className="font-sans font-medium text-charcoal text-sm line-clamp-2 mt-0.5">{product.name}</h4>
                        <p className="font-bold text-charcoal font-sans mt-1">S/ {product.price.toFixed(2)}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => onAddToCart(product)}
                            className="bg-emerald hover:bg-emerald-dark text-white text-xs font-semibold font-sans px-3 py-1.5 rounded-full transition-colors"
                          >
                            Agregar al carrito
                          </button>
                          <button
                            onClick={() => onToggleWishlist(product.id)}
                            className="text-gray-text hover:text-red-500 transition-colors p-1.5"
                          >
                            <TrashIcon size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile */}
          {tab === 'profile' && (
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-6">Mis Datos Personales</h2>
              <div className="bg-white border border-gray-light rounded-2xl p-6 space-y-4 max-w-md">
                {[
                  { key: 'name', label: 'Nombre completo' },
                  { key: 'email', label: 'Correo electrónico' },
                  { key: 'phone', label: 'Teléfono' },
                ].map((f) => (
                  <div key={f.key}>
                    <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">{f.label}</label>
                    <input type="text" value={profile[f.key as keyof typeof profile]} onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Nueva contraseña</label>
                  <input type="password" placeholder="Dejar en blanco para no cambiar" className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                </div>
                <button className="bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans py-3 px-8 rounded-full transition-colors text-sm">
                  Guardar cambios
                </button>
              </div>
            </div>
          )}

          {/* Addresses */}
          {tab === 'addresses' && (
            <div>
              <h2 className="font-serif text-xl text-charcoal mb-6">Mis Direcciones</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border-2 border-gold/30 rounded-2xl p-5 relative">
                  <span className="absolute top-3 right-3 bg-gold/15 text-gold text-[10px] font-bold font-sans px-2 py-0.5 rounded-full">PRINCIPAL</span>
                  <MapPinIcon size={20} className="text-gold mb-2" />
                  <p className="font-semibold font-sans text-sm text-charcoal">María García</p>
                  <p className="text-sm text-charcoal-light font-sans">Av. Larco 1234, Dpto 5B</p>
                  <p className="text-sm text-charcoal-light font-sans">Miraflores, Lima 15074</p>
                  <p className="text-sm text-charcoal-light font-sans">+51 999 555 888</p>
                </div>
                <button className="border-2 border-dashed border-gray-mid hover:border-gold rounded-2xl p-5 flex flex-col items-center justify-center gap-2 text-gray-text hover:text-gold transition-all">
                  <span className="text-2xl">+</span>
                  <span className="text-sm font-sans">Agregar dirección</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
