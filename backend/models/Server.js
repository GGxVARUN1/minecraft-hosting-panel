const mongoose = require('mongoose');

const serverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['running', 'stopped', 'error'],
    default: 'stopped'
  },
  version: {
    type: String,
    default: '1.20.1'
  },
  ram: {
    type: Number,
    default: 2048 // MB
  },
  maxPlayers: {
    type: Number,
    default: 20
  },
  port: Number,
  motd: String,
  gameMode: {
    type: String,
    enum: ['survival', 'creative', 'adventure', 'spectator'],
    default: 'survival'
  },
  difficulty: {
    type: String,
    enum: ['peaceful', 'easy', 'normal', 'hard'],
    default: 'normal'
  },
  pvp: {
    type: Boolean,
    default: true
  },
  onlineMode: {
    type: Boolean,
    default: true
  },
  whitelistEnabled: {
    type: Boolean,
    default: false
  },
  whitelistedPlayers: [String],
  mods: [String],
  plugins: [String],
  backups: [{
    name: String,
    createdAt: Date,
    size: Number
  }],
  console: [{
    timestamp: Date,
    message: String,
    type: String // log, warning, error
  }],
  stats: {
    cpuUsage: Number,
    ramUsage: Number,
    diskUsage: Number,
    playerCount: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Server', serverSchema);
