const express = require('express');
const KoreanAddressService = require('../services/KoreanAddressService');

const router = express.Router();
const koreanAddressService = new KoreanAddressService();

router.get('/levels', async (req, res, next) => {
  try {
    const groupedAddresses = await koreanAddressService.getGroupedAddresses();
    res.json(groupedAddresses);
  } catch (error) {
    next(error);
  }
});

router.get('/check', async (req, res, next) => {
  try {
    const isInitialized = await koreanAddressService.isInitialized();
    res.json({ initialized: isInitialized });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
