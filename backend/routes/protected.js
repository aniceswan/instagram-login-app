import express from 'express';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Example protected route
router.get('/dashboard', protect, (req, res) => {
  res.json({
    message: 'This is a protected route',
    userId: req.userId
  });
});

export default router;
