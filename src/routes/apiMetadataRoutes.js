const express = require('express');
const ApiMetadataController = require('../controllers/ApiMetadataController');

const router = express.Router();
const apiMetadataController = new ApiMetadataController();

router.post('/', (req, res, next) => {
  apiMetadataController.createApiMetadata(req, res, next);
});

router.get('/', (req, res, next) => {
  apiMetadataController.getAllApiMetadata(req, res, next);
});

module.exports = router;
