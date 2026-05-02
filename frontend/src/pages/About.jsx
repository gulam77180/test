import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // 🔥 1. IMPORT ADD KIYA

export default function About() {
  const navigate = useNavigate(); // 🔥 2. HOOK INITIALIZE KIYA

  // ⚡ Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, type: "spring", bounce: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const scaleUp = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-red-600/30 overflow-hidden">
      
      {/* 🔥 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        <motion.div 
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-700/20 blur-[120px] rounded-full -z-10"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="inline-block px-4 py-1.5 mb-6 bg-neutral-900 border border-neutral-800 rounded-full text-red-500 text-sm font-bold uppercase tracking-widest">
            Behind the Wrench
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
            Forged in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Passion.</span>
          </h1>
          <p className="text-neutral-400 text-lg md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            We are more than just mechanics. We are automotive purists dedicated to preserving the soul of every machine that rolls into our bay.
          </p>
        </motion.div>
      </section>

      {/* 🔥 2. OUR STORY (Split Layout) */}
      <section className="py-24 px-6 bg-neutral-950 border-y border-neutral-900 relative">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            className="w-full lg:w-1/2 relative"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={scaleUp}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-transparent rounded-3xl blur-2xl opacity-20 translate-x-4 translate-y-4"></div>
            <img 
              src="https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?q=80&w=1000&auto=format&fit=crop" 
              alt="Garage History" 
              className="relative z-10 rounded-3xl border border-neutral-800 shadow-2xl grayscale hover:grayscale-0 transition-all duration-700 object-cover h-[500px] w-full"
            />
          </motion.div>

          <motion.div 
            className="w-full lg:w-1/2 space-y-8"
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold">
              The AutoService <span className="text-red-600">Legacy</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-neutral-400 text-lg leading-relaxed">
              What started in 1998 as a small two-bay garage has evolved into the city's most trusted premium automotive care center. We built our reputation on a simple, unbreakable rule: **Treat every car like it belongs to our own family.**
            </motion.p>
            <motion.p variants={fadeUp} className="text-neutral-400 text-lg leading-relaxed">
              Over the decades, engines got more complex and tools got digital, but our grease-stained dedication to honest, high-quality craftsmanship hasn't changed a bit.
            </motion.p>
            
            <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
              {[
                { number: "25+", label: "Years" },
                { number: "50k", label: "Cars Fixed" },
                { number: "100%", label: "Genuine" },
                { number: "24/7", label: "Support" },
              ].map((stat, i) => (
                <div key={i} className="border-l-2 border-red-600 pl-4">
                  <h4 className="text-3xl font-black text-white">{stat.number}</h4>
                  <p className="text-neutral-500 text-sm font-semibold uppercase">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 🔥 3. OUR CORE VALUES (Grid Layout) */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <motion.div className="text-center mb-20" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <h2 className="text-5xl font-extrabold uppercase tracking-tight">
            Why We Are <span className="text-red-600">Different</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
        >
          {[
            { icon: "🛡️", title: "Uncompromising Quality", desc: "We exclusively use OEM or top-tier aftermarket parts. No shortcuts, no compromises." },
            { icon: "شفاف", title: "Absolute Transparency", desc: "You see what we see. Detailed digital inspections and honest pricing before we turn a single wrench." },
            { icon: "⚡", title: "Precision & Speed", desc: "Modern diagnostic equipment paired with veteran intuition gets you back on the road safely and swiftly." }
          ].map((value, i) => (
            <motion.div 
              key={i} variants={fadeUp}
              className="bg-neutral-900/30 p-10 rounded-3xl border border-neutral-800 hover:border-red-600/50 hover:bg-neutral-900 transition-all duration-500 group"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">{value.icon}</div>
              <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-red-500 transition-colors">{value.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 🔥 4. MEET THE EXPERTS (Team Section) */}
      <section className="py-24 px-6 bg-gradient-to-b from-neutral-950 to-black">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          >
            The Masters of the <span className="text-red-600">Trade</span>
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-3 gap-10"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          >
            {[
              { img: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?q=80&w=800&auto=format&fit=crop", name: "Ansari Zaid", role: "Head of Diagnostics" },
              { img: "https://petromin.in/wp-content/uploads/2025/12/Petromin_Website-Asset_Phase-2Images_Final-Deck_Engine-Care-1.webp", name: "Khan Uzair", role: "Master Technician" },
              { img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1e7VLYt6EBb0TVzNeYmaWSwwc7RuBO7xCqA&s", name: "Momin Abdullah", role: "Performance Specialist" }
            ].map((member, i) => (
              <motion.div key={i} variants={fadeUp} className="group relative overflow-hidden rounded-2xl border border-neutral-800">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                <img src={member.img} alt={member.name} className="w-full h-[400px] object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-full p-6 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                  <p className="text-red-500 font-semibold">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🔥 5. FINAL CTA */}
      <section className="py-32 px-6 text-center relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-red-600/10 blur-[100px] rounded-full -z-10"></div>
         <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-5xl font-black italic">Ready to experience the best?</h2>
            <p className="text-xl text-neutral-400">Stop trusting your car to amateurs. Book an appointment today and feel the difference of true automotive excellence.</p>
            {/* 🔥 3. ONCLICK ADD KIYA YAHAN */}
            <button 
              onClick={() => navigate("/contact")}
              className="bg-red-600 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all transform hover:scale-110 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
            >
              Contact Us Now
            </button>
         </motion.div>
      </section>
      
    </div>
  );
}