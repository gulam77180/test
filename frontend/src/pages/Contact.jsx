import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

export default function Contact() {
  // ⚡ Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="bg-black text-white min-h-screen pt-32 pb-24 px-6 relative overflow-hidden font-sans selection:bg-red-600/30">
      
      {/* 🔥 Background Glowing Orbs */}
      <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-red-700/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-red-900/10 blur-[150px] rounded-full pointer-events-none -z-10"></div>

      {/* 🔥 Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16 z-10 relative">
        <motion.div initial="hidden" animate="visible" variants={itemVariants}>
          <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm mb-3">Get In Touch</h2>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Let's Talk <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Engines.</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you need a quick quote, want to book an appointment, or just have a question about your vehicle, our experts are ready to help.
          </p>
        </motion.div>
      </div>

      {/* 🔥 Main Content (Split Layout) */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 relative z-10">
        
        {/* LEFT SIDE: Contact Information */}
        <motion.div 
          className="w-full lg:w-5/12 space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Info Cards */}
          <div className="space-y-8">
            <motion.div variants={itemVariants} className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] shrink-0">
                <FaMapMarkerAlt size={22} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Our Garage</h3>
                <p className="text-neutral-400 leading-relaxed">
                  123 AutoService Lane,<br />
                  Motor City, MC 40001<br />
                  Bhiwandi, Maharashtra
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] shrink-0">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Call Us Directly</h3>
                <p className="text-neutral-400">Sales: +91 98765 43210</p>
                <p className="text-neutral-400">Service: +91 98765 43211</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-start gap-6 group">
              <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-lg group-hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] shrink-0">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Email Support</h3>
                <p className="text-neutral-400 hover:text-red-500 cursor-pointer transition-colors">support@autoservice.com</p>
                <p className="text-neutral-400 hover:text-red-500 cursor-pointer transition-colors">bookings@autoservice.com</p>
              </div>
            </motion.div>
          </div>

          {/* Social Media */}
          <motion.div variants={itemVariants} className="pt-6 border-t border-neutral-800">
            <h3 className="text-lg font-bold mb-6 uppercase tracking-widest text-neutral-300">Follow Our Builds</h3>
            <div className="flex gap-4">
              {[
                { icon: FaInstagram, href: "#" },
                { icon: FaFacebookF, href: "#" },
                { icon: FaTwitter, href: "#" },
                { icon: FaYoutube, href: "#" }
              ].map((social, idx) => (
                <a 
                  key={idx} 
                  href={social.href} 
                  className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(220,38,38,0.4)]"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE: Contact Form (Glassmorphism) */}
        <motion.div 
          className="w-full lg:w-7/12"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
        >
          <div className="bg-neutral-900/40 backdrop-blur-md border border-neutral-800 p-8 md:p-12 rounded-3xl shadow-2xl relative group">
            {/* Subtle border glow on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <h2 className="text-3xl font-bold mb-8 text-white relative z-10">Send us a Message</h2>
            
            <form className="space-y-6 relative z-10" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Your Name</label>
                  <input 
                    type="text" 
                    className="w-full p-4 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-600" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full p-4 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-600" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Subject (Optional)</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-600" 
                  placeholder="e.g. Engine Repair Inquiry" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Message</label>
                <textarea 
                  rows="5"
                  className="w-full p-4 bg-black/50 border border-neutral-800 rounded-xl focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-white placeholder-neutral-600 resize-none" 
                  placeholder="Tell us about your car and what you need..." 
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-red-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] flex justify-center items-center gap-2"
              >
                <span>Send Message</span>
                <span className="text-xl">→</span>
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}