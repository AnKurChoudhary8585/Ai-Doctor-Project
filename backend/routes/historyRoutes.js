import express from 'express';
import History from '../models/History.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const history = await History.find({ userId: req.params.userId }).sort({ timestamp: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;
