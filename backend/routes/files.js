const express = require('express');
const multer = require('multer');
const Server = require('../models/Server');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

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

// List files
router.get('/:serverId/list', verifyToken, async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Mock file list - replace with actual file system operations
    const files = [
      { name: 'server.properties', size: 2048, type: 'file' },
      { name: 'world', size: 0, type: 'directory' },
      { name: 'plugins', size: 0, type: 'directory' },
      { name: 'logs', size: 0, type: 'directory' }
    ];

    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload file
router.post('/:serverId/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const server = await Server.findById(req.params.serverId);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Handle file upload - implement actual file storage
    res.json({
      success: true,
      filename: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete file
router.delete('/:serverId/delete', verifyToken, async (req, res) => {
  try {
    const { filename } = req.body;
    const server = await Server.findById(req.params.serverId);
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }

    if (server.owner.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Implement actual file deletion
    res.json({ success: true, message: `File ${filename} deleted` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
