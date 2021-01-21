const { getMembersFromDb } = require("../models/mongodb/MongoRepository");


const getMembers = async (req, res, next) => {
  const members = await getMembersFromDb();

  const membersWithIndex = members.map((item, index) => {
    item.number = index
    return item
  });

  res.json(membersWithIndex)
}

module.exports = {
  getMembers
}