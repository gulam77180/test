import Hero from "../components/Hero";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Home() {
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, 
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const scaleUpVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        delay: 0.3,
      },
    },
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-red-600/30">
      {/* 🔥 HERO SECTION (Animated) */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Hero />
      </motion.div>

      {/* 🔥 SERVICES PREVIEW (Animated Cards & Hover) */}
      <div className="py-24 px-6 max-w-7xl mx-auto">
        <motion.h2 
          className="text-5xl font-extrabold text-center mb-16 tracking-tighter leading-tight"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }} 
        >
          Signature <span className="text-red-600 relative inline-block">Services
            <motion.span 
              className="absolute bottom-1 left-0 w-full h-1 bg-red-600 rounded" 
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
          </span>
        </motion.h2>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }} 
        >
          {/* Card 1 */}
          <motion.div 
            className="group bg-neutral-900/40 p-8 rounded-3xl border border-neutral-800 hover:border-red-600/50 transition-all duration-500 overflow-hidden relative"
            variants={itemVariants}
            whileHover={{ y: -10 }} 
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-2xl font-bold mb-3 text-red-500 group-hover:text-white transition-colors">Oil Change</h3>
            <p className="text-neutral-400 group-hover:text-neutral-100 transition-colors">
              Maintain peak engine performance with precision lubrication.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            className="group bg-neutral-900/40 p-8 rounded-3xl border border-neutral-800 hover:border-red-600/50 transition-all duration-500 overflow-hidden relative"
            variants={itemVariants}
            whileHover={{ y: -10 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-2xl font-bold mb-3 text-red-500 group-hover:text-white transition-colors">Brake Service</h3>
            <p className="text-neutral-400 group-hover:text-neutral-100 transition-colors">
              Advanced safety check & precision replacement for ultimate control.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            className="group bg-neutral-900/40 p-8 rounded-3xl border border-neutral-800 hover:border-red-600/50 transition-all duration-500 overflow-hidden relative"
            variants={itemVariants}
            whileHover={{ y: -10 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h3 className="text-2xl font-bold mb-3 text-red-500 group-hover:text-white transition-colors">Engine Repair</h3>
            <p className="text-neutral-400 group-hover:text-neutral-100 transition-colors">
              Expert diagnosis & custom repair solutions for optimal power output.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* 🔴 ABOUT US SECTION (Animated Legacy) */}
      <motion.div 
        className="py-28 px-6 bg-neutral-950 border-y border-neutral-900 overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative">
          
          <div className="absolute -top-32 left-1/4 text-[200px] font-black text-neutral-900 opacity-10 blur-sm whitespace-nowrap">
            SINCE 1998
          </div>

          <motion.div 
            className="w-full md:w-1/2 space-y-7 z-10"
            variants={itemVariants}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full text-red-400 text-sm font-bold uppercase tracking-widest">
              <span>Established 1998</span>
            </div>
            <h2 className="text-6xl font-extrabold leading-tight tracking-tighter">
              We Don't Just Fix <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">We Perfect.</span>
            </h2>
            <p className="text-neutral-400 text-xl leading-relaxed">
              AutoService is more than just a garage. We are a family of passionate technicians, artists, and mechanics. Every car, classic or modern, is treated with unparalleled care and precision.
            </p>
            <div className="flex gap-10 py-6">
              <motion.div variants={itemVariants}>
                <h4 className="text-5xl font-extrabold text-white">25+</h4>
                <p className="text-neutral-500 text-lg italic mt-1">Years Experience</p>
              </motion.div>
              <motion.div variants={itemVariants}>
                <h4 className="text-5xl font-extrabold text-white">100%</h4>
                <p className="text-neutral-500 text-lg italic mt-1">Precision Work</p>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2 relative"
            variants={scaleUpVariants}
          >
             <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-900 rounded-2xl blur-3xl opacity-20"></div>
             <div className="relative bg-black border border-neutral-800 p-2 rounded-2xl shadow-[0_0_60px_-10px_rgba(220,38,38,0.2)]">
                <img 
                  src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800" 
                  alt="Mechanic working" 
                  className="rounded-xl grayscale hover:grayscale-0 transition-all duration-700"
                />
             </div>
          </motion.div>
        </div>
      </motion.div>

      {/* 🔥 WHY CHOOSE US (Animated Steps) */}
      <motion.div 
        className="bg-black py-28 px-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 
          className="text-5xl font-extrabold text-center mb-20 tracking-tighter uppercase"
          variants={itemVariants}
        >
          Why <span className="text-red-600">Choose Us?</span>
        </motion.h2>
        <motion.div 
          className="grid md:grid-cols-3 gap-16 max-w-7xl mx-auto"
          variants={containerVariants}
        >
          {[
            { icon: "⚡", title: "Fast Service", desc: "Quick and reliable booking system to get you back on road." },
            { icon: "👨‍🔧", title: "Expert Mechanics", desc: "Certified professionals who understand your car's DNA." },
            { icon: "📊", title: "Real-time Tracking", desc: "Stay updated with live tracking of your car's service status." },
          ].map((item, index) => (
            <motion.div 
              key={index} 
              className="text-center group"
              variants={itemVariants}
            >
              <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-colors duration-300 shadow-xl group-hover:scale-110">
                <span className="text-3xl transition-transform group-hover:rotate-[360deg] duration-500">{item.icon}</span>
              </div>
              <h3 className="text-white font-extrabold text-2xl mb-3 tracking-tight">{item.title}</h3>
              <p className="text-neutral-500 text-lg group-hover:text-neutral-100 transition-colors">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* 🔥 CTA (Animated Glow and Button) */}
      <motion.div 
        className="text-center py-32 relative overflow-hidden bg-neutral-950 border-t border-neutral-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[100px] rounded-full"></div>
        <div className="relative z-10 space-y-10">
            <motion.h2 
              className="text-6xl font-extrabold italic tracking-tighter"
              variants={itemVariants}
            >
                Ready for the <span className="text-red-600">Perfect Ride?</span>
            </motion.h2>
            {/* 🔥 YAHAN ROUTE CHANGE KIYA HAI - /booking se /services kar diya */}
            <motion.button
              onClick={() => navigate("/services")}
              className="group bg-red-600 text-white px-12 py-5 rounded-full font-extrabold uppercase tracking-widest hover:bg-white hover:text-black transition-all transform hover:scale-110 shadow-[0_0_30px_rgba(220,38,38,0.5)] active:scale-95"
              variants={scaleUpVariants}
            >
              Book My Service Now
              <motion.span className="inline-block ml-3 group-hover:translate-x-1.5 transition-transform">→</motion.span>
            </motion.button>
        </div>
      </motion.div>
    </div>
  );
}