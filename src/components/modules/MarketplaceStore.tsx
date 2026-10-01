import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Tag,
  Truck,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { MARKETPLACE_PRODUCTS } from '../../lib/data/mockData';
import { MarketplaceProduct } from '../../types';
import { useFarm } from '../../lib/context/FarmContext';

export const MarketplaceStore: React.FC = () => {
  const { cart, addToCart, removeFromCart, clearCart, activeFarm, t } = useFarm();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);
  const [orderSuccessMsg, setOrderSuccessMsg] = useState<string | null>(null);

  const categories = ['All', 'Bio-Fertilizer', 'Fungicide / Biocontrol', 'Drip & Irrigation', 'Seeds', 'Livestock Feed'];

  const filteredProducts = MARKETPLACE_PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesQuery =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setOrderConfirmed(true);
    setTimeout(() => {
      clearCart();
      setCheckoutModalOpen(false);
      setOrderConfirmed(false);
      setOrderSuccessMsg(`Order placed successfully! Delivery scheduled to ${activeFarm?.name || 'your farm'} via Kisan Agro Logistics.`);
      setTimeout(() => setOrderSuccessMsg(null), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      {orderSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{orderSuccessMsg}</span>
          </div>
          <button onClick={() => setOrderSuccessMsg(null)} className="text-emerald-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#0a2318]/90 backdrop-blur-md border border-emerald-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <h1 className="text-2xl font-extrabold text-white font-display">
              {t('store_title', 'Agri Input & Direct Produce Store')}
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
              Kisan Direct
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {t('store_subtitle', 'Certified seeds, organic fertilizers, precision drip hardware, and farmer direct-to-consumer store.')}
          </p>
        </div>

        {/* Cart Capsule */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCheckoutModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Farm Cart ({totalItemsCount}) — ₹{cartTotal.toLocaleString()}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-[#0a2318] border-emerald-500/20 text-slate-300 hover:bg-[#0d2e20]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search inputs, seeds, fertilizers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-[#0a2318] border border-emerald-500/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="p-4 rounded-2xl bg-[#0a2318] border border-emerald-500/20 hover:border-emerald-500/50 transition duration-200 shadow-xl flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-black/40 border border-white/5">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {prod.subsidyEligible && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-black text-[9px] uppercase tracking-wide shadow">
                    Subsidy Eligible
                  </span>
                )}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white font-bold text-[10px]">
                  ★ {prod.rating}
                </span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="font-semibold text-emerald-400">{prod.brand}</span>
                <span>{prod.category}</span>
              </div>

              <h3 className="font-bold text-sm text-white leading-snug mb-1 group-hover:text-emerald-300 transition">
                {prod.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                {prod.description}
              </p>
            </div>

            <div className="pt-3 border-t border-emerald-500/10 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-extrabold text-white">₹{prod.price}</span>
                  <span className="text-xs text-slate-400 line-through">₹{prod.mrp}</span>
                </div>
                <span className="text-[10px] text-slate-400 block">{prod.unit}</span>
              </div>

              <button
                onClick={() => addToCart(prod)}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center gap-1 shadow-md hover:scale-105"
                title="Add to Farm Order"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs">Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Checkout Drawer / Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0a2318] border border-emerald-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-lg text-white">Farm Input Cart</h3>
              </div>
              <button
                onClick={() => setCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Your cart is empty. Add verified inputs from the catalog!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3 rounded-xl bg-[#0d2e20] border border-emerald-500/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-white">{item.product.name}</h4>
                        <span className="text-[11px] text-slate-400">
                          Qty: {item.quantity} • ₹{item.product.price} each
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <strong className="text-emerald-400">
                          ₹{item.product.price * item.quantity}
                        </strong>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Kisan Direct Delivery:</span>
                    <span>FREE (Farmgate Drop)</span>
                  </div>
                  <div className="flex justify-between text-white font-extrabold text-sm pt-2 border-t border-white/10">
                    <span>Total Payable:</span>
                    <span className="text-emerald-400">₹{cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={orderConfirmed}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-700 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 transition shadow-xl"
                >
                  {orderConfirmed ? (
                    <span>Confirming Dispatch with Kisan Logistics...</span>
                  ) : (
                    <>
                      <span>Place Order & Dispatch to Green Acres</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
