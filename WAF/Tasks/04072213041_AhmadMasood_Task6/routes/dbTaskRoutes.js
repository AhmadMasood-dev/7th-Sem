const express = require('express');
const router = express.Router();
const dbTaskController = require('../controllers/dbTaskController.js');

router.get('/', dbTaskController.getAllTasks);
router.post('/', dbTaskController.createTask);

module.exports = router;
