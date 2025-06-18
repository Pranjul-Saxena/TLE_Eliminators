// models/codeforcesData.js
const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    id: Number,
    contestId: Number,
    problem: {
        name: String,
        rating: Number,
        index: String,
        tags: [String],
    },
    verdict: String,
    creationTimeSeconds: Number,
});

const contestSchema = new mongoose.Schema({
    contestId: Number,
    contestName: String,
    handle: String,
    rank: Number,
    ratingUpdateTimeSeconds: Number,
    oldRating: Number,
    newRating: Number,
});

const codeforcesSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
        unique: true,
    },
    handle: {
        type: String,
        required: true,
    },
    submissions: {
        type: [submissionSchema],
        default: [],
    },
    contests: {
        type: [contestSchema],
        default: [],
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('CodeforcesData', codeforcesSchema);




// // models/codeforcesData.js
// const mongoose = require('mongoose');

// const submissionSchema = new mongoose.Schema({
//     id: Number,
//     contestId: Number,
//     problem: {
//         name: String,
//         rating: Number,
//         index: String,
//         tags: [String]
//     },
//     verdict: String,
//     creationTimeSeconds: Number
// });

// const contestSchema = new mongoose.Schema({
//     contestId: Number,
//     contestName: String,
//     handle: String,
//     rank: Number,
//     ratingUpdateTimeSeconds: Number,
//     oldRating: Number,
//     newRating: Number
// });

// const codeforcesSchema = new mongoose.Schema({
//     studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
//     handle: String,
//     submissions: [submissionSchema],
//     contests: [contestSchema],
//     lastUpdated: Date
// });

// module.exports = mongoose.model('CodeforcesData', codeforcesSchema);
