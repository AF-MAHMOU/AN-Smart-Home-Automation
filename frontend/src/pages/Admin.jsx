import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiUsers, FiMonitor, FiActivity } from 'react-icons/fi';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import React from 'react';
import HomeButton from '../components/HomeButton';
import Navbar from '../components/Navbar';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  // Simulated recent activity log
  const activityLog = [
    { email: 'ahmed@example.com', action: 'Added device "Kitchen Light"', time: '1:03 PM' },
    { email: 'sara@example.com', action: 'Toggled "Bedroom AC"', time: '1:15 PM' },
    { email: 'admin@example.com', action: 'Viewed system stats', time: '1:20 PM' },
    { email: 'ahmed@example.com', action: 'Deleted device "Old Fan"', time: '1:25 PM' },
    { email: 'sara@example.com', action: 'Added device "Living Room TV"', time: '1:30 PM' },
  ];

  // Simulated diagnostics
  const defaultDiagnostics = {
    cloud: '✅ Connected',
    sync: 'Normal',
    uptime: '99.9%',
  };
  const [diagnostics, setDiagnostics] = useState(defaultDiagnostics);
  const [diagLoading, setDiagLoading] = useState(false);
  const runDiagnostics = () => {
    setDiagLoading(true);
    setTimeout(() => {
      setDiagnostics({
        cloud: '✅ Connected',
        sync: 'Normal',
        uptime: '99.9%',
      });
      setDiagLoading(false);
    }, 1200);
  };

  // Simulated AI Optimization
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const runAiOptimization = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSuggestions([
        'Suggested: Reduce AC in Bedroom to 24°C',
        'Suggested: Turn off Living Room Light after 10PM',
        'Suggested: Enable Away Mode for unused rooms',
      ]);
      setAiLoading(false);
    }, 1200);
  };

  // Users Table helpers
  const usersWithDeviceCount = useMemo(() => users.map(u => ({
    ...u,
    deviceCount: devices.filter(d => d.userId === u._id).length,
    lastLogin: u.lastLogin || 'Today', // Simulated
    deactivated: u.deactivated || false,
  })), [users, devices]);
  const toggleUserActive = (userId) => {
    setUsers(users => users.map(u => u._id === userId ? { ...u, deactivated: !u.deactivated } : u));
  };

  // Device Table helpers
  const toggleDeviceStatus = async (deviceId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/devices/${deviceId}`);
      setDevices(devices => devices.map(d => d._id === deviceId ? res.data : d));
    } catch {}
  };
  const deleteDevice = async (deviceId) => {
    try {
      await axios.delete(`http://localhost:5000/api/devices/${deviceId}`);
      setDevices(devices => devices.filter(d => d._id !== deviceId));
    } catch {}
  };

  // New state for AI suggestion inputs
  const [aiSuggestionInputs, setAiSuggestionInputs] = useState({});
  const [deviceAiSuggestions, setDeviceAiSuggestions] = useState({});

  // Generate activity log based on real users/devices
  const generatedActivityLog = useMemo(() => {
    if (!users.length || !devices.length) return [];
    const logs = [];
    users.forEach(user => {
      const userDevices = devices.filter(d => d.userId === user._id);
      if (userDevices.length) {
        logs.push({ email: user.email, action: `Added device "${userDevices[0].name}"`, time: '1:03 PM' });
        logs.push({ email: user.email, action: `Toggled "${userDevices[0].name}"`, time: '1:15 PM' });
      }
    });
    logs.push({ email: 'admin@example.com', action: 'Viewed system stats', time: '1:20 PM' });
    return logs;
  }, [users, devices]);

  // Users Table: expand to show devices
  const [expandedUser, setExpandedUser] = useState(null);

  // Add new state for device type suggestions
  const [deviceTypeSuggestions, setDeviceTypeSuggestions] = useState({
    TV: [],
    Light: [],
    Fan: [],
    AC: [],
    Purifier: [],
    Lock: [],
    Camera: []
  });
  const [newSuggestion, setNewSuggestion] = useState('');
  const [selectedDeviceType, setSelectedDeviceType] = useState('TV');

  // Add function to handle adding new suggestions
  const addDeviceTypeSuggestion = () => {
    if (!newSuggestion.trim()) return;
    
    setDeviceTypeSuggestions(prev => ({
      ...prev,
      [selectedDeviceType]: [...prev[selectedDeviceType], newSuggestion.trim()]
    }));
    setNewSuggestion('');
  };

  // Add function to remove suggestions
  const removeDeviceTypeSuggestion = (type, index) => {
    setDeviceTypeSuggestions(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes, devicesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/stats'),
          axios.get('http://localhost:5000/api/admin/users'),
          axios.get('http://localhost:5000/api/admin/devices')
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
        setDevices(devicesRes.data);
      } catch (err) {
        setError('Failed to fetch admin data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/logs');
        setLogs(res.data);
      } catch {
        setLogs([]); // fallback to empty
      }
    };
    fetchLogs();
  }, []);

  const typeLabels = ['TV', 'Light', 'Fan', 'AC', 'Purifier', 'Lock', 'Camera'];
  const typeCounts = typeLabels.map(type => devices.filter(d => d.type === type).length);
  const deviceTypeData = {
    labels: typeLabels,
    datasets: [{
      data: typeCounts,
      backgroundColor: [
        '#ff914d',
        '#ffb347',
        '#ffc87c',
        '#ffd8a8',
        '#ffe4c4',
        '#fff0e0',
        '#fff8f0'
      ]
    }]
  };

  const userRoleData = {
    labels: ['Homeowners', 'Admins'],
    datasets: [{
      label: 'Users by Role',
      data: [
        users.filter(u => u.role === 'homeowner').length,
        users.filter(u => u.role === 'admin').length
      ],
      backgroundColor: ['#ff914d', '#ffb347']
    }]
  };

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#232323] p-4">
        <HomeButton />
        <h1 className="text-2xl font-bold text-white mb-6">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#393939] rounded-lg p-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-400 rounded-full p-3">
                <FiUsers className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Total Users</h3>
                <p className="text-orange-400 text-2xl">{stats?.userCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#393939] rounded-lg p-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-400 rounded-full p-3">
                <FiMonitor className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Total Devices</h3>
                <p className="text-orange-400 text-2xl">{stats?.deviceCount}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#393939] rounded-lg p-6"
          >
            <div className="flex items-center gap-4">
              <div className="bg-orange-400 rounded-full p-3">
                <FiActivity className="text-2xl text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg font-semibold">Active Devices</h3>
                <p className="text-orange-400 text-2xl">{stats?.activeDevices}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#393939] rounded-lg p-6"
          >
            <h3 className="text-white text-lg font-semibold mb-4">Device Types Distribution</h3>
            <div className="h-64">
              {typeCounts.some(count => count > 0) ? (
                <Pie data={deviceTypeData} options={{ maintainAspectRatio: false }} />
              ) : (
                <div className="text-gray-400 text-center mt-20">No device data</div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#393939] rounded-lg p-6"
          >
            <h3 className="text-white text-lg font-semibold mb-4">Users by Role</h3>
            <div className="h-64">
              <Bar 
                data={userRoleData} 
                options={{ 
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: '#fff' }
                    },
                    x: {
                      ticks: { color: '#fff' }
                    }
                  }
                }} 
              />
            </div>
          </motion.div>
        </div>

        {/* Recent Activity Log */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#393939] rounded-lg p-6 mb-8">
          <h3 className="text-lg text-orange-400 mb-4">Recent Activity</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white text-sm">
              <thead>
                <tr className="text-orange-400">
                  <th className="py-2 px-2">User</th>
                  <th className="py-2 px-2">Action</th>
                  <th className="py-2 px-2">Device</th>
                  <th className="py-2 px-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? logs.map((log, idx) => (
                  <tr key={log._id || idx} className="border-b border-[#232323]">
                    <td className="py-2 px-2">{log.userId?.email || 'N/A'}</td>
                    <td className="py-2 px-2">{log.action}</td>
                    <td className="py-2 px-2">{log.deviceId ? `${log.deviceId.name} (${log.deviceId.type})` : '-'}</td>
                    <td className="py-2 px-2">{new Date(log.timestamp).toLocaleString()}</td>
                  </tr>
                )) : generatedActivityLog.map((log, idx) => (
                  <tr key={idx} className="border-b border-[#232323]">
                    <td className="py-2 px-2">{log.email}</td>
                    <td className="py-2 px-2">{log.action}</td>
                    <td className="py-2 px-2">-</td>
                    <td className="py-2 px-2">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Users Table with expandable rows */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#393939] rounded-lg p-6 mb-8">
          <h3 className="text-lg text-orange-400 mb-4">Users</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white text-sm">
              <thead>
                <tr className="text-orange-400">
                  <th className="py-2 px-2"></th>
                  <th className="py-2 px-2">Email</th>
                  <th className="py-2 px-2">Role</th>
                  <th className="py-2 px-2">Devices</th>
                  <th className="py-2 px-2">Last Login</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {usersWithDeviceCount.map(user => (
                  <React.Fragment key={user._id}>
                    <tr className="border-b border-[#232323]">
                      <td className="py-2 px-2">
                        <button onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)} className="text-orange-400 font-bold text-lg">{expandedUser === user._id ? '-' : '+'}</button>
                      </td>
                      <td className="py-2 px-2">{user.email}</td>
                      <td className="py-2 px-2 capitalize">{user.role}</td>
                      <td className="py-2 px-2">{user.deviceCount}</td>
                      <td className="py-2 px-2">{user.lastLogin}</td>
                      <td className="py-2 px-2">{user.deactivated ? <span className="text-red-400">Deactivated</span> : <span className="text-green-400">Active</span>}</td>
                      <td className="py-2 px-2">
                        <button
                          onClick={() => toggleUserActive(user._id)}
                          className={`px-3 py-1 rounded ${user.deactivated ? 'bg-green-400 text-white' : 'bg-red-400 text-white'} transition`}
                        >
                          {user.deactivated ? 'Activate' : 'Deactivate'}
                        </button>
                      </td>
                    </tr>
                    {expandedUser === user._id && (
                      <tr className="bg-[#232323]">
                        <td colSpan={7} className="py-2 px-2">
                          <div className="pl-8">
                            <div className="text-orange-400 mb-2">Devices:</div>
                            <ul className="list-disc pl-6">
                              {devices.filter(d => (d.userId?._id || d.userId?.toString?.() || d.userId) === user._id).map(d => (
                                <li key={d._id} className="text-white">{d.name} <span className="text-xs text-gray-400">({d.type})</span></li>
                              ))}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Device Inventory Table with AI Suggestion input */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#393939] rounded-lg p-6 mb-8">
          <h3 className="text-lg text-orange-400 mb-4">Device Inventory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-white text-sm">
              <thead>
                <tr className="text-orange-400">
                  <th className="py-2 px-2">Name</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Status</th>
                  <th className="py-2 px-2">Owner</th>
                  <th className="py-2 px-2">AI Suggestion</th>
                  <th className="py-2 px-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {devices.map(device => (
                  <tr key={device._id} className="border-b border-[#232323]">
                    <td className="py-2 px-2">{device.name}</td>
                    <td className="py-2 px-2">{device.type}</td>
                    <td className="py-2 px-2">{device.status}</td>
                    <td className="py-2 px-2">{users.find(u => u._id === device.userId)?.email || 'N/A'}</td>
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={aiSuggestionInputs[device._id] || deviceAiSuggestions[device._id] || ''}
                        onChange={e => setAiSuggestionInputs(inputs => ({ ...inputs, [device._id]: e.target.value }))}
                        className="bg-[#232323] border border-[#393939] text-white rounded px-2 py-1 w-40"
                        placeholder="Add suggestion..."
                      />
                      <button
                        onClick={() => setDeviceAiSuggestions(sugs => ({ ...sugs, [device._id]: aiSuggestionInputs[device._id] }))}
                        className="ml-2 px-2 py-1 rounded bg-orange-400 text-white text-xs"
                      >Save</button>
                    </td>
                    <td className="py-2 px-2 flex gap-2">
                      <button
                        onClick={() => toggleDeviceStatus(device._id)}
                        className="px-3 py-1 rounded bg-orange-400 text-white transition"
                      >
                        Toggle
                      </button>
                      <button
                        onClick={() => deleteDevice(device._id)}
                        className="px-3 py-1 rounded bg-red-500 text-white transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* System Diagnostics Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#393939] rounded-lg p-6 mb-8">
          <h3 className="text-lg text-orange-400 mb-4">System Diagnostics</h3>
          <div className="flex flex-col gap-2 text-white mb-4">
            <div>Cloud Connection: <span className="text-green-400">{diagnostics.cloud}</span></div>
            <div>Device Sync Rate: <span className="text-orange-400">{diagnostics.sync}</span></div>
            <div>Overall Uptime: <span className="text-orange-400">{diagnostics.uptime}</span></div>
          </div>
          <button
            onClick={runDiagnostics}
            className="bg-orange-400 text-white rounded px-4 py-2 hover:bg-orange-500 transition w-fit"
            disabled={diagLoading}
          >
            {diagLoading ? 'Running...' : 'Run Diagnostics'}
          </button>
        </motion.div>

        {/* Manual AI Optimization */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#393939] rounded-lg p-6 mb-8">
          <h3 className="text-lg text-orange-400 mb-4">Manual AI Optimization</h3>
          <button
            onClick={runAiOptimization}
            className="bg-orange-400 text-white rounded px-4 py-2 hover:bg-orange-500 transition w-fit mb-4"
            disabled={aiLoading}
          >
            {aiLoading ? 'Running...' : 'Run AI Optimization'}
          </button>
          <ul className="text-white text-sm list-disc pl-6">
            {aiSuggestions.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </motion.div>

        {/* Global AI Suggestions Management */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-[#393939] rounded-lg p-6 mb-8">
          <h3 className="text-lg text-orange-400 mb-4">Global AI Suggestions</h3>
          
          {/* Device Type Selection */}
          <div className="mb-4">
            <label className="text-white mr-2">Device Type:</label>
            <select 
              value={selectedDeviceType}
              onChange={(e) => setSelectedDeviceType(e.target.value)}
              className="bg-[#232323] text-white border border-[#393939] rounded px-3 py-1"
            >
              {Object.keys(deviceTypeSuggestions).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Add New Suggestion */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              placeholder="Enter new suggestion..."
              className="flex-1 bg-[#232323] border border-[#393939] text-white rounded px-3 py-1"
            />
            <button
              onClick={addDeviceTypeSuggestion}
              className="bg-orange-400 text-white rounded px-4 py-1 hover:bg-orange-500 transition"
            >
              Add
            </button>
          </div>

          {/* Current Suggestions List */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold">Current Suggestions for {selectedDeviceType}:</h4>
            {deviceTypeSuggestions[selectedDeviceType].length > 0 ? (
              <ul className="space-y-2">
                {deviceTypeSuggestions[selectedDeviceType].map((suggestion, index) => (
                  <li key={index} className="flex items-center justify-between bg-[#232323] p-2 rounded">
                    <span className="text-white">{suggestion}</span>
                    <button
                      onClick={() => removeDeviceTypeSuggestion(selectedDeviceType, index)}
                      className="text-red-400 hover:text-red-300 transition"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No suggestions added yet.</p>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Admin; 