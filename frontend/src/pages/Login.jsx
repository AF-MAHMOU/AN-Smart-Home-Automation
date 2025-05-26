import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const result = await login(email, password);
      if (result.success) {
        // Get the user role from the context after login
        const currentUser = JSON.parse(localStorage.getItem('user'));
        navigate(currentUser.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center relative bg-gradient-to-b from-[#121212] to-[#181818] px-4">
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

      {/* Top Tab Menu */}
      <div className="flex justify-center w-full max-w-md mb-8 mt-8">
        <Link to="/login" className="flex-1 text-center py-3 rounded-t-lg font-semibold text-lg transition-all bg-orange-400 text-white">Sign In</Link>
        <Link to="/signup" className="flex-1 text-center py-3 rounded-t-lg font-semibold text-lg transition-all bg-[#232323] text-orange-400">Sign Up</Link>
      </div>

      {/* Welcome Message */}
      <div className="flex flex-col items-center mb-6">
        <div className="bg-orange-400 rounded-full p-4 mb-2 shadow-lg">
          <img src={logo} alt="Smart Home Logo" className="w-10 h-10" />
        </div>
        <h2 className="auth-title text-orange-400">Welcome Back!</h2>
        <p className="text-gray-400 text-center max-w-xs">Sign in to control and monitor your smart home devices from anywhere.</p>
      </div>

      {/* Login Form */}
      <div className="auth-card bg-[#232323] shadow-xl border border-[#333]">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-control bg-[#393939] text-white placeholder:text-gray-400"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-control bg-[#393939] text-white placeholder:text-gray-400"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full mt-md bg-orange-400 text-white hover:bg-orange-500 shadow-lg text-lg font-semibold py-3 rounded-lg"
          >
            Login
          </button>
        </form>

        <button className="w-full mt-4 text-orange-400 font-semibold underline">
          Continue as a guest
        </button>
      </div>
    </div>
  );
};

export default Login;
