const connectDB = require('../config/database');
const koreanAddressLoader = require('./KoreanAddressLoader');

const initializeDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connection established');
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    throw error;
  }
};

const initializeStaticData = async () => {
  try {
    console.log('Loading static data...');
    await koreanAddressLoader.loadStart();
    console.log('Static data loading completed');
  } catch (error) {
    console.error(`Static data loading failed: ${error.message}`);
    throw error;
  }
};

module.exports = { initializeDatabase, initializeStaticData };
