const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            enum: ['Exam', 'Holiday', 'Event', 'Assignment'],
            default: 'Event',
        },
        classroomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom',
            default: null, // null means global/college-wide event
        },
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

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
