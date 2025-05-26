import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion'; // For animations
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const features = [
  { 
    icon: '💡', 
    title: 'Control Devices', 
    desc: 'Toggle lights, AC, and more from anywhere.',
    bg: 'bg-gradient-to-br from-orange-400 to-yellow-500'
  },
  { 
    icon: '🔒', 
    title: 'Smart Security', 
    desc: 'Lock/unlock doors and monitor cameras remotely.',
    bg: 'bg-gradient-to-br from-blue-400 to-indigo-500'
  },
  { 
    icon: '📊', 
    title: 'Analytics', 
    desc: 'Track energy usage with beautiful visualizations.',
    bg: 'bg-gradient-to-br from-green-400 to-teal-500'
  },
  { 
    icon: '🤖', 
    title: 'AI Automation', 
    desc: 'Smart suggestions to optimize your home.',
    bg: 'bg-gradient-to-br from-purple-400 to-pink-500'
  },
];

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#181818] flex flex-col items-center relative overflow-x-hidden">
      {/* Sticky Home Button */}
      <motion.button 
        onClick={() => navigate('/')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="fixed top-6 left-6 z-50 bg-[#232323]/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-orange-400 transition-all hover:shadow-orange-400/20 hover:scale-110"
      >
        <img src={logo} alt="Smart Home Logo" className="w-8 h-8" />
      </motion.button>

      {/* Hero Section */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center pt-28 pb-16 w-full px-6"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="mb-6"
        >
          <img src={logo} alt="Smart Home Logo" className="w-28 h-28" />
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-center leading-tight">
          Welcome to <span className="text-orange-400">AN Smart Home</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-2xl text-center leading-relaxed">
          Automate, secure, and manage your home from anywhere — all in one <span className="text-orange-400 font-medium">sleek platform</span>.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
          {user ? (
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(user.role === 'admin' ? '/admin' : '/dashboard')} 
              className="btn-primary bg-gradient-to-r from-orange-400 to-orange-500 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              {user.role === 'admin' ? 'Go to Admin Dashboard' : 'Go to Dashboard'}
            </motion.button>
          ) : (
            <>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/signup')} 
                className="btn-primary bg-gradient-to-r from-orange-400 to-orange-500 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-orange-500/30 transition-all"
              >
                Get Started
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')} 
                className="btn-secondary bg-transparent text-orange-400 text-lg font-semibold py-3 px-8 rounded-lg border-2 border-orange-400 hover:bg-orange-400/10 transition-all"
              >
                Login
              </motion.button>
            </>
          )}
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Powerful <span className="text-orange-400">Features</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Everything you need for a truly smart home experience
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, index) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className={`${f.bg} p-1 rounded-xl shadow-lg hover:shadow-xl transition-all`}
            >
              <div className="bg-[#232323] rounded-lg p-6 h-full flex flex-col items-center text-center hover:bg-[#2a2a2a] transition-all">
                <div className={`text-4xl mb-4 p-4 rounded-full ${f.bg} bg-clip-text text-transparent`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-300 text-sm md:text-base">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-4xl mx-auto px-6 py-16 bg-[#232323]/30 rounded-3xl my-8 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Simple <span className="text-orange-400">3-Step</span> Setup
          </h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {[
              { step: "1", title: "Create Account", desc: "Sign up in seconds", emoji: "📝" },
              { step: "2", title: "Add Devices", desc: "Connect your smart home", emoji: "📶" },
              { step: "3", title: "Start Controlling", desc: "Manage from anywhere", emoji: "📱" }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex-1 bg-[#232323] rounded-xl p-6 hover:bg-[#2a2a2a] transition-all"
              >
                <div className="text-orange-400 text-2xl font-bold mb-2">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title} {item.emoji}</h3>
                <p className="text-gray-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Preview Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Beautiful <span className="text-orange-400">Interface</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Designed for both simplicity and powerful control
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/10 to-transparent w-full h-full z-0"></div>
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-center relative z-10">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full max-w-md"
            >
              <div className="bg-[#232323] rounded-2xl p-2 shadow-2xl border border-[#333]">
                <div className="bg-black rounded-lg overflow-hidden">
                  <img 
                    src="/mockup-dashboard.png" 
                    alt="Dashboard Preview" 
                    className="w-full h-auto object-cover rounded-lg" 
                  />
                </div>
              </div>
              <p className="text-center text-gray-400 mt-4">Smart Control Dashboard</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="w-full max-w-md"
            >
              <div className="bg-[#232323] rounded-2xl p-2 shadow-2xl border border-[#333]">
                <div className="bg-black rounded-lg overflow-hidden">
                  <img 
                    src="/mockup-admin.png" 
                    alt="Admin Preview" 
                    className="w-full h-auto object-cover rounded-lg" 
                  />
                </div>
              </div>
              <p className="text-center text-gray-400 mt-4">Advanced Analytics</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gradient-to-br from-[#232323] to-[#121212] mt-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your <span className="text-orange-400">Home?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy users who automated their homes with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-orange-400 to-orange-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-orange-500/30 transition-all"
            >
              Start Free Trial
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/demo')}
              className="bg-transparent text-orange-400 font-semibold py-3 px-8 rounded-lg border-2 border-orange-400 hover:bg-orange-400/10 transition-all"
            >
              Watch Demo
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Welcome;