import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Strip Netlify Functions path prefix if routed through Netlify redirect
app.use((req, res, next) => {
    if (req.url.startsWith('/.netlify/functions/server')) {
        req.url = req.url.replace('/.netlify/functions/server', '');
    }
    next();
});

app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/hospitals', hospitalRoutes);

// Connect to MongoDB
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aidoctor', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("MongoDB Connection Error:", err));
}

app.get('/', (req, res) => {
  res.send('AI Doctor Backend is running...');
});

export default app;
