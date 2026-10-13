import { useState } from 'react';
import type { CartItem } from '../types';
import { CheckIcon, ShieldIcon, TruckIcon } from '../components/Icons';

interface CheckoutPageProps {
  cart: CartItem[];
  total: number;
  onComplete: () => void;
}

type Step = 1 | 2 | 3;
type PayMethod = 'card' | 'transfer' | 'yape' | 'paypal';

const LIMA_CITIES = ['lima', 'callao', 'miraflores', 'san isidro', 'surco', 'la molina', 'san borja', 'barranco', 'chorrillos', 'pueblo libre', 'jesus maria', 'lince', 'magdalena', 'san miguel', 'breña', 'rimac', 'san martin', 'los olivos', 'comas', 'independencia', 'ate', 'santa anita', 'el agustino', 'villa el salvador', 'villa maria', 'lurin', 'puente piedra', 'carabayllo'];

const CARRIERS = [
  { id: 'olva', name: 'Olva Courier', days: '3–5 días hábiles', price: 'S/ 15.00', logo: '📦', recommended: true },
  { id: 'shalom', name: 'Shalom Courier', days: '3–6 días hábiles', price: 'S/ 12.00', logo: '🚚' },
  { id: 'linea', name: 'Línea Bus', days: '2–4 días hábiles', price: 'S/ 10.00', logo: '🚌' },
  { id: 'civa', name: 'CIVA', days: '2–5 días hábiles', price: 'S/ 11.00', logo: '🏁' },
  { id: 'cruz', name: 'Cruz del Sur', days: '2–4 días hábiles', price: 'S/ 13.00', logo: '⭐' },
];

export default function CheckoutPage({ cart, total, onComplete }: CheckoutPageProps) {
  const [step, setStep] = useState<Step>(1);
  const [orderNumber] = useState(`CAZ-2026-${Math.floor(Math.random() * 9000) + 1000}`);

  const [shipping, setShipping] = useState({ name: '', lastName: '', email: '', phone: '', address: '', city: '', state: '', zip: '' });
  const [carrier, setCarrier] = useState('olva');
  const [payMethod, setPayMethod] = useState<PayMethod>('card');
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', holder: '' });
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const isProvincial = shipping.city && !LIMA_CITIES.includes(shipping.city.toLowerCase().trim());
  const selectedCarrier = CARRIERS.find((c) => c.id === carrier) ?? CARRIERS[0];
  const shippingCost = total >= 150 && !isProvincial ? 0 : isProvincial ? parseFloat(selectedCarrier.price.replace('S/ ', '')) : 15;
  const finalTotal = total - discount + shippingCost;

  const applyCoupon = () => {
    if (coupon.toUpperCase() === 'CAZANA10' && !couponApplied) {
      setDiscount(total * 0.1);
      setCouponApplied(true);
    }
  };

  const handleShippingNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
    window.scrollTo(0, 0);
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <p className="font-serif text-2xl text-charcoal mb-2">No hay productos en el carrito</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[80vh]">
      {/* Progress */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans transition-all ${step > s ? 'bg-emerald text-white' : step === s ? 'bg-gold text-white' : 'bg-gray-light text-gray-text'}`}>
              {step > s ? <CheckIcon size={14} /> : s}
            </div>
            <span className={`text-xs font-sans hidden sm:block ${step >= s ? 'text-charcoal font-medium' : 'text-gray-text'}`}>
              {s === 1 ? 'Envío' : s === 2 ? 'Pago' : 'Confirmación'}
            </span>
            {s < 3 && <div className={`w-12 sm:w-20 h-0.5 ${step > s ? 'bg-emerald' : 'bg-gray-mid'}`} />}
          </div>
        ))}
      </div>

      {step === 3 ? (
        // Success
        <div className="text-center py-10">
          <div className="w-20 h-20 bg-emerald/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckIcon size={36} className="text-emerald" />
          </div>
          <h2 className="font-serif text-3xl text-charcoal mb-3">¡Pedido Confirmado!</h2>
          <p className="text-gray-text font-sans mb-2">Tu pedido ha sido recibido con éxito.</p>
          <p className="text-charcoal font-semibold font-sans text-lg mb-6">Número de orden: <span className="text-gold">{orderNumber}</span></p>
          <div className="bg-gray-light rounded-2xl p-6 max-w-md mx-auto mb-6 text-left">
            <h3 className="font-sans font-semibold text-sm text-charcoal mb-3">Resumen del pedido</h3>
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between py-2 border-b border-gray-mid last:border-0">
                <span className="text-sm font-sans text-charcoal-light line-clamp-1 flex-1">{item.product.name} ×{item.quantity}</span>
                <span className="text-sm font-semibold font-sans text-charcoal ml-2">S/ {(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            {isProvincial && (
              <div className="flex justify-between py-2 border-b border-gray-mid">
                <span className="text-sm font-sans text-charcoal-light">Envío ({selectedCarrier.name})</span>
                <span className="text-sm font-sans text-charcoal">{selectedCarrier.price}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 font-bold font-sans text-charcoal">
              <span>Total pagado</span>
              <span>S/ {finalTotal.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-sans text-charcoal-light mb-8">
            <TruckIcon size={18} className="text-gold" />
            {isProvincial
              ? `Tu pedido llegará en ${selectedCarrier.days} vía ${selectedCarrier.name} a ${shipping.city}`
              : `Entrega en 24–48 horas a ${shipping.city || 'tu dirección'}`}
          </div>
          <button onClick={onComplete} className="bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans px-10 py-4 rounded-full transition-colors">
            Volver al inicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {step === 1 && (
              <form onSubmit={handleShippingNext} className="space-y-5">
                <h2 className="font-serif text-2xl text-charcoal mb-6">Datos de Envío</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Nombre', placeholder: 'Juan' },
                    { key: 'lastName', label: 'Apellido', placeholder: 'García' },
                    { key: 'email', label: 'Correo electrónico', placeholder: 'juan@email.com', type: 'email' },
                    { key: 'phone', label: 'Teléfono', placeholder: '+51 999 123 456', type: 'tel' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">{f.label} *</label>
                      <input type={f.type || 'text'} value={shipping[f.key as keyof typeof shipping]} onChange={(e) => setShipping((s) => ({ ...s, [f.key]: e.target.value }))} placeholder={f.placeholder} required
                        className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Dirección *</label>
                  <input type="text" value={shipping.address} onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))} placeholder="Av. Larco 1234, Dpto 5B" required
                    className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: 'city', label: 'Ciudad / Distrito', placeholder: 'Lima, Cusco, Arequipa...' },
                    { key: 'state', label: 'Departamento', placeholder: 'Lima' },
                    { key: 'zip', label: 'Código postal', placeholder: '15001' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">{f.label} *</label>
                      <input type="text" value={shipping[f.key as keyof typeof shipping]} onChange={(e) => setShipping((s) => ({ ...s, [f.key]: e.target.value }))} placeholder={f.placeholder} required
                        className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                    </div>
                  ))}
                </div>

                {/* Provincial carrier selection */}
                {isProvincial && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TruckIcon size={18} className="text-blue-600" />
                      <h3 className="font-sans font-semibold text-sm text-blue-700">Envío a provincia — Elige tu empresa de transporte</h3>
                    </div>
                    <p className="text-xs text-blue-600 font-sans mb-4">Recoge tu pedido en la agencia más cercana a tu domicilio.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CARRIERS.map((c) => (
                        <label
                          key={c.id}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${carrier === c.id ? 'border-gold bg-gold/5' : 'border-gray-mid hover:border-gray-text bg-white'}`}
                        >
                          <input type="radio" name="carrier" value={c.id} checked={carrier === c.id} onChange={() => setCarrier(c.id)} className="accent-gold" />
                          <span className="text-xl">{c.logo}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-semibold font-sans text-charcoal">{c.name}</span>
                              {c.recommended && <span className="bg-emerald/15 text-emerald text-[9px] font-bold font-sans px-1.5 py-0.5 rounded-full">RECOMENDADO</span>}
                            </div>
                            <p className="text-xs text-gray-text font-sans">{c.days}</p>
                          </div>
                          <span className="text-sm font-bold font-sans text-charcoal shrink-0">{c.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <button type="submit" className="w-full bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans py-4 rounded-full transition-colors">
                  Continuar al Pago →
                </button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <form onSubmit={handlePaymentNext} className="space-y-5">
                <h2 className="font-serif text-2xl text-charcoal mb-6">Método de Pago</h2>

                {/* Coupon */}
                <div className="bg-gray-light rounded-2xl p-4">
                  <h3 className="text-sm font-semibold font-sans text-charcoal mb-3">Código de descuento</h3>
                  <div className="flex gap-2">
                    <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="CAZANA10" disabled={couponApplied}
                      className="flex-1 border border-gray-mid rounded-full py-2.5 px-4 text-sm font-sans focus:outline-none focus:border-gold disabled:bg-gray-mid" />
                    <button type="button" onClick={applyCoupon} disabled={couponApplied}
                      className="bg-gold hover:bg-gold-dark disabled:opacity-50 text-white font-semibold font-sans px-5 py-2.5 rounded-full transition-colors text-sm">
                      {couponApplied ? '✓ Aplicado' : 'Aplicar'}
                    </button>
                  </div>
                  {couponApplied && <p className="text-xs text-emerald font-sans mt-2">¡10% de descuento aplicado!</p>}
                </div>

                {/* Payment method tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: 'card', label: '💳 Tarjeta' },
                    { value: 'transfer', label: '🏦 Transferencia' },
                    { value: 'yape', label: '📱 Yape / Plin' },
                    { value: 'paypal', label: '🌐 PayPal' },
                  ].map((m) => (
                    <button key={m.value} type="button" onClick={() => setPayMethod(m.value as PayMethod)}
                      className={`p-3 rounded-xl border-2 text-sm font-sans font-medium transition-all ${payMethod === m.value ? 'border-gold bg-gold/10 text-charcoal' : 'border-gray-mid hover:border-gray-text text-charcoal-light'}`}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {payMethod === 'card' && (
                  <div className="space-y-4">
                    {[
                      { key: 'number', label: 'Número de tarjeta', placeholder: '4242 4242 4242 4242', maxLen: 19, inputMode: 'numeric' },
                      { key: 'holder', label: 'Nombre en la tarjeta', placeholder: 'JUAN GARCIA', maxLen: 26 },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">{f.label} *</label>
                        <input type="text" value={card[f.key as keyof typeof card]} onChange={(e) => setCard((c) => ({ ...c, [f.key]: e.target.value }))} placeholder={f.placeholder} required maxLength={f.maxLen}
                          className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">Vencimiento *</label>
                        <input type="text" value={card.expiry} onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))} placeholder="MM/AA" required maxLength={5}
                          className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold font-sans text-charcoal mb-1.5">CVV *</label>
                        <input type="password" value={card.cvv} onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="•••" required maxLength={4}
                          className="w-full border border-gray-mid rounded-xl py-3 px-4 text-sm font-sans focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold" />
                      </div>
                    </div>
                  </div>
                )}

                {payMethod === 'transfer' && (
                  <div className="bg-gray-light rounded-2xl p-5 space-y-2 text-sm font-sans text-charcoal-light">
                    <h4 className="font-semibold text-charcoal mb-2">Datos para transferencia (BCP)</h4>
                    <p><strong className="text-charcoal">Cuenta:</strong> 194-12345678-0-96</p>
                    <p><strong className="text-charcoal">CCI:</strong> 002-194-001234567890-96</p>
                    <p><strong className="text-charcoal">A nombre de:</strong> Cazana Store S.A.C.</p>
                    <p className="text-xs text-gray-text mt-2">Envía el comprobante a pagos@cazanastore.com con tu número de pedido.</p>
                  </div>
                )}

                {payMethod === 'yape' && (
                  <div className="bg-gray-light rounded-2xl p-5 text-center">
                    <p className="font-semibold font-sans text-charcoal mb-2">Yape o Plin al número:</p>
                    <p className="text-3xl font-bold font-sans text-gold mb-1">+51 999 123 456</p>
                    <p className="text-sm text-gray-text font-sans">A nombre de: Cazana Store</p>
                    <p className="text-xs text-gray-text mt-2">Envía el screenshot del pago a nuestro WhatsApp con tu número de pedido.</p>
                  </div>
                )}

                {payMethod === 'paypal' && (
                  <div className="bg-gray-light rounded-2xl p-5 text-center">
                    <p className="font-semibold font-sans text-charcoal mb-3">Pagar con PayPal</p>
                    <p className="text-sm text-gray-text font-sans mb-4">Serás redirigido a PayPal de forma segura.</p>
                    <div className="bg-[#003087] text-white font-bold font-sans py-3 px-8 rounded-full inline-block">
                      Pay<span className="text-[#009cde]">Pal</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-text font-sans">
                  <ShieldIcon size={14} className="text-emerald" />
                  Pago 100% seguro — encriptación SSL 256 bits
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 border-2 border-gray-mid hover:border-charcoal text-charcoal font-semibold font-sans py-4 rounded-full transition-colors text-sm">
                    ← Volver
                  </button>
                  <button type="submit" className="flex-1 bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans py-4 rounded-full transition-colors text-sm">
                    Confirmar Pedido →
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-gray-light rounded-2xl p-6 sticky top-24">
              <h3 className="font-serif text-xl text-charcoal mb-5">Resumen del pedido</h3>
              <div className="space-y-3 mb-5">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-sans text-charcoal font-medium line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-gray-text font-sans">Cant: {item.quantity}</p>
                      <p className="text-sm font-bold font-sans text-charcoal">S/ {(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-mid pt-4 space-y-2">
                <div className="flex justify-between text-sm font-sans text-charcoal-light">
                  <span>Subtotal</span><span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-sans text-charcoal-light">
                  <span>Envío {isProvincial ? `(${selectedCarrier.name})` : ''}</span>
                  <span className={shippingCost === 0 ? 'text-emerald font-semibold' : ''}>{shippingCost === 0 ? 'Gratis' : `S/ ${shippingCost.toFixed(2)}`}</span>
                </div>
                {isProvincial && (
                  <p className="text-xs text-blue-600 font-sans">📍 Recoge en agencia {selectedCarrier.name}</p>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-sm font-sans text-emerald">
                    <span>Descuento (CAZANA10)</span><span>-S/ {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-charcoal font-sans text-lg border-t border-gray-mid pt-2 mt-2">
                  <span>Total</span><span>S/ {finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
