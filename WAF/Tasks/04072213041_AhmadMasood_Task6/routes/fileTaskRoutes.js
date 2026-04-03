const express = require('express');
const router = express.Router();
const fileTaskController = require('../controllers/fileTaskController.js');

router.get('/', fileTaskController.getAllTasks);
router.post('/', fileTaskController.createTask);

module.exports = router;
