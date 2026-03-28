import express from 'express';
import User from '../models/User.js';
import { protect, generateToken } from '../middleware/auth.js';
import validator from 'validator';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Create user
    const user = new User({ email: email.toLowerCase(), password, name });
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000)
      return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login (auto-create user if not exists)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password' });

    let user = await User.findOne({ email: email.toLowerCase() });

    // If user doesn't exist, create new user
    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        password,
        name: email.split('@')[0] // Use part before @ as name
      });
      await user.save();

      const token = generateToken(user._id);
      return res.status(201).json({
        message: 'User created and logged in successfully',
        token,
        user: { id: user._id, email: user.email, name: user.name }
      });
    }

    // If user exists, verify password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user', error: error.message });
  }
});

export default router;
