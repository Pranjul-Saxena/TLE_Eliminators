const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    codeforcesHandle: String,
    currentRating: Number,
    maxRating: Number,
    lastSynced: Date,
    emailRemindersSent: { type: Number, default: 0 },
    autoEmailDisabled: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
