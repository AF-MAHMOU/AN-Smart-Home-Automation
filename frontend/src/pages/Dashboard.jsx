import { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DeviceCard from '../components/DeviceCard';
import { FiSettings, FiPlus, FiPower } from 'react-icons/fi';
import { FaUserCircle, FaHome } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SettingsPanel from '../components/SettingsPanel';
import { motion, AnimatePresence } from 'framer-motion';
import HomeButton from '../components/HomeButton';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({ name: '', type: '' });
  const [showSettings, setShowSettings] = useState(false);
  const [showAiNotif, setShowAiNotif] = useState(false);
  const aiTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const [aiEnabled, setAiEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('smarthome_settings'))?.aiSuggestions !== false;
    } catch {
      return true;
    }
  });
  const [pushNotifEnabled, setPushNotifEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('smarthome_settings'))?.aiPushNotif !== false;
    } catch {
      return true;
    }
  });
  const [deviceOnTimes, setDeviceOnTimes] = useState({});
  const [roomDeviceStatus, setRoomDeviceStatus] = useState({});

  useEffect(() => {
    const fetchDevices = async () => {
      if (!user?._id) return;
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user._id}/devices`);
        setDevices(res.data);
      } catch (err) {
        setError('Failed to fetch devices');
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, [user]);

  const handleToggleDevice = async (deviceId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/devices/${deviceId}`);
      setDevices(devices.map(device => device._id === deviceId ? res.data : device));
    } catch (err) {
      setError('Failed to toggle device');
    }
  };

  const handleClearDevices = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${user._id}/devices`);
      setDevices([]);
      setShowSettings(false);
    } catch (err) {
      setError('Failed to clear devices');
    }
  };

  // Add a helper for fake battery, signal, and energy usage
  const getFakeBattery = (type) => {
    // Only show battery for battery-powered devices
    const batteryDevices = ['Lock', 'Camera', 'Sensor'];
    if (!batteryDevices.includes(type)) return 'N/A';
    return Math.floor(60 + Math.random() * 40) + '%';
  };
  const getFakeSignal = () => ['Weak', 'Medium', 'Strong'][Math.floor(Math.random() * 3)];
  const getFakeEnergy = (type) => {
    switch(type) {
      case 'AC': return '1200W';
      case 'Fan': return '60W';
      case 'Light': return '12W';
      case 'TV': return '80W';
      case 'Purifier': return '30W';
      default: return '20W';
    }
  };
  const getFakeLocation = () => ['Living Room', 'Bedroom', 'Kitchen', 'Office'][Math.floor(Math.random() * 4)];

  // Enhanced device type icons with more visual appeal (larger)
  const deviceTypeIcon = (type) => {
    const iconStyle = "text-4xl p-4 rounded-2xl bg-[#2a2a2a]";
    switch(type) {
      case 'TV': return <span className={`${iconStyle} text-blue-400`}>📺</span>;
      case 'Light': return <span className={`${iconStyle} text-yellow-300`}>💡</span>;
      case 'Purifier': return <span className={`${iconStyle} text-green-400`}>🌀</span>;
      case 'Fan': return <span className={`${iconStyle} text-cyan-300`}>🪭</span>;
      case 'AC': return <span className={`${iconStyle} text-blue-300`}>❄️</span>;
      case 'Lock': return <span className={`${iconStyle} text-red-400`}>🔒</span>;
      case 'Camera': return <span className={`${iconStyle} text-purple-400`}>📷</span>;
      case 'Sensor': return <span className={`${iconStyle} text-orange-300`}>🛰️</span>;
      default: return <span className={`${iconStyle} text-gray-400`}>🔌</span>;
    }
  };

  // Room map visualization
  const roomsWithDevices = Array.from(new Set(devices.map(d => d.room)));

  // AI Suggestions logic
  const getSettings = () => {
    try {
      return JSON.parse(localStorage.getItem('smarthome_settings')) || {};
    } catch {
      return {};
    }
  };

  // Track device on times and room device status
  useEffect(() => {
    const now = Date.now();
    setDeviceOnTimes(prev => {
      const updated = { ...prev };
      devices.forEach(device => {
        if (device.status === 'on') {
          if (!updated[device._id]) updated[device._id] = now;
        } else {
          delete updated[device._id];
        }
      });
      return updated;
    });
    // Room device status
    const roomStatus = {};
    devices.forEach(device => {
      if (!roomStatus[device.room]) roomStatus[device.room] = [];
      roomStatus[device.room].push(device.status === 'on');
    });
    setRoomDeviceStatus(roomStatus);
  }, [devices]);

  useEffect(() => {
    if (!aiEnabled) return;
    function suggest() {
      let suggestion = '';
      const now = new Date();
      for (const device of devices) {
        const onSince = deviceOnTimes[device._id];
        const onDuration = onSince ? (Date.now() - onSince) / (1000 * 60 * 60) : 0; // hours
        if (device.type === 'AC' && device.status === 'on') {
          if (device.temperature < 20) {
            suggestion = `AC "${device.name}" is set to a low temperature (${device.temperature}°C). Consider increasing the temperature or turning it off to save electricity.`;
            break;
          }
          if (onDuration > 2) {
            suggestion = `AC "${device.name}" has been on for over 2 hours. Consider turning it off to save energy.`;
            break;
          }
        }
        if (device.type === 'Fan' && device.status === 'on') {
          if (device.speed >= 4 && onDuration > 1) {
            suggestion = `Fan "${device.name}" has been running at high speed for over 1 hour. Lower the speed to save power.`;
            break;
          }
          // If fan is on and all other devices in the room are off
          const othersOn = devices.filter(d => d.room === device.room && d._id !== device._id && d.status === 'on').length;
          if (othersOn === 0) {
            suggestion = `Fan "${device.name}" is on in an empty room. Consider turning it off.`;
            break;
          }
        }
        if (device.type === 'TV' && device.status === 'on' && onDuration > 3) {
          suggestion = `TV "${device.name}" has been on for over 3 hours. Consider turning it off if not in use.`;
          break;
        }
        if (device.type === 'Light' && device.status === 'on') {
          if (now.getHours() >= 8 && now.getHours() <= 18) {
            suggestion = `Light "${device.name}" is on during the day. Consider turning it off to save energy.`;
            break;
          }
          // If light is on and all other devices in the room are off
          const othersOn = devices.filter(d => d.room === device.room && d._id !== device._id && d.status === 'on').length;
          if (othersOn === 0) {
            suggestion = `Light "${device.name}" is on in an empty room. Consider turning it off.`;
            break;
          }
        }
        if (device.type === 'Purifier' && device.status === 'on' && onDuration > 2) {
          suggestion = `Purifier "${device.name}" has been on for over 2 hours. Consider turning it off to save energy.`;
          break;
        }
      }
      // Suggest closing rooms with all devices off
      for (const room in roomDeviceStatus) {
        if (roomDeviceStatus[room].length > 0 && roomDeviceStatus[room].every(on => !on)) {
          suggestion = `All devices in "${room}" are off. You can close the room to save energy.`;
          break;
        }
      }
      setAiSuggestion(suggestion);
      if (suggestion) {
        setShowAiNotif(true);
        if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
        aiTimeoutRef.current = setTimeout(() => setShowAiNotif(false), 6000);
      }
    }
    suggest();
    const interval = setInterval(suggest, 5 * 60 * 1000); // 5 minutes
    return () => {
      clearInterval(interval);
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    };
  }, [devices, aiEnabled, deviceOnTimes, roomDeviceStatus]);

  const handleAiToggle = () => {
    setAiEnabled((prev) => {
      const newVal = !prev;
      // Update localStorage settings
      const settings = JSON.parse(localStorage.getItem('smarthome_settings')) || {};
      settings.aiSuggestions = newVal;
      localStorage.setItem('smarthome_settings', JSON.stringify(settings));
      return newVal;
    });
  };

  const handlePushNotifToggle = () => {
    setPushNotifEnabled((prev) => {
      const newVal = !prev;
      // Update localStorage settings
      const settings = JSON.parse(localStorage.getItem('smarthome_settings')) || {};
      settings.aiPushNotif = newVal;
      localStorage.setItem('smarthome_settings', JSON.stringify(settings));
      return newVal;
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#1a1a1a] p-8 pb-32">
        <HomeButton />
        {/* Enhanced Header */}
        <div className="px-8 pt-8 flex items-center justify-between mb-10">
          <div>
            <h2 className="text-lg text-orange-400/80 font-semibold mb-2">Welcome back</h2>
            <div className="text-white text-4xl font-extrabold flex items-center gap-4">
              <span>Smart Home</span>
              <span className="text-lg bg-orange-400/20 text-orange-400 px-4 py-2 rounded-full">
                {devices.filter(d => d.status === 'on').length} active
              </span>
            </div>
          </div>
          <button 
            className="text-gray-300 hover:text-orange-400 transition-colors p-4 rounded-full bg-[#2a2a2a] text-2xl"
            onClick={() => navigate('/settings')}
          >
            <FiSettings className="text-2xl" />
          </button>
        </div>

        {/* Enhanced Room Map Visualization (larger) */}
        {roomsWithDevices.length > 0 && (
          <div className="mb-12 w-full max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="text-orange-400 font-bold text-xl">HOME MAP</div>
              <div className="text-lg text-gray-400">{roomsWithDevices.length} rooms</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {roomsWithDevices.map(room => {
                const roomDevices = devices.filter(d => d.room === room);
                const activeCount = roomDevices.filter(d => d.status === 'on').length;
                return (
                  <motion.div 
                    key={room}
                    whileHover={{ scale: 1.03 }}
                    className="bg-[#252525] rounded-2xl p-8 min-h-[180px] flex flex-col border-2 border-[#333] hover:border-orange-400/40 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-white font-bold text-xl truncate">{room}</div>
                      <span className="text-base bg-[#333] text-orange-400 px-4 py-1 rounded-full">
                        {activeCount}/{roomDevices.length}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-auto">
                      {roomDevices.map(device => (
                        <motion.div 
                          key={device._id} 
                          whileTap={{ scale: 0.97 }}
                          onClick={() => navigate(`/manage-device/${device._id}`)}
                          className="flex flex-col items-center cursor-pointer"
                        >
                          <div className="relative">
                            {deviceTypeIcon(device.type)}
                            {device.status === 'on' && (
                              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-[#252525]"></div>
                            )}
                          </div>
                          <span className="text-base text-gray-300 mt-2 truncate max-w-[90px]">{device.name}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}

        {/* Enhanced Device Controller Section (larger) */}
        <div className="px-4 mt-12">
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="text-orange-400 font-bold text-xl">DEVICE CONTROLLER</div>
            <button 
              onClick={() => navigate('/add-device')}
              className="text-base flex items-center gap-2 bg-orange-400/10 text-orange-400 hover:bg-orange-400/20 px-6 py-2 rounded-full transition-colors font-semibold"
            >
              <FiPlus size={18} />
              Add Device
            </button>
          </div>

          {loading ? (
            <div className="text-center text-white/50 py-16 text-xl">Loading devices...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-16 text-xl">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {devices.map(device => (
                <motion.div 
                  key={device._id} 
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/manage-device/${device._id}`)}
                  className={`rounded-2xl p-8 flex flex-col ${device.status === 'on' ? 'bg-orange-400/10 border-2 border-orange-400/30' : 'bg-[#252525] border-2 border-[#333]'} transition-all cursor-pointer min-h-[180px]`}
                >
                  <div className="flex items-center justify-between mb-6">
                    {deviceTypeIcon(device.type)}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleDevice(device._id); }}
                      className={`w-14 h-7 rounded-full flex items-center px-1 ${device.status === 'on' ? 'bg-orange-400' : 'bg-gray-600'}`}
                    >
                      <motion.span 
                        className="block w-6 h-6 rounded-full bg-white shadow"
                        animate={{ x: device.status === 'on' ? 28 : 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      ></motion.span>
                    </button>
                  </div>
                  <div className="text-white font-bold text-lg mb-2 truncate">{device.name}</div>
                  <div className="text-base text-orange-300/80 mb-2">{device.brand}</div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-base text-gray-400">{getFakeLocation()}</div>
                    <div className="text-base flex items-center gap-2 text-orange-400">
                      <FiPower size={16} />
                      <span>{getFakeEnergy(device.type)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced AI Suggestion Panel (larger) */}
        <div className="px-4 mt-16 mb-12">
          <motion.div 
            whileHover={{ y: -4 }}
            className="rounded-2xl bg-[#252525] p-8 border-2 border-[#333]"
          >
            <div className="flex items-center gap-6">
              <div className="bg-orange-400/10 p-4 rounded-2xl text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8"></path>
                  <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                  <path d="M2 14h2"></path>
                  <path d="M20 14h2"></path>
                  <path d="M15 13v2"></path>
                  <path d="M9 13v2"></path>
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-orange-400 font-bold text-xl">AI ASSISTANT</span>
                  <button
                    onClick={handleAiToggle}
                    className={`w-14 h-7 rounded-full flex items-center transition-colors duration-200 ${aiEnabled ? 'bg-orange-400' : 'bg-gray-600'}`}
                  >
                    <motion.span
                      className="block w-6 h-6 rounded-full bg-white shadow"
                      animate={{ x: aiEnabled ? 28 : 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    ></motion.span>
                  </button>
                </div>
                <div className="text-white text-lg min-h-[32px]">
                  {aiEnabled && aiSuggestion ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/80 text-lg"
                    >
                      {aiSuggestion}
                    </motion.div>
                  ) : (
                    <span className="text-white/50">AI suggestions are {aiEnabled ? 'ready' : 'disabled'}</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Enhanced AI Notification (larger) */}
        <AnimatePresence>
          {aiEnabled && showAiNotif && aiSuggestion && (
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 shadow-2xl"
            >
              <div className="bg-orange-400 text-white px-8 py-4 rounded-2xl flex items-center gap-4 max-w-xl text-lg">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
                <div className="truncate">{aiSuggestion}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Dashboard; 