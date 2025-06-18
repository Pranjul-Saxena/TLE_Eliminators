const Student = require('../models/student.model.js');
const CodeforcesData = require('../models/codeforcesData.js');
const { sendReminderEmail } = require('../utils/sendEmail.js');
const axios = require('axios');

const syncAllCodeforcesData = async () => {
    const students = await Student.find({ codeforcesHandle: { $exists: true, $ne: null } });

    for (const student of students) {
        try {
            const handle = student.codeforcesHandle;

            // Fetch contests
            const contestRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${handle}`);
            const contests = contestRes.data.result;

            // Fetch submissions
            const submissionRes = await axios.get(`https://codeforces.com/api/user.status?handle=${handle}`);
            const submissions = submissionRes.data.result;

            // Upsert in CodeforcesData
            await CodeforcesData.findOneAndUpdate(
                { studentId: student._id },
                {
                    studentId: student._id,
                    handle,
                    contests,
                    submissions,
                    lastUpdated: new Date()
                },
                { upsert: true }
            );

            // Update student model
            const latest = contests[contests.length - 1] || {};
            student.currentRating = latest.newRating || 0;
            student.maxRating = Math.max(...contests.map(c => c.newRating || 0), 0);
            student.lastSynced = new Date();
            await student.save();

            // 📩 Inactivity Detection & Email Reminder
            const SEVEN_DAYS_AGO = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
            const recentSubmissions = submissions.filter(
                (sub) => sub.creationTimeSeconds > SEVEN_DAYS_AGO
            );

            if (recentSubmissions.length === 0 && !student.autoEmailDisabled) {
                await sendReminderEmail(student.email, student.name);
                student.emailRemindersSent = (student.emailRemindersSent || 0) + 1;
                await student.save();
                console.log(`📩 Reminder email sent to ${student.name}`);
            }

            console.log(`✅ Synced data for ${handle}`);
        } catch (err) {
            console.error(`❌ Error syncing for ${student.codeforcesHandle}:`, err.message);
        }
    }
};

module.exports = { syncAllCodeforcesData };
