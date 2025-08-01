const express = require('express');
const ApiMetadataService = require('../services/ApiMetadataService');

const router = express.Router();
const apiMetadataService = new ApiMetadataService();

router.post('/', async (req, res, next) => {
  try {
    const apiMetadataData = req.body;
    const createdApiMetadata = await apiMetadataService.createApiMetadata(apiMetadataData);
    res.status(201).json(createdApiMetadata);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const apiMetadataList = await apiMetadataService.getAllApiMetadata();
    res.json(apiMetadataList);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
