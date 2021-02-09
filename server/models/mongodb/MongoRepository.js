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
  if (memberId) return await memberCollection().findOne({ "_id": ObjectId(memberId) });
  return await memberCollection().find({}).toArray();
}

/**
 * Saves a member to the database.
 */
const saveMemberToDb = async (memberObject) => {

  console.log(memberObject)

  if (memberObject._id === null) {
    delete memberObject._id
  } else {
    memberObject._id = ObjectId(memberObject._id)
  }

  const query = { _id : memberObject._id }
  const update = { $set: memberObject }
  const options = { upsert: true }

  return await memberCollection().updateOne(query, update, options)
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
 *
 * @returns Promise<Array>
 */
const getEventsFromDb = async (eventId = null) => {
  if (eventId) return await eventCollection().findOne({ "_id": ObjectId(eventId) });
  return await eventCollection().find({}).toArray()
}

const saveEventToDb = async (eventObject) => {
  eventObject._id = ObjectId(eventObject._id)

  const query = { _id : eventObject._id }
  const update = { $set: eventObject }
  const options = { upsert: true }

  return await eventCollection().updateOne(query, update, options)
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