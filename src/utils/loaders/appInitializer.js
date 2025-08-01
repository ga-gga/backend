const connectDB = require('../../config/database');
const koreanAddressLoader = require('./KoreanAddressLoader');
const apiParameterLoader = require('./ApiParameterLoader');
const DataScheduler = require('../../scheduler/DataScheduler');

const initializeDatabase = async () => {
  try {
    console.log('[DB] Connecting to database...');
    await connectDB();
    console.log('[DB] Database connection established\n');
  } catch (error) {
    console.error(`[DB] Database connection failed: ${error.message}`);
    throw error;
  }
};

const initializeStaticData = async () => {
  try {
    console.log('[DATA] Loading static data...');
    await koreanAddressLoader.loadStart();
    await apiParameterLoader.loadStart();
    console.log('[DATA] Static data loading completed\n');
  } catch (error) {
    console.error(`[DATA] Static data loading failed: ${error.message}`);
    throw error;
  }
};

const initializeScheduler = () => {
  if (process.env.NODE_ENV === 'local') {
    console.log('[SCHEDULER] Scheduler disabled in local environment\n');
    return;
  }

  try {
    console.log('[SCHEDULER] Starting Data Scheduler...');
    const scheduler = new DataScheduler();
    scheduler.start();
    console.log('[SCHEDULER] Data Scheduler started\n');
  } catch (error) {
    console.error(`[SCHEDULER] Scheduler failed: ${error.message}`);
  }
};

module.exports = { initializeDatabase, initializeStaticData, initializeScheduler };
