const express = require('express');
const ContentsService = require('../services/ContentsService');

const router = express.Router();
const contentsService = new ContentsService();

router.get('/:type/:id', async (req, res, next) => {
  try {
    const { type, id } = req.params;
    const contentsData = await contentsService.getContentsByTypeAndId(type, id);
    res.json(contentsData);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
