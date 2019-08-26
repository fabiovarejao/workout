const mongoose = require('../../database');

const bcrypt = require('bcryptjs');

const StudentSchema = new mongoose.Schema({
    trainer: {
        type: mongoose.Types.ObjectId,
        ref: 'Trainer',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    workoutList: [{

    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const StudentSchema = mongoose.model('StudentSchema', StudentSchemaSchema);

module.exports = StudentSchema;