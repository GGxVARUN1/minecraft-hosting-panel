import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Play, Square, RotateCw, Trash2, FileText } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ServerConsole() {
  const { serverId } = useParams();
  const [server, setServer] = useState(null);
  const [console, setConsole] = useState([]);
  const [command, setCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchServer();
    fetchConsole();
  }, [serverId]);

  const fetchServer = async () => {
    try {
      const response = await axios.get(`${API_URL}/servers/${serverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServer(response.data);
    } catch (error) {
      console.error('Error fetching server:', error);
    }
  };

  const fetchConsole = async () => {
    try {
      const response = await axios.get(`${API_URL}/console/${serverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConsole(response.data.console);
    } catch (error) {
      console.error('Error fetching console:', error);
    }
  };

  const sendCommand = async (e) => {
    e.preventDefault();
    if (!command.trim()) return;

    setLoading(true);
    try {
      await axios.post(`${API_URL}/console/${serverId}/command`, { command }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommand('');
      fetchConsole();
    } catch (error) {
      console.error('Error sending command:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServerAction = async (action) => {
    try {
      await axios.post(`${API_URL}/servers/${serverId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServer();
    } catch (error) {
      console.error(`Error ${action} server:`, error);
    }
  };

  if (!server) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">{server.name}</h1>
        
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleServerAction('start')}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Play size={18} /> Start
          </button>
          <button
            onClick={() => handleServerAction('stop')}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Square size={18} /> Stop
          </button>
          <button
            onClick={() => handleServerAction('restart')}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition"
          >
            <RotateCw size={18} /> Restart
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Status</p>
            <p className="text-xl font-bold capitalize">
              <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                server.status === 'running' ? 'bg-green-500' : 'bg-gray-400'
              }`}></span>
              {server.status}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">RAM</p>
            <p className="text-xl font-bold">{server.ram}MB</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Players</p>
            <p className="text-xl font-bold">{server.stats?.playerCount || 0}/{server.maxPlayers}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-600 text-sm">Version</p>
            <p className="text-xl font-bold">{server.version}</p>
          </div>
        </div>
      </div>

      <div className="bg-black text-green-400 rounded-lg p-4 font-mono text-sm h-96 overflow-y-auto mb-4 border border-gray-700">
        {console.map((line, idx) => (
          <div key={idx} className={line.type === 'error' ? 'text-red-400' : ''}>
            [{new Date(line.timestamp).toLocaleTimeString()}] {line.message}
          </div>
        ))}
      </div>

      <form onSubmit={sendCommand} className="flex gap-2">
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter command..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
