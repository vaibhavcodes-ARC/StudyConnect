const express = require('express');
const router = express.Router();
const {
    createSubmission,
    getSubmissionsByAssignment,
    gradeSubmission,
    getMySubmission,
} = require('../controllers/submissionController');
const { protect, teacher } = require('../middleware/authMiddleware');

router.route('/').post(protect, createSubmission);
router.route('/assignment/:assignmentId').get(protect, teacher, getSubmissionsByAssignment);
router.route('/my-submission/:assignmentId').get(protect, getMySubmission);
router.route('/:id/grade').put(protect, teacher, gradeSubmission);

module.exports = router;
