const express = require('express');
const koreanAddressRoutes = require('./routes/koreanAddressRoutes');
const apiMetadataRoutes = require('./routes/apiMetadataRoutes');
const mainRoutes = require('./routes/mainRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contentsRoutes = require('./routes/contentsRoutes');
const { initializeDatabase, initializeStaticData, initializeScheduler } = require('./utils/loaders/appInitializer');

const createApp = () => {
  const app = express();

  const apiRouter = express.Router();

  apiRouter.use('/regions', koreanAddressRoutes);
  apiRouter.use('/api-metadata', apiMetadataRoutes);
  apiRouter.use('/main', mainRoutes);
  apiRouter.use('/admin', adminRoutes);
  apiRouter.use('/contents', contentsRoutes);

  app.use('/api', apiRouter);

  app.use((req, res, next) => {
    const error = new Error('Endpoint not found');
    error.statusCode = 404;
    next(error);
  });

  app.use((err, req, res, next) => {
    console.error('Error:', err.message);

    const statusCode = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Internal server error';

    res.status(statusCode).json({
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    });
  });

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
