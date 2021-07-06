import mongoClient from '../mapper/MongoConnection';
import { ObjectId } from 'mongodb';
import Config from '../../utils/Config';
import { Attendance } from '../../models/Attendance';
import { Event } from '../../models/Event';
import { MemberDboMapper } from '../mapper/MemberMapper';
import { EventDboMapper } from '../mapper/EventMapper';
import { AttendanceDboMapper } from '../mapper/AttendanceMapper';

const eventDboMapper = new EventDboMapper();
const memberDboMapper = new MemberDboMapper();
const attendanceDboMapper = new AttendanceDboMapper();

/**
 * Returns the collection instance for `collectionName`.
 *
 * @param {string} collection - The name of the collection to return.
 * @returns {Collection}
 */
const getCollection = (collection) => {
  switch (collection) {
    case 'members':
    case 'events':
    case 'attendance':
    case 'users':
      return mongoClient.db(Config.DB_NAME).collection(collection);
    default:
      throw new Error(`No collection "${collection}" found on "${Config.DB_NAME}"`);
  }
};

/**
 * Get members from the member collection.
 *
 * @returns {Promise<Member[]>}
 */
const getMembersFromDb = async () => {
  return (await getCollection('members').find({}).toArray())
    .map((member) => memberDboMapper.fromDbo(member));
};

/**
 * Gets a single member with `memberId` from the members collection.
 *
 * @param {string} memberId - The ID of the member object to return.
 * @returns {Promise<Member>}
 */
const getMemberFromDb = async (memberId) => {
  const mongoMember = await getCollection('members').findOne({ '_id': new ObjectId(memberId) });
  return memberDboMapper.fromDbo(mongoMember);
};

/**
 * Saves a `memberObject` to the members collection.
 *
 * If `member.id` exists, this will edit the member instead of creating a new one.
 *
 * @param {Member} member - The member object to save to the members collection.
 * @returns {Promise<*>}
 */
const saveMemberToDb = async (member) => {
  // If an member ID was passed to this function, then update existing record
  if (member.id) {
    const mongoMember = member.toDbo();
    const query = { _id: mongoMember._id };
    const update = { $set: mongoMember };
    const options = { upsert: false };

    return await getCollection('members').updateOne(query, update, options);
  } else {
    return await getCollection('members').insertOne(member.toDbo());
  }
};

/**
 * Deletes a member with `memberId` from the members collection.
 *
 * @param {string} memberId - The ID of the member to delete.
 * @returns {Promise<*>}
 */
const deleteMemberFromDb = async (memberId) => {
  const query = {
    '_id': {
      $eq: new ObjectId(memberId),
    },
  };

  return await getCollection('members').deleteOne(query);
};

/**
 * Deletes all members from the members collection.
 *
 * @returns {Promise<*>}
 */
const deleteAllMembersFromDb = async () => {
  return await getCollection('members').deleteMany({});
};

/**
 * Gets all events from the events collection.
 *
 * @returns {Promise<Event[]>}
 */
const getEventsFromDb = async () => {
  return (await getCollection('events').find({}).toArray())
    .map((event) => eventDboMapper.fromDbo(event));
};

/**
 * Gets a single event with `eventId` from the events collection.
 *
 * @param {string} eventId - The ID of the event to return.
 * @returns {Promise<Event>}
 */
const getEventFromDb = async (eventId) => {
  const mongoEvent = await getCollection('events').findOne({ '_id': new ObjectId(eventId) });
  return eventDboMapper.fromDbo(mongoEvent);
};

/**
 * Saves an event to the events collection.
 *
 * @param {Event} event - The event to save.
 * @returns {Promise<*>}
 */
const saveEventToDb = async (event) => {
  if (event.id) {
    const mongoEvent = event.toDbo();
    const query = { _id: mongoEvent._id };
    const update = { $set: mongoEvent };
    const options = { upsert: true };

    return await getCollection('events').updateOne(query, update, options);
  } else {
    return await getCollection('events').insertOne(event.toDbo());
  }
};

/**
 * Deletes an event with `eventId` from the events collection.
 *
 * @param {string} eventId - The ID of the event to delete.
 * @returns {Promise<*>}
 */
const deleteEventFromDb = async (eventId) => {
  const query = {
    '_id': {
      $eq: new ObjectId(eventId),
    },
  };

  return await getCollection('events').deleteOne(query);
};

/**
 * Deletes all events from the events collection.
 *
 * @returns {Promise<*>}
 */
const deleteAllEventsFromDb = async () => {
  return await getCollection('events').deleteMany({});
};

/**
 * Updates an event(s) to have the `event.hasAttendanceRecords` field set to `recorded` value.
 *
 * @param {string|null} [eventId] - The ID of the event to change attendance records for.
 * @param {boolean} [recorded] - Sets the status of the recorded field.
 * @returns {Promise<*>}
 */
const setEventRecorded = async (eventId = null, recorded = true) => {
  const query = {
    $set: { hasAttendanceRecords: recorded },
  };

  if (eventId) {
    const filter = { _id: new ObjectId(eventId) };
    return await getCollection('events').updateOne(filter, query);
  }

  return await getCollection('events').updateMany({}, query);
};

/**
 * Gets attendance records from the attendance collection.
 *
 * @param {string|null} [eventId] - The ID of the event to return attendance records for.
 * @param {string|null} [memberId] - The ID of the member to return attendance records for.
 * @returns {Promise<Attendance[]>}
 */
const getAttendanceFromDb = async (eventId = null, memberId = null) => {
  let attendanceDboObjects;
  if (eventId) {
    attendanceDboObjects = await getCollection('attendance')
      .find({ 'event.eventId': new ObjectId(eventId) })
      .sort({ '_id': -1 })
      .toArray();
  } else if (memberId) {
    attendanceDboObjects = await getCollection('attendance')
      .find({ 'member.memberId': new ObjectId(memberId) })
      .sort({ '_id': -1 })
      .toArray();
  } else {
    attendanceDboObjects = await getCollection('attendance').find({}).sort({ '_id': -1 }).toArray();
  }

  return attendanceDboObjects.map((dboObject) => attendanceDboMapper.fromDbo(dboObject));
};

/**
 * Saves attendance records to attendance collection.
 *
 * @param {Attendance[]} attendanceArray - Array of attendance objects to save.
 * @returns {Promise<*>}
 */
const saveAttendanceToDb = async (attendanceArray) => {
  const attendanceDboObjects = attendanceArray.map((attendance) => attendance.toDbo());
  return await getCollection('attendance').insertMany(attendanceDboObjects);
};

/**
 * Deletes attendance records for an event or member from the attendance collection.
 *
 * @returns {Promise<*>}
 */
const deleteAttendanceFromDb = async (eventId = null, memberId = null) => {
  let query;

  if (eventId) {
    query = {
      'event.eventId': {
        $eq: new ObjectId(eventId),
      },
    };
  } else if (memberId) {
    query = {
      'member.memberId': {
        $eq: new ObjectId(memberId),
      },
    };
  } else {
    throw new Error('IllegalArgumentException: Unspecified event or member Id to delete attendance');
  }

  return await getCollection('attendance').deleteMany(query);
};

/**
 * Deletes all attendance records from the attendance collection.
 *
 * @returns {Promise<*>}
 */
const deleteAllAttendanceFromDb = async () => {
  return await getCollection('attendance').deleteMany({});
};

/**
 * Returns the user and their associated scope if the user is in the users collection, or null.
 *
 * @param email
 * @returns {Promise<{scope: *, email}|null>}
 */
const getUserByEmailFromDb = async (email) => {
  const user = await getCollection('users').findOne({ 'email': email });

  if (user) {
    return {
      email: email,
      scope: user.scope,
    };
  } else {
    return null;
  }
};


export {
  getEventsFromDb,
  getEventFromDb,
  saveEventToDb,
  setEventRecorded,
  deleteEventFromDb,
  deleteAllEventsFromDb,
  getMembersFromDb,
  getMemberFromDb,
  saveMemberToDb,
  deleteMemberFromDb,
  deleteAllMembersFromDb,
  getAttendanceFromDb,
  saveAttendanceToDb,
  deleteAttendanceFromDb,
  deleteAllAttendanceFromDb,
  getUserByEmailFromDb,
};
