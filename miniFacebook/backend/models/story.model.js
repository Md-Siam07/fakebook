const mongoose = require('mongoose');

var storySchema = new mongoose.Schema({
    fullName: String,
    email: String,
    storyURL: String,
    time: String
});

mongoose.model('Story', storySchema);