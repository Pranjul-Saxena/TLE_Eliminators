const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
    },
});

const sendReminderEmail = async (to, name) => {
    const info = await transporter.sendMail({
        from: '"TLE Eliminators" pranjul8120069454@gmail.com',
        to,
        subject: '⏰ Time to Code!, Codeforces Activity Reminder',
        html: `<p>Hi ${name},<br>You haven’t solved any problems on Codeforces in the past 7 days. Get back and keep your skills sharp! 💪Please continue practicing!</p>`,
    });

    console.log("📩 Reminder sent:", info.messageId);
};

module.exports = { sendReminderEmail };