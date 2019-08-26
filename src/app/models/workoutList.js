const mongoose = require('../../database');

const bcrypt = require('bcryptjs');

const WorkoutListSchema = new mongoose.Schema({
    description: {
        type: String
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trainer',
        required: true,
    },
    exercises: [{
        type: mongoose.Types.ObjectId,
        ref: 'Exercise',
        required: true,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const WorkoutList = mongoose.model('WorkoutList', WorkoutListSchema);

module.exports = WorkoutList;