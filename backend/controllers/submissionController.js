const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Classroom = require('../models/Classroom');

// @desc    Submit an assignment
// @route   POST /api/submissions
// @access  Private/Student
const createSubmission = async (req, res) => {
    try {
        const { assignmentId, submittedFile } = req.body;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Check if student has already submitted
        const existingSubmission = await Submission.findOne({
            assignmentId,
            studentId: req.user._id,
        });

        if (existingSubmission) {
            return res.status(400).json({ message: 'Assignment already submitted' });
        }

        const submission = await Submission.create({
            assignmentId,
            studentId: req.user._id,
            submittedFile,
        });

        res.status(201).json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all submissions for an assignment
// @route   GET /api/submissions/assignment/:assignmentId
// @access  Private/Teacher
const getSubmissionsByAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Verify that the user requesting submissions is the teacher who created the assignment
        if (assignment.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view submissions' });
        }

        const submissions = await Submission.find({ assignmentId: req.params.assignmentId })
            .populate('studentId', 'name email');

        res.json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Grade a submission
// @route   PUT /api/submissions/:id/grade
// @access  Private/Teacher
const gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback } = req.body;

        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        const assignment = await Assignment.findById(submission.assignmentId);
        if (assignment.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to grade this submission' });
        }

        submission.grade = grade;
        submission.feedback = feedback;
        await submission.save();

        res.json(submission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get a student's submission for a particular assignment
// @route   GET /api/submissions/my-submission/:assignmentId
// @access  Private/Student
const getMySubmission = async (req, res) => {
    try {
        const submission = await Submission.findOne({
            assignmentId: req.params.assignmentId,
            studentId: req.user._id,
        });

        if (submission) {
            res.json(submission);
        } else {
            res.status(404).json({ message: 'No submission found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubmission,
    getSubmissionsByAssignment,
    gradeSubmission,
    getMySubmission,
};
