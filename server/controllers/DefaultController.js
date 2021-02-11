// use if requiring a mongo connection
// const mongoClient = require('../models/MongoConnection');

const deploy = async (req, res, next) => {
  console.log(req)
  res.send("Hello, world!");
}

module.exports = {
  deploy
}
