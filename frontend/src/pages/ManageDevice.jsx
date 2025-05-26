import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ManageDevice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState([]);
  const [editRoom, setEditRoom] = useState('');
  const [savingRoom, setSavingRoom] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/devices/${id}`);
        setDevice(res.data);
      } catch (err) {
        setError('Failed to fetch device details');
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id]);

  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem('smarthome_rooms')) || ['Bedroom', 'Kitchen', 'Living Room', 'Office'];
    setRooms(savedRooms);
  }, []);

  const handleToggleStatus = async () => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/devices/${id}`);
      setDevice(res.data);
    } catch (err) {
      setError('Failed to toggle device status');
    }
  };

  const handleRemoveDevice = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/devices/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to remove device');
    }
  };

  // Custom control handlers
  const handleSetTemperature = async (newTemp) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/devices/${id}/custom`, { temperature: newTemp });
      setDevice(res.data);
    } catch (err) {
      setError('Failed to set temperature');
    }
  };

  const handleSetSpeed = async (newSpeed) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/devices/${id}/custom`, { speed: newSpeed });
      setDevice(res.data);
    } catch (err) {
      setError('Failed to set speed');
    }
  };

  const handleSaveRoom = async () => {
    setSavingRoom(true);
    try {
      const res = await axios.patch(`http://localhost:5000/api/devices/${id}/custom`, { room: editRoom });
      setDevice(res.data);
      setEditRoom('');
    } catch (err) {
      setError('Failed to update room');
    } finally {
      setSavingRoom(false);
    }
  };

  // Helpers for fake info
  const getFakeBattery = (type) => {
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
  const getFakeLogs = () => [
    { time: '12:03 PM', action: 'Device turned ON' },
    { time: '11:45 AM', action: 'Temperature set to 24°C' },
    { time: '10:30 AM', action: 'Device turned OFF' },
  ];

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!device) return <div className="text-center text-white">Device not found</div>;

  return (
    <div className="min-h-screen bg-[#232323] flex flex-col items-center justify-center p-4">
      <h2 className="text-white text-2xl font-bold mb-6">Manage Device</h2>
      <div className="bg-[#393939] p-6 rounded-lg w-full max-w-md">
        <h3 className="text-white text-xl font-semibold mb-1">{device.name}</h3>
        <p className="text-xs text-orange-300 mb-2">{device.brand}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
          <span>📶 {device.connectionType || 'Wi-Fi'}</span>
          <span>🔋 {getFakeBattery(device.type)}</span>
          <span>📡 {getFakeSignal()}</span>
          <span>⚡ {getFakeEnergy(device.type)}</span>
          <span>🏠 {device.room}</span>
          <button onClick={() => setEditRoom(device.room)} className="text-orange-400 underline text-xs">Edit</button>
        </div>
        {editRoom && (
          <div className="mb-2 flex gap-2 items-center">
            <select
              value={editRoom}
              onChange={e => setEditRoom(e.target.value)}
              className="bg-[#393939] text-white rounded p-2"
            >
              {rooms.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <button
              onClick={handleSaveRoom}
              className="bg-orange-400 text-white rounded px-3 py-1"
              disabled={savingRoom}
            >{savingRoom ? 'Saving...' : 'Save'}</button>
            <button
              onClick={() => setEditRoom('')}
              className="text-gray-400 underline text-xs"
            >Cancel</button>
          </div>
        )}
        <p className="text-white mb-4">Status: {device.status}</p>
        <button onClick={handleToggleStatus} className="w-full p-2 bg-orange-400 text-white rounded mb-4">
          Toggle Status
        </button>
        {/* Custom Controls */}
        {device.type === 'AC' && (
          <div className="mb-4">
            <label className="block text-white mb-2">Temperature</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSetTemperature(device.temperature - 1)}
                className="bg-gray-700 text-white px-3 py-1 rounded"
                disabled={device.temperature <= 16}
              >-</button>
              <span className="text-white text-lg font-bold">{device.temperature}°C</span>
              <button
                onClick={() => handleSetTemperature(device.temperature + 1)}
                className="bg-gray-700 text-white px-3 py-1 rounded"
                disabled={device.temperature >= 30}
              >+</button>
            </div>
          </div>
        )}
        {device.type === 'Fan' && (
          <div className="mb-4">
            <label className="block text-white mb-2">Speed</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleSetSpeed(device.speed - 1)}
                className="bg-gray-700 text-white px-3 py-1 rounded"
                disabled={device.speed <= 1}
              >-</button>
              <span className="text-white text-lg font-bold">{device.speed}</span>
              <button
                onClick={() => handleSetSpeed(device.speed + 1)}
                className="bg-gray-700 text-white px-3 py-1 rounded"
                disabled={device.speed >= 5}
              >+</button>
            </div>
          </div>
        )}
        <button onClick={handleRemoveDevice} className="w-full p-2 bg-red-500 text-white rounded mt-4">
          Remove Device
        </button>
        {/* Dummy Logs/History */}
        <div className="mt-6">
          <h4 className="text-orange-400 font-semibold mb-2">Device Logs</h4>
          <div className="bg-[#232323] rounded p-3 text-xs text-gray-300">
            {getFakeLogs().map((log, idx) => (
              <div key={idx} className="mb-1 flex justify-between">
                <span>{log.action}</span>
                <span className="text-gray-500">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDevice; 