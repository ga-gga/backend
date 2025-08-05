const express = require('express');
const MainService = require('../services/MainService');

const router = express.Router();
const mainService = new MainService();

router.get('/', async (req, res, next) => {
  try {
    const mainData = await mainService.getMainData();
    res.json(mainData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
