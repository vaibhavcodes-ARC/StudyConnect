const express = require('express');
const router = express.Router();
const {
    createExamResource,
    getExamResources,
} = require('../controllers/examResourceController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.route('/').post(protect, teacher, createExamResource).get(protect, getExamResources);

module.exports = router;
