import {
  deleteAllAttendanceFromDb, deleteAttendanceFromDb, getAttendanceFromDb, getEventFromDb, getMembersFromDb,
  saveAttendanceToDb, setEventRecorded,
} from '../infrastructure/repository/MongoRepository';
import { Attendance } from '../models/Attendance';


/**
 * Gets attendance records.
 *
 * @param {string} [req.query.eventId] - The ID for the event we are getting attendance records for.
 * @param {string} [req.query.memberId] - The ID for the member we are getting attendance records for.
 */
const getAttendance = async (req, res, next) => {
  const eventId = req.query.eventId;
  const memberId = req.query.memberId;

  let attendanceRecords;

  // Set attendance records to return dependent on whether these are for an event, member or neither
  if (eventId) {
    const event = await getEventFromDb(eventId);

    // If the event has attendance records, get these from the database, otherwise, generate new attendance records
    if (event.hasAttendanceRecords) {
      attendanceRecords = await getAttendanceFromDb(eventId);
    } else {
      attendanceRecords = await generateNewAttendanceRecords(event);
    }
  } else if (memberId) {
    attendanceRecords = await getAttendanceFromDb(null, memberId);
  } else {
    attendanceRecords = await getAttendanceFromDb();
  }

  res.json(attendanceRecords.map((attendance) => attendance.toDto()));
};

/**
 * Generates new attendance records for a specific `event`. Only called when this is the first time generating
 * attendance records for the event (in other cases, the previous attendance records should be returned from the DB,
 * edited, then saved).
 *
 * @param {Event} event - The event we are generating new attendance records for.
 * @returns {Attendance[]}
 */
const generateNewAttendanceRecords = async (event) => {
  const members = await getMembersFromDb();

  return members.filter(member => {
    const eventDate = event.date;

    if (member.endDate) {
      return (eventDate >= member.startDate && eventDate <= member.endDate);
    } else {
      return (eventDate >= member.startDate);
    }
  }).map((member) => new Attendance(
    {
      memberId: member.id,
      fullName: member.fullName,
      eventId: event.id,
      eventType: event.type,
      isLate: false,
      isAbsent: false,
      isExcused: false,
      excuseReason: '',
      capacity: 1,
    },
  ))
    ;
};

/**
 * Saves the attendance records.
 *
 * @param {Object[]} req.body - The array of attendance records to save.
 * @param {string} [req.body[].id] - The ID of the attendance record.
 * @param {string} req.body[].memberId - The ID of the associated member.
 * @param {string} req.body[].fullName - The full name of the member.
 * @param {string} req.body[].eventId - The ID of the associated event.
 * @param {string} req.body[].eventType - The type of event.
 * @param {boolean} req.body[].isAbsent - If the member was absent at the event.
 * @param {boolean} req.body[].isExcused - If the member was excused for being absent/late.
 * @param {boolean} req.body[].isShort - If the member left early or was late to the event.
 * @param {string} req.body[].excuseReason - An excuse reason (empty string if not applicable).
 * @param {number} req.body[].capacity - The capacity level of the member (if applicable).
 */
const saveAttendance = async (req, res, next) => {
  const records = req.body.map(record => new Attendance(
    {
      id: record.id,
      memberId: record.memberId,
      fullName: record.fullName,
      eventId: record.eventId,
      eventType: record.eventType,
      isAbsent: record.isAbsent,
      isExcused: record.isExcused,
      isLate: record.isShort,
      excuseReason: record.excuseReason,
      capacity: record.capacity,
    },
  ));
  const eventId = req.body[0].eventId;
  const eventObject = await getEventFromDb(eventId);

  if (eventObject) {
    if (eventObject.hasAttendanceRecords) {
      await deleteAttendanceFromDb(eventId);
    }

    await setEventRecorded(eventId, true);
    await saveAttendanceToDb(records);
    res.sendStatus(200);
  } else {
    res.sendStatus(500);
  }
};

/**
 * Deletes attendance records for the specified member or event.
 *
 * @param {string} [req.query.eventId] - The ID of the event to delete attendance records for.
 * @param {string} [req.query.memberId] - The ID of the member to delete attendance records for.
 */
const deleteAttendance = async (req, res, next) => {
  if (req.query.eventId) {
    const deleteAttendanceResult = await deleteAttendanceFromDb(req.query.eventId);
    await setEventRecorded(req.query.eventId, false);

    res.send(
      `Delete successful: ${deleteAttendanceResult.result.n} attendance records deleted for event ${req.query.eventId}`);
  } else if (req.query.memberId) {
    const deleteAttendanceResult = await deleteAttendanceFromDb(null, req.query.memberId);

    res.send(
      `Delete successful: ${deleteAttendanceResult.result.n} attendance records deleted for member ${req.query.memberId}`);
  } else {
    res.status(404).send('No event/member Id specified! No records deleted');
  }
};

/**
 * Delete all attendance records.
 */
const resetAttendance = async (req, res, next) => {
  const deleteAttendanceResult = await deleteAllAttendanceFromDb();
  await setEventRecorded(null, false);

  res.send(`Delete successful: ${deleteAttendanceResult.result.n} attendance records deleted`);
};


export {
  getAttendance,
  saveAttendance,
  resetAttendance,
  deleteAttendance,
};
