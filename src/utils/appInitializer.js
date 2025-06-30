const connectDB = require('../config/database');
const koreanAddressLoader = require('./KoreanAddressLoader');

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

module.exports = { initializeApp };
