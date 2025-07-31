const express = require('express');
const ContentFilterController = require('../controllers/ContentFilterController');

const router = express.Router();
const contentFilterController = new ContentFilterController();

router.post('/', (req, res, next) => {
  contentFilterController.createContentFilter(req, res, next);
});

router.put('/:id', (req, res, next) => {
  contentFilterController.updateContentFilter(req, res, next);
});

module.exports = router;
