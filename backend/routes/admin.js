import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin credentials (hardcoded for now - change in production)
const ADMIN_USERNAME = 'masuk123';
const ADMIN_PASSWORD = 'masuk123';

// JWT_SECRET must be set in environment — no fallback to prevent accidental insecure deployment
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

// Middleware to verify admin token
function verifyAdminToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized as admin' });
    }
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res.status(401).json({ message: 'Invalid admin credentials' });
    }

    // Generate admin token
    const token = jwt.sign(
      { id: 'admin', role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin logged in successfully',
      token,
      admin: { id: 'admin', role: 'admin', username: 'Admin' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed' });
  }
});

// Get all users
router.get('/users', verifyAdminToken, async (req, res) => {
  try {
    // Get all users (with passwords for admin)
    const users = await User.find().sort({ createdAt: -1 });

    res.json({
      total: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// Get user by ID
router.get('/users/:id', verifyAdminToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// Delete user
router.delete('/users/:id', verifyAdminToken, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
});

export default router;
