const express = require('express');
const connectDB = require('./config/database');
const dataLoader = require('./util/dataLoader');
const AddressService = require('./services/AddressService');

const app = express();
const addressService = new AddressService();

const initializeApp = async () => {
  try {
    await connectDB();
    await dataLoader.loadAllStaticData();
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
      stats: '/address/stats',
      districts: '/address/gus',
      neighborhoods: '/address/dongs/:guCode',
      addressInfo: '/address/info/:code',
      health: '/health',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/address/stats', async (req, res) => {
  try {
    const stats = await addressService.getStatistics();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting address statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve address statistics',
    });
  }
});

app.get('/address/gus', async (req, res) => {
  try {
    const gus = await addressService.getGus();
    res.json({
      success: true,
      data: gus,
      count: gus.length,
    });
  } catch (error) {
    console.error('Error getting gus:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve district information',
    });
  }
});

// Simple parameter route without regex
app.get('/address/dongs/:guCode', async (req, res) => {
  try {
    const { guCode } = req.params;

    // Validate guCode format
    if (!guCode || !/^\d{10}$/.test(guCode)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid gu code format. Must be 10 digits',
      });
    }

    const dongs = await addressService.getDongs(guCode);
    res.json({
      success: true,
      data: dongs,
      count: dongs.length,
    });
  } catch (error) {
    console.error('Error getting dongs:', error);
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

// Simple parameter route without regex
app.get('/address/info/:code', async (req, res) => {
  try {
    const { code } = req.params;

    // Validate code format
    if (!code || !/^\d{10}$/.test(code)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid code format. Must be 10 digits',
      });
    }

    const addressInfo = await addressService.getAddressByCode(code);
    res.json({
      success: true,
      data: addressInfo,
    });
  } catch (error) {
    console.error('Error getting address info:', error);
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

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
