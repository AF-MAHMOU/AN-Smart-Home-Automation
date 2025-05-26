import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-[#232323] shadow-md border-b border-[#393939]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-orange-400 tracking-tight">
            AN Smart Home
          </Link>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white text-sm font-medium">
                  {user.email} <span className="text-orange-400 font-semibold">({user.role})</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded transition shadow"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-4 py-2 rounded transition shadow">
                  Login
                </Link>
                <Link to="/signup" className="bg-[#393939] hover:bg-orange-400 hover:text-white text-orange-400 font-semibold px-4 py-2 rounded border border-orange-400 transition shadow">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 