const Assignment = require('../models/Assignment');
const Classroom = require('../models/Classroom');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private/Teacher
const createAssignment = async (req, res) => {
    try {
        const { classroomId, title, description, deadline, referenceFiles } = req.body;

        const classroom = await Classroom.findById(classroomId);

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Verify that the user creating the assignment is the teacher of the classroom
        if (classroom.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to create assignments for this classroom' });
        }

        const assignment = await Assignment.create({
            classroomId,
            title,
            description,
            deadline,
            referenceFiles,
            createdBy: req.user._id,
        });

        res.status(201).json(assignment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get assignments by classroom ID
// @route   GET /api/assignments/classroom/:classroomId
// @access  Private
const getAssignmentsByClassroom = async (req, res) => {
    try {
        const assignments = await Assignment.find({ classroomId: req.params.classroomId })
            .populate('createdBy', 'name')
            .sort({ deadline: 1 });

        res.json(assignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get assignment by ID
// @route   GET /api/assignments/:id
// @access  Private
const getAssignmentById = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id)
            .populate('classroomId', 'subjectName')
            .populate('createdBy', 'name');

        if (assignment) {
            res.json(assignment);
        } else {
            res.status(404).json({ message: 'Assignment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private/Teacher
const deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);

        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        // Verify that the user deleting is the creator
        if (assignment.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this assignment' });
        }

        await assignment.deleteOne();
        res.json({ message: 'Assignment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createAssignment,
    getAssignmentsByClassroom,
    getAssignmentById,
    deleteAssignment,
};
