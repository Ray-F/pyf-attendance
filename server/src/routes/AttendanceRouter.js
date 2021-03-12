import { Router } from 'express';
import {
  deleteEvent, getEventDashboardList, getEvents, resetEvents, saveEvent,
} from '../controllers/EventController';
import { deleteMember, getMembers, resetMembers, saveMember } from '../controllers/MemberController';
import { deleteAttendance, getAttendance, resetAttendance, saveAttendance } from '../controllers/AttendanceController';

const router = Router();

router.get('/members', getMembers);
router.post('/members/add', saveMember);
router.get('/members/delete', deleteMember);
router.get('/members/reset', resetMembers);

router.get('/events', getEvents);
router.get('/events/list', getEventDashboardList);
router.post('/events/add', saveEvent);
router.get('/events/reset', resetEvents);
router.get('/events/delete', deleteEvent);

router.get('/attendance', getAttendance);
router.get('/attendance/all', getAttendance);
router.post('/attendance', saveAttendance);
router.get('/attendance/reset', resetAttendance);
router.get('/attendance/delete', deleteAttendance);

router.get('*', (req, res) => {
  res.status(200).send(
    `
    <h2>PYF Attendance API</h2>
    <p>
      You have reached the express API for PYF attendance. Ensure you have the correct permissions before attempting to use the API.
      Email rf.raymondfeng@gmail.com for any questions on usage.
    </p>
  `,
  );
});


export default router;
