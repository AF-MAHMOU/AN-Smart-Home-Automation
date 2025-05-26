import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AddDevice = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [connectionType, setConnectionType] = useState('Wi-Fi');
  const [showPairing, setShowPairing] = useState(false);
  const [pairingStatus, setPairingStatus] = useState('connecting');
  const [brand, setBrand] = useState('');
  const [room, setRoom] = useState('');
  const [rooms, setRooms] = useState([]);

  const brandOptions = {
    TV: ['LG', 'Samsung', 'Sony', 'Toshiba', 'Panasonic'],
    Light: ['Philips', 'GE', 'Osram', 'Syska', 'Wipro'],
    Purifier: ['Dyson', 'Philips', 'Honeywell', 'Blueair'],
    Fan: ['Union', 'Panasonic', 'Usha', 'Orient', 'Havells'],
    AC: ['LG', 'Samsung', 'Daikin', 'Carrier', 'Voltas']
  };

  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem('smarthome_rooms')) || ['Bedroom', 'Kitchen', 'Living Room', 'Office'];
    setRooms(savedRooms);
    const settings = JSON.parse(localStorage.getItem('smarthome_settings'));
    setRoom(settings?.defaultRoom || savedRooms[0]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowPairing(true);
    setPairingStatus('connecting');
    setTimeout(async () => {
      setPairingStatus('success');
      setTimeout(async () => {
        try {
          await axios.post('http://localhost:5000/api/devices', { name, type, userId: user._id, connectionType, brand, room });
          navigate('/dashboard');
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to add device');
          setShowPairing(false);
        }
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#232323] flex flex-col items-center justify-center p-4">
      <h2 className="text-white text-2xl font-bold mb-6">Add New Device</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-white mb-2">Device Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 bg-[#393939] text-white rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Device Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-2 bg-[#393939] text-white rounded"
            required
          >
            <option value="">Select Type</option>
            <option value="TV">TV</option>
            <option value="Light">Light</option>
            <option value="Purifier">Purifier</option>
            <option value="Fan">Fan</option>
            <option value="AC">AC</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Connect via</label>
          <select
            value={connectionType}
            onChange={e => setConnectionType(e.target.value)}
            className="w-full p-2 bg-[#393939] text-white rounded"
            required
          >
            <option value="Wi-Fi">Wi-Fi</option>
            <option value="Bluetooth">Bluetooth</option>
            <option value="Zigbee">Zigbee</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Company / Brand</label>
          <select
            value={brand}
            onChange={e => setBrand(e.target.value)}
            className="w-full p-2 bg-[#393939] text-white rounded"
            required
            disabled={!type}
          >
            <option value="">{type ? 'Select Brand' : 'Select Device Type First'}</option>
            {type && brandOptions[type]?.map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Room</label>
          <select
            value={room}
            onChange={e => setRoom(e.target.value)}
            className="w-full p-2 bg-[#393939] text-white rounded"
            required
          >
            {rooms.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full p-2 bg-orange-400 text-white rounded">Add Device</button>
        <button onClick={() => navigate('/dashboard')} className="w-full p-2 bg-gray-500 text-white rounded mt-4">
          Cancel
        </button>
      </form>
      {showPairing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
          <div className="bg-[#232323] rounded-lg p-8 flex flex-col items-center">
            {pairingStatus === 'connecting' ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mb-4"></div>
                <p className="text-white text-lg mb-2">🔌 Connecting to device via {connectionType}…</p>
              </>
            ) : (
              <>
                <p className="text-green-400 text-2xl mb-2">✅ Device paired successfully!</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDevice; 