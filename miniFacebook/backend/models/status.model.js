const mongoose = require('mongoose');

var statusSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    status: String,
    time: String
});

mongoose.model('Status', statusSchema);