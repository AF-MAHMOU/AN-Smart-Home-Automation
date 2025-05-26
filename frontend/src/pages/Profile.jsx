import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLogOut, FiEdit2, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!user?._id) return;
    const fetchLogs = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}/logs`);
        setLogs(res.data);
      } catch {
        setLogs([]);
      }
    };
    fetchLogs();
  }, [user]);

  return (
    <div className="min-h-screen bg-[#232323] flex flex-col p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto w-full"
      >
        {/* Profile Header */}
        <div className="bg-[#393939] rounded-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-orange-400 rounded-full p-3">
              <FiUser className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-white text-xl font-semibold">{user?.email}</h2>
              <p className="text-orange-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Profile Actions */}
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#393939] text-white p-4 rounded-lg flex items-center gap-3 hover:bg-[#444444] transition-colors"
          >
            <FiEdit2 className="text-orange-400" />
            <span>Edit Profile</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-4 rounded-lg flex items-center gap-3 hover:bg-red-600 transition-colors"
          >
            <FiLogOut />
            <span>Logout</span>
          </motion.button>
        </div>

        {/* Activity History */}
        <div className="mt-8 bg-[#393939] rounded-lg p-6">
          <h3 className="text-lg text-orange-400 mb-4">Activity History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white text-sm">
              <thead>
                <tr className="text-orange-400">
                  <th className="py-2 px-2">Action</th>
                  <th className="py-2 px-2">Device</th>
                  <th className="py-2 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? logs.map((log, idx) => (
                  <tr key={log._id || idx} className="border-b border-[#232323]">
                    <td className="py-2 px-2">{log.action}</td>
                    <td className="py-2 px-2">{log.deviceId ? `${log.deviceId.name} (${log.deviceId.type})` : '-'}</td>
                    <td className="py-2 px-2">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={3} className="text-gray-400 text-center py-4">No activity yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 