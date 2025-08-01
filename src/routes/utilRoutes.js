const express = require('express');
const EnvironmentDataGeneratorService = require('../utils/services/EnvironmentDataGeneratorService');

const router = express.Router();
const environmentDataGeneratorService = new EnvironmentDataGeneratorService();

if (process.env.NODE_ENV === 'local') {
  router.post('/environment-data', async (req, res, next) => {
    try {
      const result = await environmentDataGeneratorService.generateEnvironmentData();
      res.json(result);
    } catch (error) {
      next(error);
    }
  });
}

module.exports = router;
