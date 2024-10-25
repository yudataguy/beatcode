const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB database connection established successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const questionsRouter = require('./routes/questions');
const statsRouter = require('./routes/stats');

// Use routes
app.use('/api/questions', questionsRouter);
app.use('/api/stats', statsRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
