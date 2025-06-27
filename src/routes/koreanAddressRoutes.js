const express = require('express');
const KoreanAddressService = require('../services/KoreanAddressService');

const router = express.Router();
const koreanAddressService = new KoreanAddressService();

router.get('/', async (req, res) => {
  try {
    const groupedAddresses = await koreanAddressService.getGroupedAddresses();
    res.json(groupedAddresses);
  } catch (error) {
    console.error('Error retrieving grouped addresses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/exists', async (req, res) => {
  try {
    const isInitialized = await koreanAddressService.isInitialized();
    res.json({ initialized: isInitialized });
  } catch (error) {
    console.error('Error checking initialization:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
