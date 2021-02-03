const { Router } = require('express');

const defaultController = require('../controllers/DefaultController');

const router = Router();



router.get('/hello', defaultController.helloWorld);

// To add another router:
// const inputRouter = require('./anotherRouter');
// router.use("/api/inputs", inputRouter);

const attendanceRouter = require('./AttendanceRouter');
router.use('/api', attendanceRouter)


router.use("/", (req, res, next) => {
  res.send(`
    <h2>Express API for PYF Attendance App</h2>
    <p>
      You have reached the express API section.
      Email rf.raymondfeng@gmail.com for any questions on usage.
    </p>
  `);
});




module.exports = router;
