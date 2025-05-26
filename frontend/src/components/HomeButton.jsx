import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button 
      onClick={() => navigate('/')} 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ delay: 0.2 }}
      className="fixed top-6 left-6 z-50 bg-[#232323]/80 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-orange-400 transition-all hover:shadow-orange-400/20 hover:scale-110"
    >
      <img src={logo} alt="Smart Home Logo" className="w-8 h-8" />
    </motion.button>
  );
};

export default HomeButton; 