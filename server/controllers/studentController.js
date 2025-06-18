const Student = require('../models/student.model.js');
const CodeforcesData = require("../models/codeforcesData.js"); // Make sure this path is correct
const axios = require('axios');

// @route   GET /api/students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/students/:id
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });
        res.json(student);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   POST /api/students
const createStudent = async (req, res) => {
    const { name, email, phone, codeforcesHandle } = req.body;

    if (!name || !email || !codeforcesHandle) {
        return res.status(400).json({ message: 'Please fill in required fields' });
    }

    const studentExists = await Student.findOne({ email });
    if (studentExists) {
        return res.status(400).json({ message: 'Student with this email already exists' });
    }

    try {
        const student = await Student.create({
            name,
            email,
            phone,
            codeforcesHandle,
        });

        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
    try {
        const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
    try {
        const deleted = await Student.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ message: 'Student removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateHandleAndSync = async (req, res) => {
    const { codeforcesHandle } = req.body;
    const { id } = req.params;

    try {
        const student = await Student.findById(id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        // Update student
        student.codeforcesHandle = codeforcesHandle;
        student.lastSynced = new Date();

        // Fetch basic profile info
        const userInfoRes = await axios.get(`https://codeforces.com/api/user.info?handles=${codeforcesHandle}`);
        const userInfo = userInfoRes.data.result[0];

        student.currentRating = userInfo.rating || 0;
        student.maxRating = userInfo.maxRating || 0;
        await student.save();

        // Fetch contests
        const contestRes = await axios.get(`https://codeforces.com/api/user.rating?handle=${codeforcesHandle}`);
        const contests = contestRes.data.result || [];

        // Fetch submissions
        const submissionRes = await axios.get(`https://codeforces.com/api/user.status?handle=${codeforcesHandle}`);
        const submissions = submissionRes.data.result || [];

        // Save to CodeforcesData collection
        await CodeforcesData.findOneAndUpdate(
            { studentId: student._id },
            {
                studentId: student._id,
                handle: codeforcesHandle,
                contests,
                submissions,
                lastUpdated: new Date(),
            },
            { upsert: true }
        );


        return res.status(200).json({
            message: "Handle updated and Codeforces data synced",
            student,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Failed to sync Codeforces data", error: err.message });
    }
};
// const updateHandleAndSync = async (req, res) => {
//     const { codeforcesHandle } = req.body;
//     try {
//         const student = await Student.findById(req.params.id);
//         if (!student) return res.status(404).json({ message: "Student not found" });

//         student.codeforcesHandle = codeforcesHandle;
//         student.lastSynced = new Date();
//         await student.save();

//         // Fetch Codeforces rating
//         const response = await axios.get(`https://codeforces.com/api/user.info?handles=${codeforcesHandle}`);
//         const cfData = response.data.result[0];

//         student.currentRating = cfData.rating || 0;
//         student.maxRating = cfData.maxRating || 0;
//         await student.save();

//         res.json({ message: "Handle updated and data synced", student });
//     } catch (err) {
//         res.status(500).json({ message: "Failed to update handle or fetch CF data", error: err.message });
//     }
// };

const getEmailStatus = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        res.json({
            emailRemindersSent: student.emailRemindersSent || 0,
            autoEmailDisabled: student.autoEmailDisabled || false,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const toggleEmailReminder = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: "Student not found" });

        student.autoEmailDisabled = !student.autoEmailDisabled;
        await student.save();

        res.json({
            message: `Email reminders ${student.autoEmailDisabled ? 'disabled' : 'enabled'}`,
            autoEmailDisabled: student.autoEmailDisabled,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    updateHandleAndSync,
    getEmailStatus,
    toggleEmailReminder
};