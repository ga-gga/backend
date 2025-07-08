const express = require('express');
const KoreanAddressController = require('../controllers/KoreanAddressController');

const router = express.Router();
const koreanAddressController = new KoreanAddressController();

router.get('/levels', (req, res, next) => {
  koreanAddressController.getGroupedAddresses(req, res, next);
});

router.get('/check', (req, res, next) => {
  koreanAddressController.checkInitialization(req, res, next);
});

module.exports = router;
