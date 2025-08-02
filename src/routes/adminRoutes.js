const express = require('express');
const EnvironmentDataGeneratorService = require('../utils/services/EnvironmentDataGeneratorService');
const ApiMetadataService = require('../services/ApiMetadataService');
const ContentFilterService = require('../services/ContentFilterService');

const router = express.Router();
const environmentDataGeneratorService = new EnvironmentDataGeneratorService();
const apiMetadataService = new ApiMetadataService();
const contentFilterService = new ContentFilterService();

router.post('/environment-data', async (req, res, next) => {
  try {
    const result = await environmentDataGeneratorService.generateEnvironmentData();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/api-metadata', async (req, res, next) => {
  try {
    const apiMetadataData = req.body;
    const createdApiMetadata = await apiMetadataService.createApiMetadata(apiMetadataData);
    res.status(201).json(createdApiMetadata);
  } catch (error) {
    next(error);
  }
});

router.post('/content-filters', async (req, res, next) => {
  try {
    const contentFilterData = req.body;
    const createdContentFilter = await contentFilterService.createContentFilter(contentFilterData);
    res.status(201).json(createdContentFilter);
  } catch (error) {
    next(error);
  }
});

router.put('/content-filters/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updatedContentFilter = await contentFilterService.updateContentFilter(id, updateData);
    res.json(updatedContentFilter);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
