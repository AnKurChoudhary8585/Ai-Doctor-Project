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
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/hospitals', hospitalRoutes);

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/aidoctor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.log("MongoDB Connection Error:", err));

app.get('/', (req, res) => {
  res.send('AI Doctor Backend is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
