const express = require('express');
const UtilController = require('../controllers/UtilController');

const router = express.Router();
const utilController = new UtilController();

if (process.env.NODE_ENV === 'local') {
  router.post('/environment-data', (req, res, next) => {
    utilController.generateEnvironmentData(req, res, next);
  });
}

module.exports = router;
