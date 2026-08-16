const express = require('express');
const Server = require('../models/Server');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get console logs
router.get('/:serverId', verifyToken, async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({
      serverId: server._id,
      console: server.console.slice(-100) // Last 100 lines
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send command
router.post('/:serverId/command', verifyToken, async (req, res) => {
  try {
    const { command } = req.body;
    const server = await Server.findById(req.params.serverId);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    server.console.push({
      timestamp: new Date(),
      message: `> ${command}`,
      type: 'command'
    });

    if (server.console.length > 1000) {
      server.console = server.console.slice(-1000);
    }

    await server.save();

    res.json({ success: true, command });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
