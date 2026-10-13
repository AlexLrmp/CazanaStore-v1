import type { CartItem, Page } from '../types';
import { CloseIcon, PlusIcon, MinusIcon, TrashIcon, ShieldIcon } from './Icons';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  onNavigate: (page: Page, productId?: string) => void;
  total: number;
}

export default function CartSidebar({
  isOpen, onClose, cart, onUpdateQuantity, onRemove, onCheckout, onNavigate, total,
}: CartSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-light">
          <div>
            <h2 className="font-serif text-xl text-charcoal">Mi Carrito</h2>
            <p className="text-xs text-gray-text font-sans mt-0.5">{cart.length} {cart.length === 1 ? 'producto' : 'productos'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-text hover:text-charcoal hover:bg-gray-light rounded-full transition-all"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gray-light rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🛒</span>
              </div>
              <p className="font-serif text-lg text-charcoal mb-2">Tu carrito está vacío</p>
              <p className="text-sm text-gray-text font-sans mb-6">Descubre nuestros productos premium</p>
              <button
                onClick={() => { onClose(); onNavigate('catalog'); }}
                className="bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans px-6 py-2.5 rounded-full transition-colors text-sm"
              >
                Ver catálogo
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 pb-4 border-b border-gray-light last:border-0">
                <button
                  onClick={() => { onClose(); onNavigate('product', item.product.id); }}
                  className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-light"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <button
                    onClick={() => { onClose(); onNavigate('product', item.product.id); }}
                    className="text-sm font-sans font-medium text-charcoal line-clamp-2 text-left hover:text-gold transition-colors leading-snug"
                  >
                    {item.product.name}
                  </button>
                  <p className="text-xs text-gray-text font-sans mt-1">{item.product.subcategory}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full bg-gray-light hover:bg-gray-mid flex items-center justify-center transition-colors"
                      >
                        <MinusIcon size={12} />
                      </button>
                      <span className="text-sm font-semibold font-sans w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full bg-gray-light hover:bg-gray-mid flex items-center justify-center transition-colors"
                      >
                        <PlusIcon size={12} />
                      </button>
                    </div>
                    <span className="font-semibold text-charcoal font-sans text-sm">
                      S/ {(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onRemove(item.product.id)}
                  className="text-gray-text hover:text-red-500 transition-colors self-start mt-1"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-light space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-sans text-gray-text text-sm">Subtotal</span>
              <span className="font-sans font-bold text-lg text-charcoal">S/ {total.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-text font-sans">
              <ShieldIcon size={14} className="text-emerald" />
              Envío gratis incluido — Entrega en 24–48h
            </div>
            <button
              onClick={onCheckout}
              className="w-full bg-emerald hover:bg-emerald-dark text-white font-semibold font-sans py-3.5 rounded-full transition-colors text-sm tracking-wide"
            >
              Proceder al Pago
            </button>
            <button
              onClick={() => { onClose(); onNavigate('catalog'); }}
              className="w-full text-center text-sm text-gray-text hover:text-gold font-sans transition-colors"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
