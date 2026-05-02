import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrashAlt, FaPlus, FaMinus, FaShoppingCart, FaLock, FaArrowLeft } from "react-icons/fa";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // 🔥 LOAD CART
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("cart")) || [];
    setCart(data);
  }, []);

  // 🔥 SAVE
  const updateCart = (updated) => {
    setCart(updated);
    sessionStorage.setItem("cart", JSON.stringify(updated));
  };

  // 🔥 INCREASE
  const increaseQty = (title) => {
    const updated = cart.map(item =>
      item.title === title ? { ...item, qty: item.qty + 1 } : item
    );
    updateCart(updated);
  };

  // 🔥 DECREASE
  const decreaseQty = (title) => {
    const updated = cart
      .map(item => item.title === title ? { ...item, qty: item.qty - 1 } : item)
      .filter(item => item.qty > 0);
    updateCart(updated);
  };

  // 🔥 REMOVE
  const removeItem = (title) => {
    const updated = cart.filter(item => item.title !== title);
    updateCart(updated);
  };

  // 🔥 TOTAL
  const total = cart.reduce((sum, item) => sum + item.qty * Number(item.price), 0);

  // 🔥 HANDLE PROCEED TO PAYMENT (REDIRECT ONLY)
  const proceedToCheckout = () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user?.id || sessionStorage.getItem("user_id");

    if (!userId) {
      navigate("/login");
      return;
    }
  
    if (cart.length === 0) return;
  
    // Seedha payment page pe bhej do
    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-24 px-6 relative overflow-hidden font-sans selection:bg-red-600/30">
      
      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-red-600/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-green-900/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => navigate(-1)} className="text-neutral-500 hover:text-white transition-colors">
            <FaArrowLeft size={20} />
          </button>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Cart</span>
          </h1>
        </div>

        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 bg-neutral-900/20 border border-neutral-800 rounded-[2rem] backdrop-blur-sm"
          >
            <div className="w-24 h-24 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <FaShoppingCart className="text-neutral-600 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
            <p className="text-neutral-500 mb-8 text-center max-w-sm">Looks like you haven't added any services for your car yet.</p>
            <button 
              onClick={() => navigate("/services")}
              className="bg-red-600 px-8 py-3.5 rounded-full font-bold uppercase tracking-widest hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] transform hover:-translate-y-1"
            >
              Browse Services
            </button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            
            {/* 🔥 CART ITEMS LIST */}
            <div className="lg:col-span-2 space-y-5">
              <AnimatePresence mode="popLayout">
                {cart.map((item) => (
                  <motion.div
                    key={item.title}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, x: -20 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 rounded-3xl p-5 md:p-6 flex flex-col md:flex-row gap-6 items-center justify-between group hover:border-neutral-600 transition-colors"
                  >
                    <div className="flex-1 w-full text-center md:text-left">
                      <h2 className="text-xl font-bold text-white mb-1 group-hover:text-red-400 transition-colors">
                        {item.title}
                      </h2>
                      <p className="text-sm font-medium text-neutral-500">
                        ₹{item.price} <span className="mx-1">×</span> {item.qty}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center gap-1 bg-black p-1 rounded-xl border border-neutral-800">
                        <button onClick={() => decreaseQty(item.title)} className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"><FaMinus size={12} /></button>
                        <span className="w-8 text-center font-bold text-lg select-none">{item.qty}</span>
                        <button onClick={() => increaseQty(item.title)} className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"><FaPlus size={12} /></button>
                      </div>

                      <div className="text-right min-w-[100px]">
                        <p className="text-xl font-black text-white">₹{item.qty * item.price}</p>
                      </div>

                      <button onClick={() => removeItem(item.title)} className="w-10 h-10 flex items-center justify-center text-neutral-500 bg-neutral-900/50 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"><FaTrashAlt size={14} /></button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* 🔥 ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-neutral-900/80 to-black border border-neutral-800 rounded-[2rem] p-8 sticky top-28 shadow-2xl backdrop-blur-md">
                <h3 className="text-xl font-bold mb-6 text-white border-b border-neutral-800 pb-4">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-neutral-400 font-medium">
                    <span>Subtotal ({cart.length} items)</span>
                    <span>₹{total}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400 font-medium">
                    <span>Taxes & Fees</span>
                    <span className="text-green-500">Calculated at Checkout</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8 pt-6 border-t border-neutral-800">
                  <span className="text-neutral-300 font-bold uppercase tracking-wider text-sm">Total Amount</span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">₹{total}</span>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 rounded-xl font-bold text-white uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all transform hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-3"
                >
                  <FaLock size={14} /> Checkout Securely
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}