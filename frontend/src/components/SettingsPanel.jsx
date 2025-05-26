import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultSettings = {
  defaultRoom: 'Living Room',
  preferredConnection: 'Wi-Fi',
  powerAlert: 1000,
  autoOffTimer: 30,
  nightMode: false,
  awayMode: false,
  aiSuggestions: true,
  refreshInterval: 10,
};

const roomOptions = ['Bedroom', 'Kitchen', 'Living Room', 'Office'];
const connectionOptions = ['Wi-Fi', 'Bluetooth', 'Zigbee'];

function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem('smarthome_settings')) || defaultSettings;
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings) {
  localStorage.setItem('smarthome_settings', JSON.stringify(settings));
}

function loadRooms() {
  try {
    return JSON.parse(localStorage.getItem('smarthome_rooms')) || ['Bedroom', 'Kitchen', 'Living Room', 'Office'];
  } catch {
    return ['Bedroom', 'Kitchen', 'Living Room', 'Office'];
  }
}

function saveRooms(rooms) {
  localStorage.setItem('smarthome_rooms', JSON.stringify(rooms));
}

const SettingsPanel = ({ open, onClose, onClearDevices }) => {
  const [settings, setSettings] = useState(loadSettings());
  const [rooms, setRooms] = useState(loadRooms());
  const [newRoom, setNewRoom] = useState('');
  const [networkType, setNetworkType] = useState('Wi-Fi');
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [networkStatus, setNetworkStatus] = useState('idle');
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [diagnostics, setDiagnostics] = useState(null);

  useEffect(() => {
    saveRooms(rooms);
  }, [rooms]);

  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    saveSettings(defaultSettings);
  };

  const handleDiagnostics = () => {
    setShowDiagnostics(true);
    setDiagnostics(null);
    setTimeout(() => {
      setDiagnostics({
        wifi: '✅ Connected',
        battery: '✅ Good',
        firmware: '⚠️ Update not supported',
      });
    }, 1200);
  };

  const handleAddRoom = () => {
    if (newRoom && !rooms.includes(newRoom)) {
      setRooms([...rooms, newRoom]);
      setNewRoom('');
    }
  };

  const dummyNetworks = {
    'Wi-Fi': ['HomeNet', 'OfficeWiFi', 'SmartHub'],
    'Bluetooth': ['BT-Device-1', 'BT-Device-2'],
    'Zigbee': ['ZigbeeNet1', 'ZigbeeNet2']
  };

  const handleNetworkTypeChange = (type) => {
    setNetworkType(type);
    setNetworks(dummyNetworks[type]);
    setSelectedNetwork('');
    setNetworkStatus('idle');
  };

  const handleConnectNetwork = () => {
    setNetworkStatus('connecting');
    setTimeout(() => {
      setNetworkStatus('connected');
      localStorage.setItem('smarthome_network', JSON.stringify({ type: networkType, name: selectedNetwork }));
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
        >
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-[#232323] rounded-xl p-6 w-full max-w-lg shadow-2xl relative"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-orange-400 text-2xl">&times;</button>
            <h2 className="text-2xl font-bold text-orange-400 mb-4">Settings</h2>

            {/* Device Preferences */}
            <div className="mb-6">
              <h3 className="text-lg text-orange-400 mb-2">Device Preferences</h3>
              <div className="mb-3">
                <label className="block text-white mb-1">Add Room</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRoom}
                    onChange={e => setNewRoom(e.target.value)}
                    className="bg-[#393939] text-white rounded p-2 flex-1"
                    placeholder="e.g. Garage, Kids Room"
                  />
                  <button
                    onClick={handleAddRoom}
                    className="bg-orange-400 text-white rounded px-4 py-2 hover:bg-orange-500 transition"
                    type="button"
                  >Add</button>
                </div>
              </div>
              <div className="mb-3">
                <label className="block text-white mb-1">Default Room for New Devices</label>
                <select
                  className="bg-[#393939] text-white rounded p-2 w-full"
                  value={settings.defaultRoom}
                  onChange={e => handleChange('defaultRoom', e.target.value)}
                >
                  {rooms.map(room => (
                    <option key={room} value={room}>{room}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-white mb-1">Preferred Connection Type</label>
                <div className="flex gap-4 mt-1">
                  {connectionOptions.map(opt => (
                    <label key={opt} className="flex items-center gap-2 text-white">
                      <input
                        type="radio"
                        name="preferredConnection"
                        value={opt}
                        checked={settings.preferredConnection === opt}
                        onChange={() => handleChange('preferredConnection', opt)}
                        className="accent-orange-400"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-white mb-1">Connect to Network</label>
                <div className="flex gap-2 mb-2">
                  {connectionOptions.map(type => (
                    <button
                      key={type}
                      onClick={() => handleNetworkTypeChange(type)}
                      className={`px-3 py-1 rounded ${networkType === type ? 'bg-orange-400 text-white' : 'bg-[#393939] text-orange-400'} transition`}
                      type="button"
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <select
                  className="bg-[#393939] text-white rounded p-2 w-full mb-2"
                  value={selectedNetwork}
                  onChange={e => setSelectedNetwork(e.target.value)}
                >
                  <option value="">Select Network</option>
                  {networks.map(net => (
                    <option key={net} value={net}>{net}</option>
                  ))}
                </select>
                <button
                  onClick={handleConnectNetwork}
                  className="bg-orange-400 text-white rounded px-4 py-2 w-full hover:bg-orange-500 transition"
                  type="button"
                  disabled={!selectedNetwork || networkStatus === 'connecting' || networkStatus === 'connected'}
                >
                  {networkStatus === 'idle' && 'Connect'}
                  {networkStatus === 'connecting' && 'Connecting...'}
                  {networkStatus === 'connected' && 'Connected!'}
                </button>
              </div>
            </div>

            {/* Energy Settings */}
            <div className="mb-6">
              <h3 className="text-lg text-orange-400 mb-2">Energy Settings</h3>
              <label className="block text-white mb-1">Power Usage Alert Threshold (Watts)</label>
              <input
                type="number"
                className="bg-[#393939] text-white rounded p-2 w-full"
                value={settings.powerAlert}
                onChange={e => handleChange('powerAlert', Number(e.target.value))}
                min={1}
              />
            </div>

            {/* Automation Controls */}
            <div className="mb-6">
              <h3 className="text-lg text-orange-400 mb-2">Automation Controls</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={settings.nightMode}
                    onChange={e => handleChange('nightMode', e.target.checked)}
                    className="accent-orange-400"
                  />
                  Enable Night Mode (turn off all lights at 11PM)
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={settings.awayMode}
                    onChange={e => handleChange('awayMode', e.target.checked)}
                    className="accent-orange-400"
                  />
                  Enable Away Mode (turn off all devices when idle)
                </label>
                <label className="flex items-center gap-2 text-white">
                  <input
                    type="checkbox"
                    checked={settings.aiSuggestions}
                    onChange={e => handleChange('aiSuggestions', e.target.checked)}
                    className="accent-orange-400"
                  />
                  Enable AI Suggestions
                </label>
              </div>
            </div>

            {/* System Settings */}
            <div className="mb-6">
              <h3 className="text-lg text-orange-400 mb-2">System Settings</h3>
              <label className="block text-white mb-1">Refresh Interval (seconds)</label>
              <input
                type="number"
                className="bg-[#393939] text-white rounded p-2 w-full mb-2"
                value={settings.refreshInterval}
                onChange={e => handleChange('refreshInterval', Number(e.target.value))}
                min={1}
              />
              <button
                onClick={handleDiagnostics}
                className="bg-orange-400 text-white rounded px-4 py-2 mt-2 hover:bg-orange-500 transition"
                type="button"
              >
                Run Diagnostics
              </button>
            </div>

            {/* Danger Zone */}
            <div className="mb-2">
              <h3 className="text-lg text-orange-400 mb-2">Danger Zone</h3>
              <button
                onClick={onClearDevices}
                className="bg-red-500 text-white rounded px-4 py-2 mb-2 w-full hover:bg-red-600 transition"
                type="button"
              >
                Clear All Devices
              </button>
              <button
                onClick={handleReset}
                className="bg-[#393939] text-orange-400 border border-orange-400 rounded px-4 py-2 w-full hover:bg-orange-400 hover:text-white transition"
                type="button"
              >
                Reset All Settings
              </button>
            </div>

            {/* Diagnostics Modal */}
            <AnimatePresence>
              {showDiagnostics && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-[#232323] rounded-xl p-8 w-full max-w-xs text-center"
                  >
                    <h4 className="text-orange-400 text-lg font-bold mb-4">Diagnostics</h4>
                    {diagnostics ? (
                      <div className="space-y-2">
                        <div className="text-white">Wi-Fi: <span className="text-green-400">{diagnostics.wifi}</span></div>
                        <div className="text-white">Battery: <span className="text-green-400">{diagnostics.battery}</span></div>
                        <div className="text-white">Firmware: <span className="text-yellow-400">{diagnostics.firmware}</span></div>
                      </div>
                    ) : (
                      <div className="text-white">Running diagnostics...</div>
                    )}
                    <button
                      onClick={() => setShowDiagnostics(false)}
                      className="mt-6 bg-orange-400 text-white rounded px-4 py-2 hover:bg-orange-500 transition"
                    >
                      Close
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsPanel; 