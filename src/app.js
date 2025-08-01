const express = require('express');
const errorMiddleware = require('./middleware/errorMiddleware');
const koreanAddressRoutes = require('./routes/koreanAddressRoutes');
const apiMetadataRoutes = require('./routes/apiMetadataRoutes');
const mainRoutes = require('./routes/mainRoutes');
const contentFilterRoutes = require('./routes/contentFilterRoutes');
const utilRoutes = require('./routes/utilRoutes');
const { initializeDatabase, initializeStaticData, initializeScheduler } = require('./utils/loaders/appInitializer');

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
  app.use('/api-metadata', apiMetadataRoutes);
  app.use('/main', mainRoutes);
  app.use('/content-filters', contentFilterRoutes);
  app.use('/utils', utilRoutes);

  app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    error.status = 404;
    res.status(error.status).json({ error: error.message });
  });

  app.use(errorMiddleware);

  return app;
};

const startApplication = async () => {
  try {
    await initializeDatabase();
    await initializeStaticData();
    initializeScheduler();
    return createApp();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = { createApp, startApplication };
