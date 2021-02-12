const {
  getMembersFromDb,
  getMemberFromDb,
  saveMemberToDb,
  deleteMemberFromDb,
  deleteAllMembersFromDb,
  deleteAttendanceFromDb,
  deleteAllAttendanceFromDb
} = require("../models/mongodb/MongoRepository");

const { Member } = require('../models/Member')


const getMembers = async (req, res, next) => {
  const members = req.query.memberId ? (await getMemberFromDb(req.query.memberId)).toDto()
    : (await getMembersFromDb()).map((member) => (member.toDto()))
  res.json(members)
}

const saveMember = async (req, res, next) => {
  await saveMemberToDb(Member.fromDto(req.body))
  res.sendStatus(200)
}

const deleteMember = async (req, res, next) => {
  let memberId = req.query.memberId

  if (memberId) {
    const deleteResult = await deleteMemberFromDb(memberId)
    const deleteAttendanceResult = await deleteAttendanceFromDb(null, memberId)

    res.status(200).send(`Delete successful: ${deleteResult.result.n} member(s) and ${deleteAttendanceResult.result.n} attendance record(s) were wiped.`)
  } else {
    res.status(404).send("No member Id specified! No records deleted").end()
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