const express = require('express');
const router = express.Router();
const {
    getEvents,
    createEvent,
    deleteEvent,
} = require('../controllers/eventController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.route('/').get(protect, getEvents).post(protect, teacher, createEvent);
router.route('/:id').delete(protect, teacher, deleteEvent);

module.exports = router;
