import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaCreditCard, FaLock, FaCheckCircle, FaUser, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

export default function Payment() {
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Processing..."); 
  const [showSuccess, setShowSuccess] = useState(false); 

  // 🔥 FIX: Cart ko useState me daal diya taaki session clear hone ke baad bhi total ₹0 na ho
  const [cart] = useState(() => JSON.parse(sessionStorage.getItem("cart")) || []);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // 🕒 Helper function for fake delay
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePay = async () => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const userId = user?.id || sessionStorage.getItem("user_id");
  
    if (!userId) {
      alert("Login required");
      navigate("/login");
      return;
    }

    if(!cardNumber || !name || !expiry || !cvv) {
        alert("Please enter payment details to proceed.");
        return;
    }
  
    setLoading(true);
  
    try {
      setLoadingText("Verifying Card Details...");
      await sleep(1200); 
      setLoadingText("Establishing Secure Connection...");
      await sleep(1000); 
      setLoadingText("Processing Payment...");
      await sleep(1500); 

      // 🔥 CHECK IF CART CONTAINS A SUBSCRIPTION
      const isSubscription = cart.find(item => item.isSubscription);

      if (isSubscription) {
          // Hit Subscription API to upgrade tier
          await fetch("http://localhost/vehicle-service/api/saveSubscription.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: userId,
              plan_name: isSubscription.planName,
              price: isSubscription.price
            })
          });
      }

      // 🔥 HIT BOOKING API (For both regular cart and subscription so it shows in history)
      await fetch("http://localhost/vehicle-service/api/createBooking.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, cart })
      });
  
      sessionStorage.removeItem("cart");
      setShowSuccess(true);

      setTimeout(() => {
        navigate("/history");
      }, 3500); 
  
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Payment failed. Server error.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 relative overflow-hidden font-sans selection:bg-red-600/30">

      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-900/20 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* 🔥 FULL SCREEN SUCCESS ANIMATION OVERLAY */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-2xl"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-40 rounded-full"
                ></motion.div>
                <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <FaCheckCircle className="text-emerald-500 text-8xl md:text-[140px] relative z-10 drop-shadow-[0_0_40px_rgba(16,185,129,0.6)]" />
                </motion.div>
              </div>
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-5xl md:text-7xl font-black mt-8 text-white tracking-tighter text-center"
              >
                Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Successful!</span>
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-neutral-400 text-xl mt-4 text-center max-w-lg font-light leading-relaxed"
              >
                Your transaction of <strong className="text-white">₹{total}</strong> was completed securely. Redirecting to your garage dashboard...
              </motion.p>
              
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "250px" }}
                transition={{ duration: 2.5, delay: 0.9 }}
                className="h-1.5 bg-emerald-500 rounded-full mt-10 shadow-[0_0_20px_rgba(16,185,129,0.8)]"
              ></motion.div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="w-full max-w-[450px] bg-neutral-900/60 backdrop-blur-2xl p-10 rounded-[2rem] border border-neutral-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 relative overflow-hidden"
      >
        {loading && !showSuccess && (
          <motion.div 
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)] z-50 pointer-events-none"
          ></motion.div>
        )}

        <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-black border border-neutral-800 rounded-full flex items-center justify-center shadow-lg relative">
                {loading && <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping"></div>}
                <FaShieldAlt className={`text-2xl transition-colors ${loading ? "text-emerald-500" : "text-red-500"}`} />
            </div>
        </div>

        <h2 className="text-3xl font-black text-center mb-2 tracking-tight text-white">
          Secure Checkout
        </h2>
        <p className="text-center text-neutral-400 text-sm mb-8">AES-256 Bit Encrypted Transaction</p>

        <div className={`space-y-5 transition-opacity duration-500 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative flex items-center group">
                <FaCreditCard className="absolute left-4 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
                <input
                    placeholder="Card Number"
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-600 font-mono"
                    value={cardNumber}
                    onChange={(e)=>setCardNumber(e.target.value)}
                    maxLength="16"
                    disabled={loading}
                />
            </div>

            <div className="relative flex items-center group">
                <FaUser className="absolute left-4 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
                <input
                    placeholder="Card Holder Name"
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-600 uppercase"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="flex gap-4">
                <div className="relative flex items-center w-1/2 group">
                    <FaCalendarAlt className="absolute left-4 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
                    <input
                        placeholder="MM/YY"
                        className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-600 text-center font-mono"
                        value={expiry}
                        onChange={(e)=>setExpiry(e.target.value)}
                        maxLength="5"
                        disabled={loading}
                    />
                </div>

                <div className="relative flex items-center w-1/2 group">
                    <FaLock className="absolute left-4 text-neutral-500 group-focus-within:text-red-500 transition-colors" />
                    <input
                        placeholder="CVV"
                        type="password"
                        className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-600 text-center font-mono tracking-widest"
                        value={cvv}
                        onChange={(e)=>setCvv(e.target.value)}
                        maxLength="3"
                        disabled={loading}
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-between items-end mb-8 pt-8 border-t border-neutral-800/50 mt-8">
          <span className="text-neutral-400 font-medium">Total to Pay</span>
          <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">₹{total}</span>
        </div>

        <button
          onClick={handlePay}
          disabled={loading || showSuccess}
          className={`w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest transition-all transform flex justify-center items-center gap-3 ${
            loading 
              ? "bg-emerald-600/50 cursor-not-allowed shadow-[0_0_30px_rgba(16,185,129,0.3)]" 
              : "bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 hover:-translate-y-1"
          }`}
        >
          {loading && !showSuccess ? (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center gap-3 text-sm"
            >
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {loadingText}
            </motion.span>
          ) : showSuccess ? (
            "Payment Secured!"
          ) : (
            <>
              <FaLock size={14} /> Pay ₹{total} Now
            </>
          )}
        </button>

        <p className="text-xs text-center text-neutral-600 mt-6 font-medium flex items-center justify-center gap-2">
          <FaShieldAlt /> Demo Mode | Safe & Encrypted
        </p>

      </motion.div>
    </div>
  );
}