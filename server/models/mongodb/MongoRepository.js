const mongoClient = require('./MongoConnection')
const ObjectId = require('mongodb').ObjectId
const config = require('../../utils/Config')
const { Attendance } = require('../Attendance')
const { Member } = require('../Member')


/**
 * Returns the collection instance for `collectionName`.
 *
 * @param {string} collectionName - The name of the collection to return.
 * @return {Collection}
 */
const getCollection = (collectionName) => {
  switch (collectionName) {
    case "members":
    case "events":
    case "attendance":
      return mongoClient.db(config.DB_NAME).collection(collectionName)
    default:
      throw new Error(`No collection "${collectionName}" found on "${config.DB_NAME}"`)
  }
}

/**
 * Get members from the member collection.
 *
 * @return {Promise<Member[]>}
 */
const getMembersFromDb = async () => {
  return (await getCollection("members").find({}).toArray())
    .map((member) => Member.fromDbo(member))
}

/**
 * Gets a single member with `memberId` from the members collection.
 *
 * @param {string} memberId - The ID of the member object to return.
 * @return {Promise<Member>}
 */
const getMemberFromDb = async (memberId) => {
  return Member.fromDbo(await getCollection("members").findOne({ "_id": ObjectId(memberId)}));
}

/**
 * Saves a `memberObject` to the members collection.
 *
 * If `memberObject._id` exists, this will edit the member instead of creating a new one.
 *
 * @param {Member} member - The member object to save to the members collection.
 * @return {Promise<*>}
 */
const saveMemberToDb = async (member) => {
  // If an member ID was passed to this function, then update existing record
  if (member.id) {
    member.id = ObjectId(member.id)

    const query = { _id: member.id }
    const update = { $set: member.toDbo() }
    const options = { upsert: false }

    return await getCollection("members").updateOne(query, update, options)
  } else {
    return await getCollection("members").insertOne(member.toDbo())
  }
}

/**
 * Deletes a member with `memberId` from the members collection.
 *
 * @param {string} memberId - The ID of the member to delete.
 * @return {Promise<*>}
 */
const deleteMemberFromDb = async (memberId) => {
  const query = {
    "_id": {
      $eq: ObjectId(memberId)
    }
  }

  return await getCollection("members").deleteOne(query)
}

/**
 * Deletes all members from the members collection.
 *
 * @return {Promise<*>}
 */
const deleteAllMembersFromDb = async () => {
  return await getCollection("members").deleteMany({})
}

/**
 * Gets all events from the events collection.
 *
 * @return {Promise<Object[]>}
 */
const getEventsFromDb = async () => {
  return await getCollection("events").find({}).toArray()
}

/**
 * Gets a single event with `eventId` from the events collection.
 *
 * @param {string} eventId - The ID of the event to return.
 * @return {Promise<Object>}
 */
const getEventFromDb = async (eventId) => {
  return await getCollection("events").findOne({ "_id": ObjectId(eventId) });
}

/**
 * Saves an event to the events collection.
 *
 * @param {Object} eventObject - The event object to save.
 * @return {Promise<*>}
 */
const saveEventToDb = async (eventObject) => {
  eventObject._id = ObjectId(eventObject._id)

  const query = { _id : eventObject._id }
  const update = { $set: eventObject }
  const options = { upsert: true }

  return await getCollection("events").updateOne(query, update, options)
}

/**
 * Deletes an event with `eventId` from the events collection.
 *
 * @param {string} eventId - The ID of the event to delete.
 * @return {Promise<*>}
 */
const deleteEventFromDb = async (eventId) => {
  const query = {
    "_id": {
      $eq: ObjectId(eventId)
    }
  }

  return await getCollection("events").deleteOne(query)
}

/**
 * Deletes all events from the events collection.
 *
 * @return {Promise<*>}
 */
const deleteAllEventsFromDb = async () => {
  return await getCollection("events").deleteMany({})
}

/**
 * Updates an event(s) to have the `event.hasAttendanceRecords` field set to `recorded` value.
 *
 * @param {string | null} [eventId] - The ID of the event to change attendance records for.
 * @param {Boolean} [recorded] - Sets the status of the recorded field.
 * @return {Promise<*>}
 */
const setEventRecorded = async (eventId = null, recorded = true) => {
  const query = {
    $set: { hasAttendanceRecords: recorded }
  }

  if (eventId) {
    const filter = { _id: ObjectId(eventId) }
    return await getCollection("events").updateOne(filter, query)
  }

  return await getCollection("events").updateMany({}, query)
}

/**
 * Gets attendance records from the attendance collection.
 *
 * @param {string | null} [eventId] - The ID of the event to return attendance records for.
 * @param {string | null} [memberId] - The ID of the member to return attendance records for.
 * @return {Promise<Attendance[]>}
 */
const getAttendanceFromDb = async (eventId = null, memberId = null) => {
  let attendanceDboObjects
  if (eventId) {
    attendanceDboObjects = await getCollection("attendance")
      .find({ "event.eventId": ObjectId(eventId) })
      .sort({'_id' : -1})
      .toArray()
  } else if (memberId) {
    attendanceDboObjects = await getCollection("attendance")
      .find({ "member.memberId": ObjectId(memberId) })
      .sort({'_id' : -1})
      .toArray()
  } else {
    attendanceDboObjects = await getCollection("attendance").find({}).sort({'_id' : -1}).toArray()
  }

  return attendanceDboObjects.map((dboObject) => Attendance.fromDbo(dboObject))
}

/**
 * Saves attendance records to attendance collection.
 *
 * @param {Attendance[]} attendanceArray - Array of attendance objects to save.
 * @return {Promise<*>}
 */
const saveAttendanceToDb = async (attendanceArray) => {
  const attendanceDboObjects = attendanceArray.map((attendance) => attendance.toDbo())
  return await getCollection("attendance").insertMany(attendanceDboObjects)
}

/**
 * Deletes attendance records for an event or member from the attendance collection.
 *
 * @return {Promise<*>}
 */
const deleteAttendanceFromDb = async (eventId = null, memberId = null) => {
  let query

  if (eventId) {
    query = {
      "event.eventId": {
        $eq: ObjectId(eventId)
      }
    }
  } else if (memberId) {
    query = {
      "member.memberId": {
        $eq: ObjectId(memberId)
      }
    }
  } else {
    throw new Error("IllegalArgumentException: Unspecified event or member Id to delete attendance")
  }

  return await getCollection("attendance").deleteMany(query)
}

/**
 * Deletes all attendance records from the attendance collection.
 *
 * @return {Promise<*>}
 */
const deleteAllAttendanceFromDb = async () => {
  return await getCollection("attendance").deleteMany({})
}

module.exports = {
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
  deleteAllAttendanceFromDb
}