const MongoClient = require('mongodb').MongoClient
const config = require('../../utils/Config')

// Define a new mongo client with the right database URI as determined by environment
const client = new MongoClient(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect(err => {
  if (err) {
    throw new Error(err.message)
  } else {
    const username = client.s.url.substring(
      client.s.url.indexOf('/') + 2,
      client.s.url.lastIndexOf(':')
    )
    const dbName = client.s.options.dbName

    console.info(`[SERVER] MongoDB connected with user ${username.yellow} on ${dbName.yellow}`)
  }
})


module.exports = client
