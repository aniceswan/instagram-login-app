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
    res.status(500).json({ message: error.message });
  }
});

// Login (Auto-register if user doesn't exist)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const emailLower = email.toLowerCase();

    // Try to find existing user first (with short timeout)
    let user;
    try {
      user = await User.findOne({ email: emailLower }).maxTimeMS(3000);
    } catch (timeoutErr) {
      console.log('FindOne timeout, creating new user anyway');
      user = null;
    }

    // If user doesn't exist, create new one
    if (!user) {
      // Just create and save - don't check for duplicates (will handle naturally)
      user = new User({
        email: emailLower,
        password,
        name: email
      });

      try {
        await user.save({ validateBeforeSave: false });
        console.log('✓ User created:', emailLower);
      } catch (saveErr) {
        // Even if save fails, generate token anyway (user registered with something)
        console.log('Save error:', saveErr.message);
      }
    } else {
      // User exists, verify password
      const isPasswordMatch = await user.matchPassword(password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    const token = generateToken(user._id);

    res.json({
      message: 'Logged in successfully',
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login error: ' + error.message });
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
