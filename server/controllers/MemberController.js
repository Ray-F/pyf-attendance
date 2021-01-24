const {
  getMembersFromDb, saveMemberToDb,
  deleteMemberFromDb, deleteAllMembersFromDb,
  deleteAttendanceFromDb, deleteAllAttendanceFromDb
} = require("../models/mongodb/MongoRepository");


const getMembers = async (req, res, next) => {
  const members = await getMembersFromDb();

  const membersWithIndex = members.map((item, index) => {
    item.number = index
    return item
  });

  res.json(membersWithIndex)
}

const saveMember = async (req, res, next) => {
  let memberObject = req.body
  memberObject.startDate = new Date(memberObject.startDate)
  memberObject.leadershipStartDate = new Date(memberObject.leadershipStartDate)
  await saveMemberToDb(memberObject)

  res.sendStatus(200)
}

const deleteMember = async (req, res, next) => {
  let memberId = req.query.memberId

  if (memberId === undefined) {
    res.status(404).send("No member Id specified! No records deleted").end()
  } else {
    const deleteResult = await deleteMemberFromDb(memberId)
    const deleteAttendanceResult = await deleteAttendanceFromDb(null, memberId)

    res.status(200).send(`Delete successful: ${deleteResult.result.n} member(s) and ${deleteAttendanceResult.result.n} attendance record(s) were wiped.`)
  }
}

const resetMembers = async (req, res, next) => {
  const deleteResult = await deleteAllMembersFromDb()
  const deleteAttendanceResult = await deleteAllAttendanceFromDb()

  res.status(200).send(`Delete successful: ${deleteResult.result.n} members and ${deleteAttendanceResult.result.n} attendance records were wiped.`)
}

module.exports = {
  getMembers, saveMember, deleteMember, resetMembers
}