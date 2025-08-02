const express = require('express');
const errorMiddleware = require('./middleware/errorMiddleware');
const koreanAddressRoutes = require('./routes/koreanAddressRoutes');
const apiMetadataRoutes = require('./routes/apiMetadataRoutes');
const mainRoutes = require('./routes/mainRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { initializeDatabase, initializeStaticData, initializeScheduler } = require('./utils/loaders/appInitializer');

const createApp = () => {
  const app = express();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'ga-gga Server API',
      version: '1.0.0',
      endpoints: {
        regions: {
          hierarchy: 'GET /regions/hierarchy',
          check: 'GET /regions/check',
        },
        main: 'GET /main',
        apiMetadata: 'GET /api-metadata',
        admin: {
          environmentData: 'POST /admin/environment-data',
          apiMetadata: 'POST /admin/api-metadata',
          contentFilters: {
            create: 'POST /admin/content-filters',
            update: 'PUT /admin/content-filters/:id',
          },
        },
      },
    });
  });

  app.use('/regions', koreanAddressRoutes);
  app.use('/api-metadata', apiMetadataRoutes);
  app.use('/main', mainRoutes);
  app.use('/admin', adminRoutes);

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
