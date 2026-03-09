const mongoose = require('mongoose');

const classroomSchema = mongoose.Schema(
    {
        subjectName: {
            type: String,
            required: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        classroomCode: {
            type: String,
            required: true,
            unique: true,
        },
        inviteLink: {
            type: String,
            required: true,
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        syllabusFile: {
            type: String,
            default: null,
        },
        notes: [
            {
                title: String,
                fileUrl: String,
                uploadedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Classroom = mongoose.model('Classroom', classroomSchema);
module.exports = Classroom;
