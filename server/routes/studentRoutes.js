// routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    updateHandleAndSync,
    getEmailStatus,
    toggleEmailReminder
} = require('../controllers/studentController');
const { getStudentContests, getStudentProblemStats } = require('../controllers/codeforcesDataController');
const { syncAllCodeforcesData } = require('../controllers/syncController');

// @route   GET /api/students               -> get all students data
router.get('/', getStudents);

// @route   GET /api/students/:id           -> get perticular student's data
router.get('/:id', getStudentById);

// @route   GET /api/students/:id/contests  -> get contests of a particular student
router.get('/:id/contests', getStudentContests);
// @route   GET /api/students/:id/problems  -> get problem stats of a particular student
router.get('/:id/problems', getStudentProblemStats);

// @route   POST /api/students              -> add new student to database
router.post('/', createStudent);

// @route   PUT /api/students/:id           -> update existing student in database
router.put('/:id', updateStudent);

// @route   DELETE /api/students/:id        -> delete an existing student from database
router.delete('/:id', deleteStudent);

// @route   PATCH /api/students/:id/handle                  -> update handle and sync codeforces data
router.patch('/:id/handle', updateHandleAndSync);

// @route   GET /api/students/:id/email-status              -> check if email is enabled or not for the given id
router.get('/:id/email-status', getEmailStatus);

// @route   PATCH /api/students/:id/disable-email           -> disable email reminder for the given id
router.patch('/:id/disable-email', toggleEmailReminder);

// @route   POST /api/students/sync-all                     -> manually trigger sync of all students' codeforces data
router.post('/sync-all', async (req, res) => {
    await syncAllCodeforcesData();
    res.json({ message: "Manual sync complete" });
});

module.exports = router;
