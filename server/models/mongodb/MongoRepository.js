const mongoClient = require('./MongoConnection')
const ObjectId = require('mongodb').ObjectId

/**
 * Database access functions – depending on the parameters passed, this will determine the search return.
 *
 * getMembersFromDb
 * getEventsFromDb
 * getAttendanceFromDb
 */
const getMembersFromDb = async (memberId = null) => {
  const memberCollection = mongoClient.db("pyf-attendance").collection("members");

  if (memberId) {
    return await memberCollection.findOne({ "_id": ObjectId(memberId) }).toObject();
  } else {
    return await memberCollection.find({}).toArray();
  }
}

const getEventsFromDb = async (eventId = null) => {
  const eventCollection = mongoClient.db("pyf-attendance").collection("events");

  if (eventId) {
    return await eventCollection.findOne({ "_id": ObjectId(eventId) });
  } else {
    return await eventCollection.find({}).toArray()
  }
}

const saveEventToDb = async (eventObject) => {
  const eventCollection = mongoClient.db("pyf-attendance").collection("events");
  const res = eventCollection.insertOne(eventObject)
}

const getAttendanceFromDb = async (eventId = null, memberId = null) => {
  const attendanceCollection = mongoClient.db("pyf-attendance").collection("attendance")

  let queriedResult

  if (eventId) {
    queriedResult = await attendanceCollection.find({ "event.eventId": ObjectId(eventId) }).toArray()
  } else if (memberId) {
    queriedResult = await attendanceCollection.find({ "member.memberId": ObjectId(memberId) }).toArray()
  } else {
    queriedResult = await attendanceCollection.find({}).toArray()
  }

  return queriedResult
}

const saveAttendanceToDb = async (recordsArray) => {
  const attendanceCollection = mongoClient.db("pyf-attendance").collection("attendance")

  const res = attendanceCollection.insertMany(recordsArray)
}

module.exports = {
  getMembersFromDb, getEventsFromDb, getAttendanceFromDb, saveAttendanceToDb, saveEventToDb
}