import {
  deleteAllAttendanceFromDb, deleteAttendanceFromDb, deleteAllMembersFromDb, deleteMemberFromDb, getMemberFromDb,
  getMembersFromDb, saveMemberToDb,
} from '../infrastructure/repository/MongoRepository';
import { Member } from '../models/Member';

/**
 * Gets all members or a single member (if `req.query.memberId` is specified).
 *
 * @param {string} [req.query.memberId] - The ID of the member to get.
 */
const getMembers = async (req, res, next) => {
  const members = req.query.memberId ? (await getMemberFromDb(req.query.memberId)).toDto()
    : (await getMembersFromDb()).map((member) => (member.toDto()));
  res.json(members);
};

/**
 * Saves a member.
 *
 * @param {string} [req.body._id] - The ID of the member.
 * @param {string} req.body.fullName - The name of the member.
 * @param {string} req.body.startDate - The starting date of the member.
 * @param {string} [req.body.endDate] - The ending date of the member.
 */
const saveMember = async (req, res, next) => {
  await saveMemberToDb(new Member(req.body._id,
                                  req.body.fullName,
                                  new Date(req.body.startDate),
                                  req.body.endDate ? new Date(req.body.endDate) : undefined));
  res.sendStatus(200);
};

/**
 * Deletes the specified member along with their attendance information.
 *
 * @param {string} req.query.memberId - The ID of the member to delete.
 */
const deleteMember = async (req, res, next) => {
  let memberId = req.query.memberId;

  if (memberId) {
    const deleteResult = await deleteMemberFromDb(memberId);
    const deleteAttendanceResult = await deleteAttendanceFromDb(null, memberId);

    res.status(200).send(`Delete successful: ${deleteResult.result.n} member(s) and ${deleteAttendanceResult.result.n} attendance record(s) were wiped.`);
  } else {
    res.status(404).send('No member Id specified! No records deleted').end();
  }
};

/**
 * Deletes all members along with their attendance records.
 */
const resetMembers = async (req, res, next) => {
  const deleteResult = await deleteAllMembersFromDb();
  const deleteAttendanceResult = await deleteAllAttendanceFromDb();

  res.status(200).send(`Delete successful: ${deleteResult.result.n} members and ${deleteAttendanceResult.result.n} attendance records were wiped.`);
};


export {
  getMembers,
  saveMember,
  deleteMember,
  resetMembers,
};
