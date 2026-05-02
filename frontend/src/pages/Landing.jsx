import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRocket, FaChartLine, FaStar, FaShieldAlt, FaArrowRight } from "react-icons/fa";

export default function Landing() {
  const navigate = useNavigate();

  // ⚡ Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring", bounce: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden font-sans selection:bg-red-600/30">
      
      {/* 🔥 CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2000&auto=format&fit=crop" 
          alt="Premium Car Dark" 
          className="w-full h-full object-cover opacity-40 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
        />
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 blur-[120px] rounded-full mix-blend-screen z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-900/20 blur-[150px] rounded-full mix-blend-screen z-10"></div>
      </div>

      {/* 🔥 MAIN CONTENT WRAPPER */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center items-center px-6 pt-20 pb-10">
        
        {/* Trust Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        >
          <div className="flex text-yellow-500 text-sm">
            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-neutral-300">Trusted by 10,000+ Drivers</span>
        </motion.div>

        {/* Hero Typography */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.h1 variants={fadeUp} className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
            Precision Auto Care. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              Zero Compromise.
            </span>
          </motion.h1>
          
          <motion.p variants={fadeUp} className="text-lg md:text-2xl text-neutral-400 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
            Skip the waiting room. Book premium services instantly, track your vehicle's progress live, and let our certified master mechanics handle the rest.
          </motion.p>

          {/* IRRESISTIBLE CTA BUTTON */}
          <motion.div variants={fadeUp} className="relative inline-block group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-900 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200"></div>
            <button
              onClick={() => navigate("/login")}
              className="relative flex items-center gap-4 bg-black border border-red-500/50 px-10 py-5 rounded-full text-lg font-bold uppercase tracking-widest text-white transition-all transform group-hover:scale-105 active:scale-95"
            >
              <span>Enter The Garage</span>
              <FaArrowRight className="group-hover:translate-x-2 transition-transform duration-300 text-red-500" />
            </button>
          </motion.div>
        </motion.div>

        {/* 🔥 GLASSMORPHISM FEATURES GRID */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: FaRocket, title: "Lightning Fast Booking", desc: "Schedule your service in under 60 seconds with our smart AI booking system." },
            { icon: FaShieldAlt, title: "Certified Master Mechanics", desc: "Your car is touched only by vetted professionals with 10+ years of experience." },
            { icon: FaChartLine, title: "Live Bay Tracking", desc: "Watch exactly what's happening to your car with real-time digital status updates." }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              variants={fadeUp}
              whileHover={{ y: -10 }}
              className="group relative bg-neutral-900/30 backdrop-blur-xl border border-neutral-800 p-8 rounded-3xl hover:border-red-600/50 transition-all duration-500 overflow-hidden"
            >
              {/* Hover Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-black border border-neutral-700 rounded-2xl flex items-center justify-center mb-6 group-hover:border-red-500 group-hover:text-red-500 transition-colors shadow-lg">
                  <feature.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>

      {/* Floating Gradient Bottom Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50"></div>
    </div>
  );
}