const express = require('express');
const router = express.Router();
const multer = require('multer');

const statusController = require('../controllers/status.controller');



router.post('/status', statusController.createStatus);
router.get('/status', statusController.getStatus);

module.exports = router;