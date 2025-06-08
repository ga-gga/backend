const express = require('express');
const connectDB = require('./config/database');
const Test = require('./models/Test');

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'ga-gga Server API',
    version: '1.0.0',
    endpoints: {
      dbTest: '/db-test',
    },
  });
});

app.get('/db-test', async (req, res) => {
  try {
    const testData = new Test({
      message: 'MongoDB Connection Test',
      count: Math.floor(Math.random() * 100),
    });

    const savedData = await testData.save();

    const allTestData = await Test.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      message: 'Database connection test successful',
      createdData: savedData,
      recentData: allTestData,
      totalCount: await Test.countDocuments(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error.message,
    });
  }
});

module.exports = app;
