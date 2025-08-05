require('dotenv').config();

const { startApplication } = require('./src/app');
const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    const app = await startApplication();
    app.listen(PORT, () => {
      console.log(`[SERVER] Server port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

start();
