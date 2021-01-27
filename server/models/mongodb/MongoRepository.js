const mongoClient = require('./MongoConnection')
const ObjectId = require('mongodb').ObjectId


const memberCollection = () => {
  return mongoClient.db("pyf-attendance").collection("members")
}

const eventCollection = () => {
  return mongoClient.db("pyf-attendance").collection("events")
}

const attendanceCollection = () => {
  return mongoClient.db("pyf-attendance").collection("attendance")
}

/**
 * Database access functions – depending on the parameters passed, this will determine the search return.
 */
const getMembersFromDb = async (memberId = null) => {
  if (memberId) return await memberCollection().findOne({ "_id": ObjectId(memberId) }).toObject();
  return await memberCollection().find({}).toArray();
}

/**
 * Saves a member to the database
 * TODO: Change to update member with upsert on. Make member return with object ID
 */
const saveMemberToDb = async (memberObject) => {
  return await memberCollection().insertOne(memberObject)
}

const deleteMemberFromDb = async (memberId) => {
  const query = {
    "_id": {
      $eq: ObjectId(memberId)
    }
  }

  return await memberCollection().deleteOne(query)
}

const deleteAllMembersFromDb = async () => {
  return await memberCollection().deleteMany({})
}

/**
 * Gets all events from database.
 */
const getEventsFromDb = async (eventId = null) => {
  if (eventId) return await eventCollection().findOne({ "_id": ObjectId(eventId) });
  return await eventCollection().find({}).toArray()
}

const saveEventToDb = async (eventObject) => {
  return await eventCollection().insertOne(eventObject)
}

const deleteEventFromDb = async (eventId) => {
  const query = {
    "_id": {
      $eq: ObjectId(eventId)
    }
  }

  return await eventCollection().deleteOne(query)
}

const deleteAllEventsFromDb = async () => {
  return await eventCollection().deleteMany({})
}

const setEventRecorded = async (eventId = null, recorded = true) => {
  const query = {
    $set: { hasAttendanceRecords: recorded }
  }

  if (eventId) {
    const filter = { _id: ObjectId(eventId) }
    return await eventCollection().updateOne(filter, query)
  }

  return await eventCollection().updateMany({}, query)
}

/**
 * Attendance functions.
 */
const getAttendanceFromDb = async (eventId = null, memberId = null) => {
  if (eventId) {
    return await attendanceCollection().find({ "event.eventId": ObjectId(eventId) }).sort({'_id' : -1}).toArray()
  } else if (memberId) {
    return await attendanceCollection().find({ "member.memberId": ObjectId(memberId) }).sort({'_id' : -1}).toArray()
  } else {
    return await attendanceCollection().find({}).sort({'_id' : -1}).toArray()
  }
}

const saveAttendanceToDb = async (recordsArray) => {
  return await attendanceCollection().insertMany(recordsArray)
}

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

  return await attendanceCollection().deleteMany(query)
}

const deleteAllAttendanceFromDb = async () => {
  return await attendanceCollection().deleteMany({})
}

module.exports = {
  getEventsFromDb, saveEventToDb, setEventRecorded, deleteEventFromDb, deleteAllEventsFromDb,
  getMembersFromDb, saveMemberToDb, deleteMemberFromDb, deleteAllMembersFromDb,
  getAttendanceFromDb, saveAttendanceToDb, deleteAttendanceFromDb, deleteAllAttendanceFromDb
}