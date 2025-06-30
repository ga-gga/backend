const express = require('express');
const errorMiddleware = require('./middleware/errorMiddleware');
const koreanAddressRoutes = require('./routes/koreanAddressRoutes');
const { initializeApp } = require('./utils/appInitializer');

const createApp = () => {
  const app = express();

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

  return app;
};

const startApplication = async () => {
  try {
    await initializeApp();
    return createApp();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = { createApp, startApplication };
