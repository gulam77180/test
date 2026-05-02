import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import car from "../assets/car.png";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-[90vh] flex items-center justify-center px-6 lg:px-10 overflow-hidden relative">

      {/* Subtle Background Elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-red-900/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">

        {/* 🔥 LEFT: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 80 }}
        >
          <div className="inline-block px-3 py-1 mb-4 border border-red-600/30 bg-red-600/10 rounded-full text-red-500 text-xs font-bold uppercase tracking-widest">
            Premium Auto Care
          </div>
          <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tighter">
            We Treat You & Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Car Like Family</span>
          </h1>

          <p className="text-neutral-400 text-lg mb-8 max-w-lg leading-relaxed">
            Experience world-class vehicle service with expert mechanics, transparent pricing, and lightning-fast booking.
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/contact")}
              className="bg-red-600 px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:bg-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all transform hover:-translate-y-1"
            >
              Contact Us
            </button>

            <button
              onClick={() => navigate("/services")}
              className="border-2 border-neutral-700 px-8 py-4 rounded-xl font-bold uppercase tracking-wide hover:border-red-500 hover:text-red-500 transition-all transform hover:-translate-y-1"
            >
              View Services
            </button>
          </div>
        </motion.div>

        {/* 🔥 RIGHT: Max UI Animated Car */}
        <div className="flex justify-center relative">
          <motion.div 
            className="relative bg-gradient-to-br from-neutral-900/80 to-black p-8 rounded-[2.5rem] border border-neutral-800 shadow-2xl backdrop-blur-sm group"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Pulsing Red Aura Behind Car */}
            <motion.div 
              className="absolute inset-0 bg-red-600/20 rounded-[2.5rem] blur-[60px] -z-10"
              animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Floating Car Image */}
            <motion.img
              src={car}
              alt="Premium Service Car"
              className="relative z-10 w-[500px] drop-shadow-[0_20px_30px_rgba(220,38,38,0.4)]"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Fake Shadow Floor for depth */}
            <motion.div 
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[60%] h-4 bg-black/80 blur-md rounded-[100%]"
              animate={{ scale: [1, 0.85, 1], opacity: [0.8, 0.4, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            ></motion.div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}