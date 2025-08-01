const express = require('express');
const ContentFilterService = require('../services/ContentFilterService');

const router = express.Router();
const contentFilterService = new ContentFilterService();

router.post('/', async (req, res, next) => {
  try {
    const contentFilterData = req.body;
    const createdContentFilter = await contentFilterService.createContentFilter(contentFilterData);
    res.status(201).json(createdContentFilter);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
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
