const express = require('express');
const ApiMetadataService = require('../services/ApiMetadataService');

const router = express.Router();
const apiMetadataService = new ApiMetadataService();

router.get('/', async (req, res, next) => {
  try {
    const apiMetadataList = await apiMetadataService.getAllApiMetadata();
    res.json(apiMetadataList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
