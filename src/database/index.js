const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://workoutsystem:workoutsystem@cluster0-4abup.mongodb.net/workoutdb', {useNewUrlParser: true});

mongoose.Promise = global.Promise;

module.exports = mongoose;
