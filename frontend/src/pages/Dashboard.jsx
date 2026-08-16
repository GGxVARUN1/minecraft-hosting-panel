import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    version: '1.20.1',
    ram: 2048,
    maxPlayers: 20,
    port: 25565
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    fetchServers();
  }, []);

  const fetchServers = async () => {
    try {
      const response = await axios.get(`${API_URL}/servers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServers(response.data);
    } catch (error) {
      console.error('Error fetching servers:', error);
    }
  };

  const handleCreateServer = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/servers`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setFormData({
        name: '',
        version: '1.20.1',
        ram: 2048,
        maxPlayers: 20,
        port: 25565
      });
      setShowCreateModal(false);
      fetchServers();
    } catch (error) {
      console.error('Error creating server:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteServer = async (serverId) => {
    if (window.confirm('Are you sure you want to delete this server?')) {
      try {
        await axios.delete(`${API_URL}/servers/${serverId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchServers();
      } catch (error) {
        console.error('Error deleting server:', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-600">Minecraft Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">My Servers</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg transition font-bold"
          >
            <Plus size={20} /> Create Server
          </button>
        </div>

        {/* Servers Grid */}
        {servers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">No servers yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition"
            >
              Create Your First Server
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <div key={server._id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{server.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${
                    server.status === 'running' ? 'bg-green-500' : 'bg-gray-400'
                  }`}>
                    {server.status}
                  </span>
                </div>

                <div className="space-y-2 mb-6 text-gray-600 text-sm">
                  <p><strong>Version:</strong> {server.version}</p>
                  <p><strong>RAM:</strong> {server.ram}MB</p>
                  <p><strong>Max Players:</strong> {server.maxPlayers}</p>
                  <p><strong>Port:</strong> {server.port}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/console/${server._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Eye size={18} /> Manage
                  </button>
                  <button
                    onClick={() => handleDeleteServer(server._id)}
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Server Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Create New Server</h2>

            <form onSubmit={handleCreateServer}>
              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Server Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 font-bold mb-2">Version</label>
                <select
                  value={formData.version}
                  onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option>1.20.1</option>
                  <option>1.20</option>
                  <option>1.19.2</option>
                  <option>1.18.2</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-bold mb-2">RAM (MB)</label>
                  <input
                    type="number"
                    value={formData.ram}
                    onChange={(e) => setFormData({ ...formData, ram: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-2">Max Players</label>
                  <input
                    type="number"
                    value={formData.maxPlayers}
                    onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-bold mb-2">Port</label>
                <input
                  type="number"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Server'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
