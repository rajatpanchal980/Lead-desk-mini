const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const leadRoutes = require('./routes/leadRoutes.js');
const errorHandler = require('./middleware/errorMiddleware.js');

dotenv.config();
dotenv.config({ path: '.env.admin' });

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Lead Desk Mini API is running',
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

startServer();
