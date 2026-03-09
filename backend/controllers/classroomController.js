const Classroom = require('../models/Classroom');
const User = require('../models/User');

// @desc    Create a new classroom
// @route   POST /api/classrooms
// @access  Private/Teacher
const createClassroom = async (req, res) => {
    try {
        const { subjectName } = req.body;

        const classroomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const inviteLink = `${req.protocol}://${req.get('host')}/join/${classroomCode}`;

        const classroom = await Classroom.create({
            subjectName,
            teacherId: req.user._id,
            classroomCode,
            inviteLink,
        });

        // Add classroom to teacher's joinedClassrooms
        const user = await User.findById(req.user._id);
        user.joinedClassrooms.push(classroom._id);
        await user.save();

        res.status(201).json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's classrooms
// @route   GET /api/classrooms
// @access  Private
const getClassrooms = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('joinedClassrooms');
        res.json(user.joinedClassrooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get classroom by ID
// @route   GET /api/classrooms/:id
// @access  Private
const getClassroomById = async (req, res) => {
    try {
        const classroom = await Classroom.findById(req.params.id)
            .populate('teacherId', 'name email')
            .populate('students', 'name email');

        if (classroom) {
            res.json(classroom);
        } else {
            res.status(404).json({ message: 'Classroom not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Join a classroom using code
// @route   POST /api/classrooms/join
// @access  Private/Student
const joinClassroom = async (req, res) => {
    try {
        const { classroomCode } = req.body;

        const classroom = await Classroom.findOne({ classroomCode });

        if (!classroom) {
            return res.status(404).json({ message: 'Invalid classroom code' });
        }

        // Check if student is already in the classroom
        if (classroom.students.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already in this classroom' });
        }

        // Add student to classroom
        classroom.students.push(req.user._id);
        await classroom.save();

        // Add classroom to student's joinedClassrooms
        const user = await User.findById(req.user._id);
        user.joinedClassrooms.push(classroom._id);
        await user.save();
        res.json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update classroom syllabus
// @route   PUT /api/classrooms/:id/syllabus
// @access  Private/Teacher
const updateSyllabus = async (req, res) => {
    try {
        const { syllabusFile } = req.body;
        const classroom = await Classroom.findById(req.params.id);

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Verify teacher
        if (classroom.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        classroom.syllabusFile = syllabusFile;
        await classroom.save();

        res.json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a note to classroom
// @route   POST /api/classrooms/:id/notes
// @access  Private/Teacher
const addNote = async (req, res) => {
    try {
        const { title, fileUrl } = req.body;
        const classroom = await Classroom.findById(req.params.id);

        if (!classroom) {
            return res.status(404).json({ message: 'Classroom not found' });
        }

        // Verify teacher
        if (classroom.teacherId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        classroom.notes.push({ title, fileUrl });
        await classroom.save();

        res.status(201).json(classroom);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createClassroom,
    getClassrooms,
    getClassroomById,
    joinClassroom,
    updateSyllabus,
    addNote,
};
