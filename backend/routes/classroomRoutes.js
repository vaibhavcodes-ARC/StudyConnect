const express = require('express');
const router = express.Router();
const {
    createClassroom,
    getClassrooms,
    getClassroomById,
    joinClassroom,
    updateSyllabus,
    addNote,
} = require('../controllers/classroomController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.route('/').post(protect, teacher, createClassroom).get(protect, getClassrooms);
router.route('/join').post(protect, joinClassroom);
router.route('/:id').get(protect, getClassroomById);
router.route('/:id/syllabus').put(protect, teacher, updateSyllabus);
router.route('/:id/notes').post(protect, teacher, addNote);

module.exports = router;
