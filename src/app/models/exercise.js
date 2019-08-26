const mongoose = require('../../database');

const bcrypt = require('bcryptjs');

const ExerciseSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
    },
    muscleGroup: {
        type: mongoose.Types.ObjectId,
        ref: 'MuscleGroup',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Exercise = mongoose.model('Exercise', ExerciseSchema);

module.exports = Exercise;