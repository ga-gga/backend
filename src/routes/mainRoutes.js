const express = require('express');
const MainController = require('../controllers/MainController');

const router = express.Router();
const mainController = new MainController();

router.get('/', (req, res, next) => {
  mainController.getMainData(req, res, next);
});

module.exports = router;
