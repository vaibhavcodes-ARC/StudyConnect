const mongoose = require('mongoose');

const examResourceSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        uploadedFile: {
            type: String, // URL to the resource file
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        uploadDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const ExamResource = mongoose.model('ExamResource', examResourceSchema);
module.exports = ExamResource;
