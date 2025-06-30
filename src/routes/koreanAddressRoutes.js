const express = require('express');
const KoreanAddressController = require('../controllers/KoreanAddressController');

const router = express.Router();
const koreanAddressController = new KoreanAddressController();

router.get('/', (req, res, next) => {
  koreanAddressController.getGroupedAddresses(req, res, next);
});

router.get('/exists', (req, res, next) => {
  koreanAddressController.checkInitialization(req, res, next);
});

module.exports = router;
