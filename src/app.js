const express = require('express');
const connectDB = require('./config/database');
const koreanAddressLoader = require('./util/KoreanAddressLoader');

const errorMiddleware = require('./middleware/errorMiddleware');

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

initializeApp();

app.use(express.json());

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

app.use((req, res, next) => {
  const error = new Error('Endpoint not found');
  error.status = 404;
  next(error);
});

app.use(errorMiddleware);

module.exports = app;
