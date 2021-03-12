import { Router } from 'express';
import { deploy, resetDevelopmentDatabase, authorize } from '../controllers/DefaultController';
import AttendanceRouter from './AttendanceRouter';

const router = Router();

// Route to deploy changes to production
router.post('/deploy', deploy);

// Route to reset the development database
router.get('/api/reset-db', resetDevelopmentDatabase);

// Route to authorize a login request
router.post('/api/authorize', authorize);

// Route for all other api calls (i.e. attendance related)
router.use('/api', AttendanceRouter);

export default router;
