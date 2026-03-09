const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema(
    {
        assignmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment',
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        submittedFile: {
            type: String, // URL to the uploaded file
            required: true,
        },
        submissionTime: {
            type: Date,
            default: Date.now,
        },
        grade: {
            type: Number,
            default: null,
        },
        feedback: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
