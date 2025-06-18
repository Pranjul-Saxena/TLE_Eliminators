// controllers/codeforcesDataController.js
const CodeforcesData = require('../models/codeforcesData.js');
const Student = require('../models/student.model.js');

// @route  GET /api/students/:id/contests?range=30|90|365    -----> Get contest history for a student
const getStudentContests = async (req, res) => {
    try {
        const { id } = req.params;
        const { range = 90 } = req.query;

        const studentData = await CodeforcesData.findOne({ studentId: id });
        if (!studentData) return res.status(404).json({ message: 'No CF data found' });

        const cutoff = Math.floor(Date.now() / 1000) - (parseInt(range) * 24 * 60 * 60);
        const filteredContests = studentData.contests.filter(c => c.ratingUpdateTimeSeconds >= cutoff);

        const ratingChart = [];
        const contestList = [];

        filteredContests.forEach(contest => {
            ratingChart.push({
                x: new Date(contest.ratingUpdateTimeSeconds * 1000),
                y: contest.newRating
            });

            contestList.push({
                name: contest.contestName,
                ratingChange: contest.newRating - contest.oldRating,
                rank: contest.rank,
                date: new Date(contest.ratingUpdateTimeSeconds * 1000)
            });
        });

        return res.json({ ratingChart, contestList });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


// @route  GET /api/students/:id/problems?range=7|30|90   --> Get problem solving stats for a student
const getStudentProblemStats = async (req, res) => {
    try {
        const { id } = req.params;
        const { range = 30 } = req.query;

        const studentData = await CodeforcesData.findOne({ studentId: id });
        if (!studentData) return res.status(404).json({ message: 'No CF data found' });

        const cutoff = Math.floor(Date.now() / 1000) - (parseInt(range) * 24 * 60 * 60);
        const correctSubmissions = studentData.submissions.filter(
            s => s.verdict === "OK" && s.creationTimeSeconds >= cutoff
        );

        if (correctSubmissions.length === 0) {
            return res.json({ message: "No correct submissions in this range" });
        }

        const uniqueProblems = {};
        let totalRating = 0;

        correctSubmissions.forEach(sub => {
            const id = `${sub.problem.name}-${sub.problem.index}`;
            if (!uniqueProblems[id]) {
                uniqueProblems[id] = sub.problem.rating || 0;
                totalRating += sub.problem.rating || 0;
            }
        });

        const ratings = Object.values(uniqueProblems);
        const mostDifficult = Math.max(...ratings);
        const totalSolved = ratings.length;
        const avgRating = (totalRating / totalSolved).toFixed(2);
        const avgPerDay = (totalSolved / parseInt(range)).toFixed(2);

        // Rating Bucket: 800-900, 900-1000, ..., 2400+
        const buckets = {};
        ratings.forEach(r => {
            if (!r) return;
            const bucket = Math.floor(r / 100) * 100;
            buckets[bucket] = (buckets[bucket] || 0) + 1;
        });

        // Heatmap: { 'YYYY-MM-DD': count }
        const heatmap = {};
        correctSubmissions.forEach(sub => {
            const date = new Date(sub.creationTimeSeconds * 1000).toISOString().slice(0, 10);
            heatmap[date] = (heatmap[date] || 0) + 1;
        });

        return res.json({
            mostDifficult,
            totalSolved,
            avgRating,
            avgPerDay,
            barChartData: buckets,
            heatmap
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


module.exports = {
    getStudentContests,
    getStudentProblemStats,
};