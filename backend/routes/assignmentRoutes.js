const express = require('express');
const router = express.Router();
const {
    createAssignment,
    getAssignmentsByClassroom,
    getAssignmentById,
    deleteAssignment,
} = require('../controllers/assignmentController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.route('/').post(protect, teacher, createAssignment);
router.route('/classroom/:classroomId').get(protect, getAssignmentsByClassroom);
router.route('/:id').get(protect, getAssignmentById).delete(protect, teacher, deleteAssignment);

module.exports = router;
