const ExamResource = require('../models/ExamResource');

// @desc    Upload an exam resource
// @route   POST /api/exam-resources
// @access  Private/Teacher
const createExamResource = async (req, res) => {
    try {
        const { title, description, uploadedFile } = req.body;

        const resource = await ExamResource.create({
            title,
            description,
            uploadedFile,
            uploadedBy: req.user._id,
        });

        res.status(201).json(resource);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all exam resources
// @route   GET /api/exam-resources
// @access  Private (Teacher and Student)
const getExamResources = async (req, res) => {
    try {
        const resources = await ExamResource.find({})
            .populate('uploadedBy', 'name')
            .sort({ uploadDate: -1 });

        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createExamResource,
    getExamResources,
};
