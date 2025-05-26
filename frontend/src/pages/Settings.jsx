import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

function loadNetwork() {
  try {
    return JSON.parse(localStorage.getItem('smarthome_network')) || null;
  } catch {
    return null;
  }
}

function loadNetworkHistory() {
  try {
    return JSON.parse(localStorage.getItem('smarthome_network_history')) || [];
  } catch {
    return [];
  }
}

function saveNetworkHistory(history) {
  localStorage.setItem('smarthome_network_history', JSON.stringify(history));
}

const Settings = () => {
  const [settings, setSettings] = useState(loadSettings());
  const [rooms, setRooms] = useState(loadRooms());
  const [newRoom, setNewRoom] = useState('');
  const [networkType, setNetworkType] = useState('Wi-Fi');
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [networkStatus, setNetworkStatus] = useState('idle');
  const [showConfirm, setShowConfirm] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [currentNetwork, setCurrentNetwork] = useState(loadNetwork());
  const [networkHistory, setNetworkHistory] = useState(loadNetworkHistory());

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

  const handleAddRoom = () => {
    if (newRoom && !rooms.includes(newRoom)) {
      setRooms([...rooms, newRoom]);
      setNewRoom('');
    }
  };

  const handleRemoveRoom = (room) => {
    setRoomToDelete(room);
    setShowConfirm(true);
  };

  const confirmRemoveRoom = () => {
    setRooms(rooms.filter(r => r !== roomToDelete));
    setShowConfirm(false);
    setRoomToDelete(null);
    // If the deleted room was the default, reset defaultRoom
    if (settings.defaultRoom === roomToDelete) {
      handleChange('defaultRoom', rooms.filter(r => r !== roomToDelete)[0] || 'Living Room');
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
      const newNetwork = { type: networkType, name: selectedNetwork };
      setCurrentNetwork(newNetwork);
      localStorage.setItem('smarthome_network', JSON.stringify(newNetwork));
      // Add to history if not already present
      const exists = networkHistory.some(n => n.type === newNetwork.type && n.name === newNetwork.name);
      const updatedHistory = exists ? networkHistory : [newNetwork, ...networkHistory];
      setNetworkHistory(updatedHistory);
      saveNetworkHistory(updatedHistory);
    }, 1500);
  };

  const handleDisconnectNetwork = () => {
    setCurrentNetwork(null);
    localStorage.removeItem('smarthome_network');
    setNetworkStatus('idle');
    setSelectedNetwork('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="min-h-screen bg-[#232323] p-6 flex flex-col items-center"
    >
      <div className="w-full max-w-2xl bg-[#232323] rounded-xl shadow-2xl p-6">
        <h2 className="text-3xl font-bold text-orange-400 mb-6">Settings</h2>

        {/* Device Preferences */}
        <div className="mb-8">
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
            <label className="block text-white mb-1">Your Rooms</label>
            <ul className="mb-2">
              {rooms.map(room => (
                <li key={room} className="flex items-center justify-between bg-[#393939] rounded px-3 py-1 mb-1">
                  <span className="text-white">{room}</span>
                  <button
                    onClick={() => handleRemoveRoom(room)}
                    className="text-red-400 hover:text-red-600 text-xs font-bold ml-2"
                  >Remove</button>
                </li>
              ))}
            </ul>
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
          {/* Connect to Network Section */}
          <div className="mt-4">
            <label className="block text-white mb-1">Connect to Network</label>
            {currentNetwork ? (
              <div className="mb-2 p-3 bg-[#393939] rounded flex flex-col gap-2">
                <span className="text-orange-400">Currently connected: <span className="text-white">{currentNetwork.name} ({currentNetwork.type})</span></span>
                <button
                  onClick={handleDisconnectNetwork}
                  className="bg-red-500 text-white rounded px-3 py-1 w-fit hover:bg-red-600 transition text-xs"
                  type="button"
                >Disconnect</button>
              </div>
            ) : null}
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
              disabled={!!currentNetwork}
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
              disabled={!selectedNetwork || networkStatus === 'connecting' || networkStatus === 'connected' || !!currentNetwork}
            >
              {networkStatus === 'idle' && 'Connect'}
              {networkStatus === 'connecting' && 'Connecting...'}
              {networkStatus === 'connected' && 'Connected!'}
            </button>
            {networkHistory.length > 0 && (
              <div className="mt-3">
                <div className="text-orange-400 mb-1 text-xs">Previously connected networks:</div>
                <ul className="text-white text-xs space-y-1">
                  {networkHistory.map((net, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-orange-400">{net.name}</span>
                      <span className="bg-[#393939] rounded px-2 py-0.5 text-orange-400 text-xs">{net.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Energy Settings */}
        <div className="mb-8">
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
        <div className="mb-8">
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
        <div className="mb-8">
          <h3 className="text-lg text-orange-400 mb-2">System Settings</h3>
          <label className="block text-white mb-1">Refresh Interval (seconds)</label>
          <input
            type="number"
            className="bg-[#393939] text-white rounded p-2 w-full mb-2"
            value={settings.refreshInterval}
            onChange={e => handleChange('refreshInterval', Number(e.target.value))}
            min={1}
          />
        </div>

        {/* Danger Zone */}
        <div className="mb-2">
          <h3 className="text-lg text-orange-400 mb-2">Danger Zone</h3>
          <button
            onClick={() => alert('Clear All Devices not implemented in this demo')}
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
      </div>
      {/* Confirm Remove Room Modal */}
      {showConfirm && (
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
            <h4 className="text-orange-400 text-lg font-bold mb-4">Remove Room</h4>
            <p className="text-white mb-4">Are you sure you want to remove the room <span className="text-orange-400 font-bold">{roomToDelete}</span>?</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmRemoveRoom}
                className="bg-red-500 text-white rounded px-4 py-2 hover:bg-red-600 transition"
              >Remove</button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-[#393939] text-orange-400 border border-orange-400 rounded px-4 py-2 hover:bg-orange-400 hover:text-white transition"
              >Cancel</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Settings; 