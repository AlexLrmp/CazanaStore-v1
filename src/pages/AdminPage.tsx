import { useState } from 'react';
import { products } from '../data/products';
import { BarChartIcon, PackageIcon, DownloadIcon, UserIcon, StarIcon } from '../components/Icons';

interface AdminPageProps {
  adminLoggedIn: boolean;
  onAdminLogin: () => void;
}

const monthlySales = [
  { month: 'Abr', amount: 18400, orders: 84 },
  { month: 'May', amount: 22100, orders: 103 },
  { month: 'Jun', amount: 28600, orders: 131 },
  { month: 'Jul', amount: 25300, orders: 117 },
  { month: 'Ago', amount: 31800, orders: 149 },
  { month: 'Sep', amount: 24200, orders: 114 },
];

const recentOrders = [
  { id: 'CAZ-2026-9241', customer: 'María García', product: 'Auriculares NC Pro X', amount: 199.99, status: 'enviado', date: '22 Sep', city: 'Lima' },
  { id: 'CAZ-2026-9240', customer: 'Carlos Rodríguez', product: 'Smartwatch Serie 7', amount: 249.99, status: 'procesando', date: '22 Sep', city: 'Cusco' },
  { id: 'CAZ-2026-9239', customer: 'Ana Torres', product: 'Laptop Ultradelgada', amount: 749.99, status: 'pendiente', date: '21 Sep', city: 'Arequipa' },
  { id: 'CAZ-2026-9238', customer: 'Luis Hernández', product: 'Juego de Ollas', amount: 149.99, status: 'entregado', date: '21 Sep', city: 'Lima' },
  { id: 'CAZ-2026-9237', customer: 'Sofía Mendoza', product: 'Cafetera Espresso', amount: 89.99, status: 'entregado', date: '20 Sep', city: 'Piura' },
  { id: 'CAZ-2026-9236', customer: 'Diego Vargas', product: 'Parlante BT 360°', amount: 79.99, status: 'enviado', date: '20 Sep', city: 'Lima' },
  { id: 'CAZ-2026-9235', customer: 'Patricia Flores', product: 'Tablet 10.4"', amount: 329.99, status: 'entregado', date: '19 Sep', city: 'Trujillo' },
  { id: 'CAZ-2026-9234', customer: 'Marco Quispe', product: 'Aspiradora Robot', amount: 299.99, status: 'enviado', date: '19 Sep', city: 'Lima' },
];

const mockChats = [
  { id: 'c1', customer: 'María G.', avatar: 'MG', lastMessage: '¿El smartwatch viene con correa extra?', time: '10:32', unread: 2, status: 'open' },
  { id: 'c2', customer: 'Carlos R.', avatar: 'CR', lastMessage: 'Gracias, ya recibí mi pedido ✓', time: '09:15', unread: 0, status: 'resolved' },
  { id: 'c3', customer: 'Ana T.', avatar: 'AT', lastMessage: '¿Cuándo llega mi pedido CAZ-2026-9239?', time: 'Ayer', unread: 1, status: 'open' },
  { id: 'c4', customer: 'Diego V.', avatar: 'DV', lastMessage: 'Quiero cambiar la dirección de envío', time: 'Ayer', unread: 3, status: 'open' },
];

const searchTrends = [
  { tag: 'auriculares', count: 284, pct: 100 },
  { tag: 'cafetera', count: 231, pct: 81 },
  { tag: 'smartwatch', count: 198, pct: 70 },
  { tag: 'laptop', count: 167, pct: 59 },
  { tag: 'ollas', count: 143, pct: 50 },
  { tag: 'tablet', count: 128, pct: 45 },
  { tag: 'aspiradora', count: 112, pct: 39 },
  { tag: 'sábanas', count: 98, pct: 34 },
];

const statusBadge: Record<string, string> = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  procesando: 'bg-blue-100 text-blue-700',
  enviado: 'bg-gold/15 text-gold-dark',
  entregado: 'bg-emerald/15 text-emerald',
};

const maxSales = Math.max(...monthlySales.map((m) => m.amount));

type Section = 'dashboard' | 'stats' | 'orders' | 'inventory' | 'chats';

export default function AdminPage({ adminLoggedIn, onAdminLogin }: AdminPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [section, setSection] = useState<Section>('dashboard');
  const [chatSelected, setChatSelected] = useState<string | null>('c1');
  const [chatInput, setChatInput] = useState('');
  const [chatReplies, setChatReplies] = useState<Record<string, string[]>>({});

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'cazana2026') { onAdminLogin(); setError(''); }
    else setError('Contraseña incorrecta.');
  };

  const sendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatSelected) return;
    setChatReplies((prev) => ({ ...prev, [chatSelected]: [...(prev[chatSelected] ?? []), chatInput.trim()] }));
    setChatInput('');
  };

  if (!adminLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/10 border border-gold/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BarChartIcon size={28} className="text-gold" />
            </div>
            <h1 className="font-serif text-2xl text-charcoal">Panel de Administración</h1>
            <p className="text-gray-text font-sans text-xs mt-1">Acceso restringido — Solo CEO / Admin</p>
          </div>
          <div className="bg-white border border-gray-light rounded-3xl p-7 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Contraseña de administrador</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                {error && <p className="text-xs text-red-500 font-sans mt-1.5">{error}</p>}
              </div>
              <button type="submit" className="w-full bg-charcoal hover:bg-charcoal-light text-white font-semibold font-sans py-3.5 rounded-full transition-colors text-sm">
                Ingresar al Panel
              </button>
            </form>
            <p className="text-center text-xs text-gray-text font-sans mt-4 opacity-60">Contraseña: cazana + año actual</p>
          </div>
        </div>
      </div>
    );
  }

  const totalRevSep = monthlySales[5].amount;
  const totalRevAug = monthlySales[4].amount;
  const growth = (((totalRevSep - totalRevAug) / totalRevAug) * 100).toFixed(1);
  const pendingOrders = recentOrders.filter((o) => o.status === 'pendiente' || o.status === 'procesando').length;
  const lowStockProducts = products.filter((p) => p.stock <= 10);
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const maxSold = topProducts[0].sold;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalSold = products.reduce((s, p) => s + p.sold, 0);
  const avgRating = (products.reduce((s, p) => s + p.rating, 0) / products.length).toFixed(1);

  const navTabs: { key: Section; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'stats', label: 'Estadísticas' },
    { key: 'orders', label: 'Pedidos' },
    { key: 'inventory', label: 'Inventario' },
    { key: 'chats', label: `Chats ${mockChats.filter(c => c.unread > 0).length > 0 ? `(${mockChats.reduce((s, c) => s + c.unread, 0)})` : ''}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Panel de Administración</h1>
          <p className="text-gray-text font-sans text-sm mt-1">Cazana Store — Vista CEO · Sep 2026</p>
        </div>
        <button onClick={() => alert('Exportando reporte PDF...')}
          className="flex items-center gap-2 bg-charcoal hover:bg-charcoal-light text-white font-semibold font-sans px-4 py-2.5 rounded-full transition-colors text-xs">
          <DownloadIcon size={14} /> Exportar PDF
        </button>
      </div>

      {/* Nav */}
      <div className="flex gap-2 flex-wrap mb-8 border-b border-gray-light pb-4">
        {navTabs.map((tab) => (
          <button key={tab.key} onClick={() => setSection(tab.key)}
            className={`px-5 py-2 rounded-full text-sm font-sans font-medium transition-all ${section === tab.key ? 'bg-charcoal text-white' : 'text-charcoal-light hover:bg-gray-light'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {section === 'dashboard' && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Ventas hoy', value: 'S/ 1,892', sub: '+12% vs ayer', color: 'text-emerald', icon: '📈' },
              { label: 'Ventas Sep', value: `S/ ${totalRevSep.toLocaleString()}`, sub: `${growth}% vs ago`, color: Number(growth) >= 0 ? 'text-emerald' : 'text-red-500', icon: '💰' },
              { label: 'Pedidos pendientes', value: pendingOrders.toString(), sub: 'requieren acción', color: 'text-gold', icon: '⏳' },
              { label: 'Clientes totales', value: '2,147', sub: '+183 este mes', color: 'text-blue-500', icon: '👥' },
            ].map((kpi, i) => (
              <div key={i} className="bg-white border border-gray-light rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-text font-sans uppercase tracking-wide">{kpi.label}</p>
                  <span className="text-xl">{kpi.icon}</span>
                </div>
                <p className="font-serif text-2xl sm:text-3xl text-charcoal font-bold">{kpi.value}</p>
                <p className={`text-xs font-sans mt-1 font-medium ${kpi.color}`}>{kpi.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales chart */}
            <div className="lg:col-span-2 bg-white border border-gray-light rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-sans font-semibold text-charcoal">Ventas mensuales</h3>
                <span className="text-xs text-gray-text font-sans">Últimos 6 meses</span>
              </div>
              <div className="flex items-end gap-3 h-44 mb-2">
                {monthlySales.map((m, i) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-center">
                      <span className="text-[10px] font-bold font-sans text-charcoal-light block">{(m.amount / 1000).toFixed(1)}k</span>
                      <span className="text-[9px] text-gray-text font-sans">{m.orders}p</span>
                    </div>
                    <div className={`w-full rounded-t-lg transition-all ${i === 5 ? 'bg-gold' : 'bg-gold/30'}`} style={{ height: `${(m.amount / maxSales) * 130}px` }} />
                    <span className="text-[10px] text-gray-text font-sans">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue breakdown */}
            <div className="bg-white border border-gray-light rounded-2xl p-6">
              <h3 className="font-sans font-semibold text-charcoal mb-5">Septiembre 2026</h3>
              <div className="space-y-4">
                {[
                  { label: 'Ingresos brutos', value: 'S/ 24,200', pct: 100, color: 'bg-emerald' },
                  { label: 'Costo de productos', value: 'S/ 14,520', pct: 60, color: 'bg-gold/50' },
                  { label: 'Logística', value: 'S/ 1,842', pct: 8, color: 'bg-orange-300' },
                  { label: 'Publicidad', value: 'S/ 960', pct: 4, color: 'bg-blue-300' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-sans text-charcoal-light">{item.label}</span>
                      <span className="text-sm font-semibold font-sans text-charcoal">{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-gray-light rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-light pt-3 flex justify-between font-bold font-sans text-charcoal text-sm">
                  <span>Utilidad neta</span>
                  <span className="text-emerald">S/ 6,878</span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders by status + Low stock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-light rounded-2xl p-6">
              <h3 className="font-sans font-semibold text-charcoal mb-5">Estado de pedidos</h3>
              <div className="space-y-3">
                {[
                  { label: 'Entregados', count: 1842, color: 'bg-emerald', pct: 89 },
                  { label: 'En tránsito', count: 124, color: 'bg-gold', pct: 6 },
                  { label: 'Procesando', count: 67, color: 'bg-blue-400', pct: 3 },
                  { label: 'Pendientes', count: 31, color: 'bg-yellow-400', pct: 2 },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.color}`} />
                    <span className="text-sm font-sans text-charcoal-light flex-1">{s.label}</span>
                    <div className="flex-1 h-2 bg-gray-light rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                    <span className="text-sm font-bold font-sans text-charcoal w-12 text-right">{s.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Low stock alerts */}
            <div className="bg-white border border-gray-light rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-sans font-semibold text-charcoal">Alertas de stock bajo</h3>
                <span className="bg-orange-100 text-orange-600 text-xs font-bold font-sans px-2 py-0.5 rounded-full">{lowStockProducts.length} productos</span>
              </div>
              <div className="space-y-3">
                {lowStockProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold font-sans text-charcoal line-clamp-1">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1.5 bg-gray-light rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${p.stock <= 5 ? 'bg-red-400' : 'bg-orange-400'}`} style={{ width: `${(p.stock / 50) * 100}%` }} />
                        </div>
                        <span className={`text-xs font-bold font-sans ${p.stock <= 5 ? 'text-red-500' : 'text-orange-500'}`}>{p.stock} uds</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Stats */}
      {section === 'stats' && (
        <>
          {/* Summary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total vendido', value: `${totalSold} uds`, sub: 'todos los productos', icon: '📦' },
              { label: 'Stock total', value: `${totalStock} uds`, sub: 'en almacén', icon: '🏪' },
              { label: 'Rating promedio', value: avgRating, sub: 'sobre 5 estrellas', icon: '⭐' },
              { label: 'Ticket promedio', value: 'S/ 187.50', sub: 'por pedido', icon: '🧾' },
            ].map((m, i) => (
              <div key={i} className="bg-white border border-gray-light rounded-2xl p-5">
                <div className="flex justify-between mb-2">
                  <p className="text-xs text-gray-text font-sans uppercase tracking-wide">{m.label}</p>
                  <span className="text-xl">{m.icon}</span>
                </div>
                <p className="font-serif text-2xl text-charcoal font-bold">{m.value}</p>
                <p className="text-xs text-gray-text font-sans mt-1">{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top products */}
            <div className="bg-white border border-gray-light rounded-2xl p-6">
              <h3 className="font-sans font-semibold text-charcoal mb-5">Top 5 Productos más vendidos</h3>
              <div className="space-y-4">
                {topProducts.map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="text-sm font-bold font-sans text-gold w-5 shrink-0">#{i + 1}</span>
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold font-sans text-charcoal line-clamp-1">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-light rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gold" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                        </div>
                        <span className="text-xs font-bold font-sans text-charcoal shrink-0">{p.sold} vendidos</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category breakdown */}
            <div className="bg-white border border-gray-light rounded-2xl p-6">
              <h3 className="font-sans font-semibold text-charcoal mb-5">Ventas por categoría</h3>
              <div className="space-y-4">
                {[
                  { label: 'Tecnología', pct: 62, amount: 'S/ 15,004', color: 'bg-gold' },
                  { label: 'Hogar', pct: 38, amount: 'S/ 9,196', color: 'bg-emerald' },
                ].map((cat) => (
                  <div key={cat.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-semibold font-sans text-charcoal">{cat.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-sans text-charcoal-light">{cat.amount}</span>
                        <span className="text-sm font-bold font-sans text-charcoal">{cat.pct}%</span>
                      </div>
                    </div>
                    <div className="h-3 bg-gray-light rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-light">
                  <h4 className="text-xs font-sans font-semibold text-charcoal mb-3 uppercase tracking-wide">Por subcategoría</h4>
                  {[
                    { label: 'Audio', pct: 28 }, { label: 'Cocina', pct: 24 }, { label: 'Wearables', pct: 18 },
                    { label: 'Computadoras', pct: 14 }, { label: 'Dormitorio', pct: 10 }, { label: 'Otros', pct: 6 },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-sans text-charcoal-light w-24 shrink-0">{s.label}</span>
                      <div className="flex-1 h-1.5 bg-gray-light rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-charcoal/30" style={{ width: `${s.pct * 2.5}%` }} />
                      </div>
                      <span className="text-xs font-sans text-charcoal w-7 text-right">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Search trends */}
          <div className="bg-white border border-gray-light rounded-2xl p-6">
            <h3 className="font-sans font-semibold text-charcoal mb-5">Etiquetas / términos más buscados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {searchTrends.map((t, i) => (
                <div key={t.tag} className="flex items-center gap-3">
                  <span className="text-xs font-bold font-sans text-gold w-4 shrink-0">#{i + 1}</span>
                  <span className="text-sm font-sans text-charcoal capitalize w-28 shrink-0">{t.tag}</span>
                  <div className="flex-1 h-2 bg-gray-light rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gold/60" style={{ width: `${t.pct}%` }} />
                  </div>
                  <span className="text-xs font-bold font-sans text-charcoal-light w-10 text-right">{t.count}</span>
                </div>
              ))}
            </div>

            {/* Tags cloud */}
            <div className="mt-5 pt-5 border-t border-gray-light">
              <div className="flex flex-wrap gap-2">
                {searchTrends.map((t, i) => (
                  <span key={t.tag} className="font-sans px-3 py-1.5 rounded-full text-white text-xs font-semibold capitalize"
                    style={{ backgroundColor: `rgba(201,163,78,${0.3 + (searchTrends.length - i) / searchTrends.length * 0.7})`, fontSize: `${10 + (searchTrends.length - i)}px` }}>
                    {t.tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Customer stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            {[
              { label: 'Clientes nuevos este mes', value: '183', icon: <UserIcon size={20} className="text-blue-500" />, trend: '+12.4%' },
              { label: 'Tasa de retorno', value: '78%', icon: <StarIcon size={20} className="text-gold" filled />, trend: '+3.2%' },
              { label: 'NPS (satisfacción)', value: '72', icon: <span className="text-xl">😊</span>, trend: 'Muy bueno' },
            ].map((s, i) => (
              <div key={i} className="bg-white border border-gray-light rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-light rounded-xl flex items-center justify-center shrink-0">{s.icon}</div>
                <div>
                  <p className="text-xs text-gray-text font-sans">{s.label}</p>
                  <p className="font-serif text-2xl text-charcoal font-bold mt-0.5">{s.value}</p>
                  <p className="text-xs text-emerald font-sans font-semibold">{s.trend}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Orders */}
      {section === 'orders' && (
        <div className="bg-white border border-gray-light rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-light flex items-center justify-between">
            <h3 className="font-sans font-semibold text-charcoal">Pedidos recientes</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-text font-sans">{recentOrders.length} pedidos</span>
              <button onClick={() => alert('Exportando...')} className="flex items-center gap-1 text-xs font-sans text-gray-text hover:text-gold transition-colors">
                <DownloadIcon size={13} /> Excel
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-light text-left">
                  {['Pedido', 'Cliente', 'Producto', 'Ciudad', 'Monto', 'Estado', 'Fecha'].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold font-sans text-charcoal-light uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, i) => (
                  <tr key={order.id} className={`border-t border-gray-light ${i % 2 === 1 ? 'bg-gray-light/20' : ''} hover:bg-gold/5 transition-colors`}>
                    <td className="px-5 py-4 text-xs font-mono text-charcoal font-semibold whitespace-nowrap">{order.id}</td>
                    <td className="px-5 py-4 text-sm font-sans text-charcoal">{order.customer}</td>
                    <td className="px-5 py-4 text-sm font-sans text-charcoal-light max-w-40 truncate">{order.product}</td>
                    <td className="px-5 py-4 text-xs font-sans text-charcoal-light">{order.city}</td>
                    <td className="px-5 py-4 text-sm font-sans font-semibold text-charcoal">S/ {order.amount.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold font-sans px-2.5 py-1 rounded-full whitespace-nowrap ${statusBadge[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-text font-sans">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory */}
      {section === 'inventory' && (
        <div className="bg-white border border-gray-light rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-gray-light flex items-center justify-between">
            <h3 className="font-sans font-semibold text-charcoal">Inventario completo</h3>
            <button onClick={() => alert('Exportando inventario a Excel...')} className="flex items-center gap-1.5 text-xs font-sans text-gray-text hover:text-gold transition-colors">
              <DownloadIcon size={14} /> Exportar Excel
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-light text-left">
                  {['Producto', 'Categoría', 'Precio', 'Stock', 'Vendidos', 'Ingresos', 'Estado'].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold font-sans text-charcoal-light uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr key={product.id} className={`border-t border-gray-light ${i % 2 === 1 ? 'bg-gray-light/20' : ''} hover:bg-gold/5 transition-colors`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-9 h-9 rounded-lg object-cover" />
                        <span className="text-xs font-semibold font-sans text-charcoal max-w-36 truncate">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs font-sans text-charcoal-light capitalize">{product.category}</td>
                    <td className="px-5 py-4 text-sm font-sans font-semibold text-charcoal">S/ {product.price.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold font-sans ${product.stock <= 5 ? 'text-red-500' : product.stock <= 10 ? 'text-orange-500' : 'text-emerald'}`}>{product.stock}</span>
                        <div className="w-12 h-1.5 bg-gray-light rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${product.stock <= 5 ? 'bg-red-400' : product.stock <= 10 ? 'bg-orange-400' : 'bg-emerald'}`} style={{ width: `${Math.min((product.stock / 50) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm font-sans text-charcoal-light">{product.sold}</td>
                    <td className="px-5 py-4 text-sm font-sans font-semibold text-charcoal">S/ {(product.price * product.sold).toFixed(0)}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold font-sans px-2.5 py-1 rounded-full ${product.stock === 0 ? 'bg-red-100 text-red-600' : product.stock <= 5 ? 'bg-red-100 text-red-500' : product.stock <= 10 ? 'bg-orange-100 text-orange-500' : 'bg-emerald/15 text-emerald'}`}>
                        {product.stock === 0 ? 'Sin stock' : product.stock <= 5 ? 'Crítico' : product.stock <= 10 ? 'Stock bajo' : 'OK'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-mid bg-gray-light/50">
                  <td className="px-5 py-3 text-xs font-bold font-sans text-charcoal" colSpan={3}>Total ({products.length} productos)</td>
                  <td className="px-5 py-3 text-xs font-bold font-sans text-charcoal">{totalStock}</td>
                  <td className="px-5 py-3 text-xs font-bold font-sans text-charcoal">{totalSold}</td>
                  <td className="px-5 py-3 text-xs font-bold font-sans text-emerald">S/ {products.reduce((s, p) => s + p.price * p.sold, 0).toFixed(0)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Chats */}
      {section === 'chats' && (
        <div className="bg-white border border-gray-light rounded-2xl overflow-hidden flex" style={{ height: '600px' }}>
          {/* Sidebar */}
          <div className="w-72 shrink-0 border-r border-gray-light flex flex-col">
            <div className="p-4 border-b border-gray-light">
              <h3 className="font-sans font-semibold text-charcoal text-sm">Conversaciones</h3>
              <p className="text-xs text-gray-text font-sans mt-0.5">{mockChats.filter(c => c.status === 'open').length} activas · {mockChats.reduce((s, c) => s + c.unread, 0)} sin leer</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {mockChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setChatSelected(chat.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-light text-left transition-all ${chatSelected === chat.id ? 'bg-gold/10 border-l-2 border-l-gold' : 'hover:bg-gray-light'}`}
                >
                  <div className="w-10 h-10 rounded-full bg-charcoal text-white flex items-center justify-center text-xs font-bold shrink-0 relative">
                    {chat.avatar}
                    {chat.status === 'open' && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-semibold font-sans text-charcoal">{chat.customer}</span>
                      <span className="text-[10px] text-gray-text font-sans shrink-0 ml-1">{chat.time}</span>
                    </div>
                    <p className="text-xs text-gray-text font-sans line-clamp-1 mt-0.5">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <span className="w-5 h-5 bg-gold rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0">{chat.unread}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          {chatSelected ? (
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="px-5 py-4 border-b border-gray-light flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-charcoal text-white flex items-center justify-center text-xs font-bold">
                    {mockChats.find(c => c.id === chatSelected)?.avatar}
                  </div>
                  <div>
                    <p className="font-semibold font-sans text-charcoal text-sm">{mockChats.find(c => c.id === chatSelected)?.customer}</p>
                    <span className={`text-[10px] font-sans font-semibold ${mockChats.find(c => c.id === chatSelected)?.status === 'open' ? 'text-emerald' : 'text-gray-text'}`}>
                      {mockChats.find(c => c.id === chatSelected)?.status === 'open' ? '● Activo' : '✓ Resuelto'}
                    </span>
                  </div>
                </div>
                <button className="text-xs font-sans text-gray-text hover:text-gold transition-colors border border-gray-mid px-3 py-1 rounded-full">
                  Cerrar chat
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-light/20">
                {/* Mock initial message */}
                <div className="flex justify-start">
                  <div className="max-w-xs bg-white border border-gray-light rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm font-sans text-charcoal shadow-sm">
                    {mockChats.find(c => c.id === chatSelected)?.lastMessage}
                    <p className="text-[10px] text-gray-text mt-1">{mockChats.find(c => c.id === chatSelected)?.time}</p>
                  </div>
                </div>
                {/* Admin replies */}
                {(chatReplies[chatSelected] ?? []).map((reply, i) => (
                  <div key={i} className="flex justify-end">
                    <div className="max-w-xs bg-emerald text-white rounded-2xl rounded-br-sm px-4 py-2.5 text-sm font-sans">
                      {reply}
                      <p className="text-[10px] text-white/60 mt-1 text-right">Ahora</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <form onSubmit={sendReply} className="px-4 py-3 border-t border-gray-light bg-white flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Escribe una respuesta..."
                  className="flex-1 text-sm font-sans bg-gray-light rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-gold/40 min-w-0"
                />
                <button type="submit" disabled={!chatInput.trim()}
                  className="w-10 h-10 bg-emerald hover:bg-emerald-dark disabled:opacity-40 rounded-full flex items-center justify-center text-white transition-colors shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-text font-sans text-sm">
              Selecciona una conversación
            </div>
          )}
        </div>
      )}
    </div>
  );
}
