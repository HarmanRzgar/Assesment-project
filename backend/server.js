const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();

// Import routes
const pdfRoutes = require('./routes/pdfRoutes');
const searchRoutes = require('./routes/searchRoutes');

// Import middleware
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Create uploads directory if it doesn't exist
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',        
    'http://localhost:5173',          
    'https://assesment-project-dgm6.vercel.app/' 
  ],
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from uploads directory with basic validation
app.use("/uploads", (req, res, next) => {
  if (req.path.endsWith(".pdf")) {
    res.set("Content-Type", "application/pdf");
  }
  next();
}, express.static(path.join(__dirname, "uploads")));

// API routes
app.use('/api', pdfRoutes);
app.use('/api', searchRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});