const cron = require('node-cron');
const { syncAllCodeforcesData } = require('./controllers/syncController');

// Run at 2 AM every day
cron.schedule('0 2 * * *', async () => {
    console.log("Running daily Codeforces sync at 2 AM...");
    await syncAllCodeforcesData();
});



// For testing: runs every minute
// cron.schedule('*/1 * * * *', async () => {
//     console.log("🔁 Running Codeforces sync...");
//     await syncAllCodeforcesData();
// });


// const { sendReminderEmail } = require('./utils/sendReminder'); // or controller
// const Student = require('./models/student.model');
// const CodeforcesData = require('./models/codeforcesData');

// cron.schedule('0 2 * * *', async () => {
//     console.log("Running daily Codeforces sync at 2 AM...");
//     await syncAllCodeforcesData();

//     // Inactivity detection
//     const inactiveThreshold = Date.now() / 1000 - 7 * 24 * 60 * 60; // 7 days ago
//     const students = await Student.find({ codeforcesHandle: { $exists: true }, autoEmailDisabled: false });

//     for (const student of students) {
//         const cfData = await CodeforcesData.findOne({ studentId: student._id });
//         const recentSubmission = cfData?.submissions.find(sub => sub.creationTimeSeconds > inactiveThreshold);

//         if (!recentSubmission) {
//             // Send email (pseudo)
//             await sendReminderEmail(student.email, student.name);

//             student.emailRemindersSent += 1;
//             await student.save();

//             console.log(`Reminder sent to ${student.name}`);
//         }
//     }
// });
