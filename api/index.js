// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const session = require("express-session");
const cors = require('cors');
require('dotenv').config(); // ⬅️ Load env variables

const app = express();

app.use(express.json());

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET, 
  resave: false,
  saveUninitialized: false,
    cookie: {
    secure: false,
    sameSite: 'lax',
  }
}));


// ✅ Connect to MongoDB using env variable
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ API Routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);

const uploadRoutes = require('./routes/uploadroutes');
app.use('/api/documents', uploadRoutes);



const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
      