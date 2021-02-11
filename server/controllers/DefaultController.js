const crypto = require('crypto')
const config = require('../utils/Config')

const deploy = async (req, res, next) => {
  const payload = JSON.stringify(req.body)

  if (!payload) {
    res.status(404).send("Request body empty")
  }

  // Webhook secret
  const secret = process.env.GH_WEBHOOK_SECRET
  const githubSignature = req.get('X-Hub-Signature-256')
  const hmac = crypto.createHmac('sha256', secret)

  const digest = Buffer.from('sha256=' + hmac.update(payload).digest('hex'), 'utf8')
  const checksum = Buffer.from(githubSignature, 'utf8')

  if (checksum.length === digest.length && crypto.timingSafeEqual(digest, checksum)) {
    res.status(200).send("Successfully issued deployment command")

    // Successful, do something awesome with deployment
  } else {
    res.status(403).send("Secrets do not match")
  }
}

module.exports = {
  deploy
}
