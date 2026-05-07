import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_client_id');

router.post('/google', async (req, res) => {
  try {
    const { token, mockProfile } = req.body;
    
    // Fallback for prototype testing without a real Google Client ID
    if (mockProfile) {
       let user = await User.findOne({ email: mockProfile.email });
       if (!user) {
          user = await User.create({ 
            googleId: "mock_" + Date.now(), 
            name: mockProfile.name, 
            email: mockProfile.email,
            avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
          });
       }
       return res.json({ user });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture
      });
    }

    res.json({ user });
  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

export default router;
