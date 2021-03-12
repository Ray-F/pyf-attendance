import { Router } from 'express';
import { deploy, resetDevelopmentDatabase, authorize } from '../controllers/DefaultController';

const router = Router();

// Route to deploy changes to production
router.post('/deploy', deploy);

// Route to reset the development database
router.get('/api/reset-db', resetDevelopmentDatabase);

// Route to authorize a login request
router.post('/api/authorize', authorize);

// To add another router:
// const inputRouter = require('./anotherRouter');
// router.all("/api/inputs", inputRouter);

const attendanceRouter = require('./AttendanceRouter');
router.all('/api', attendanceRouter);


export default router;
