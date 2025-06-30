const express = require('express');
const connectDB = require('./config/database');
const koreanAddressLoader = require('./util/KoreanAddressLoader');

const koreanAddressRoutes = require('./routes/koreanAddressRoutes');

const app = express();

const initializeApp = async () => {
  try {
    await connectDB();
    await koreanAddressLoader.loadStart();
    console.log('Application initialized successfully');
  } catch (error) {
    console.error(`Failed to initialize application: ${error.message}`);
    process.exit(1);
  }
};

// Initialize application
initializeApp();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'ga-gga Server API',
    version: '1.0.0',
    endpoints: {
      CheckAddressData: '/regions/exists',
      FullAddressByAdministrativeDistrict: '/regions',
    },
  });
});

app.use('/regions', koreanAddressRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

module.exports = app;
