const connectDB = require('../../config/database');
const koreanAddressLoader = require('./KoreanAddressLoader');
const apiParameterLoader = require('./ApiParameterLoader');
const DataScheduler = require('../../scheduler/DataScheduler');

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
    await apiParameterLoader.loadStart();
    console.log('Static data loading completed');
  } catch (error) {
    console.error(`Static data loading failed: ${error.message}`);
    throw error;
  }
};

const initializeScheduler = () => {
  try {
    console.log('Starting Data Scheduler...');
    const scheduler = new DataScheduler();
    scheduler.start();
  } catch (error) {
    console.error(`Scheduler failed: ${error.message}`);
  }
};

module.exports = { initializeDatabase, initializeStaticData, initializeScheduler };
