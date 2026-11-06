const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';

// 1. CORS SETUP (Configured origin, HTTP methods, and credentials)
const corsOptions = {
  origin: 'http://localhost:5173', // Allowed React Vite origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// 2. AUTHENTICATION ROUTE (Login -> Generate JWT Token)
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;

  // Mock credential verification
  if (email === 'dev@example.com' && password === 'password123') {
    const user = { id: 101, name: 'Alex Rivera', email, role: 'developer' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Invalid email or password credentials'
  });
});

// 3. AUTHENTICATION MIDDLEWARE
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Token format: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided in headers.'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired token.'
      });
    }
    req.user = decodedUser;
    next();
  });
};

// 4. PROTECTED API ENDPOINT
app.get('/api/v1/dashboard/metrics', authenticateToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Protected dashboard data retrieved successfully',
    user: req.user,
    data: {
      activeProjects: 4,
      tasksCompleted: 28,
      pendingCodeReviews: 3,
      serverStatus: 'Healthy'
    }
  });
});

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
