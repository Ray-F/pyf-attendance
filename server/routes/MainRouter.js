const { Router } = require('express')
const path = require('path')

const defaultController = require('../controllers/DefaultController')

const router = Router()

// Route to deploy changes to production
router.post('/deploy', defaultController.deploy);

// Route to reset the development database
router.get('/api/reset-db', defaultController.resetDevelopmentDatabase);


router.post('/api/authorize', defaultController.authorize);

// To add another router:
// const inputRouter = require('./anotherRouter');
// router.use("/api/inputs", inputRouter);

const attendanceRouter = require('./AttendanceRouter');
router.use('/api', attendanceRouter)

module.exports = router;
