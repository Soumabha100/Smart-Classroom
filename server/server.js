const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // 2. Use the new routes

// A simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Hello from the backend! 👋' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
//krisanu samanta
// hello

