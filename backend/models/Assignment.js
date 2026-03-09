const mongoose = require('mongoose');

const assignmentSchema = mongoose.Schema(
    {
        classroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        deadline: {
            type: Date,
            required: true,
        },
        referenceFiles: [
            {
                type: String, // URLs to the uploaded reference materials
            },
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
