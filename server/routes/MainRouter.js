const { Router } = require('express')
const path = require('path')

const defaultController = require('../controllers/DefaultController')

const router = Router()
router.post('/deploy', defaultController.deploy);

// To add another router:
// const inputRouter = require('./anotherRouter');
// router.use("/api/inputs", inputRouter);

const attendanceRouter = require('./AttendanceRouter');
router.use('/api', attendanceRouter)

module.exports = router;
