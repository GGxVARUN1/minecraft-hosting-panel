const express = require('express');
const Server = require('../models/Server');
const User = require('../models/User');
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

// Get all servers for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const servers = await Server.find({ owner: req.userId });
    res.json(servers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single server
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json(server);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create server
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, version, ram, maxPlayers, port } = req.body;

    const server = new Server({
      name,
      owner: req.userId,
      version,
      ram,
      maxPlayers,
      port
    });

    await server.save();

    // Add server to user's servers
    await User.findByIdAndUpdate(req.userId, {
      $push: { servers: server._id }
    });

    res.status(201).json(server);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update server
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    Object.assign(server, req.body);
    await server.save();

    res.json(server);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete server
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await Server.findByIdAndDelete(req.params.id);
    await User.findByIdAndUpdate(req.userId, {
      $pull: { servers: req.params.id }
    });

    res.json({ message: 'Server deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
router.post('/:id/start', verifyToken, async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(
      req.params.id,
      { status: 'running' },
      { new: true }
    );
    res.json(server);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Stop server
router.post('/:id/stop', verifyToken, async (req, res) => {
  try {
    const server = await Server.findByIdAndUpdate(
      req.params.id,
      { status: 'stopped' },
      { new: true }
    );
    res.json(server);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restart server
router.post('/:id/restart', verifyToken, async (req, res) => {
  try {
    const server = await Server.findById(req.params.id);
    server.status = 'stopped';
    await server.save();
    server.status = 'running';
    await server.save();
    res.json(server);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
