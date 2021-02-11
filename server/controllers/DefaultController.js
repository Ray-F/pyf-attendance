const crypto = require('crypto')
const config = require('../utils/Config')
const shell = require('shelljs')

const deploy = async (req, res, next) => {
  const payload = JSON.stringify(req.body)
  const signature = req.get('X-Hub-Signature-256')

  if (!payload || !signature) {
    res.status(404).send("Payload and/or signature missing")
    return
  }

  // Webhook secret
  const secret = process.env.GH_WEBHOOK_SECRET

  // Create comparisons to match
  const hmac = crypto.createHmac('sha256', secret)
  const digest = Buffer.from('sha256=' + hmac.update(payload).digest('hex'), 'utf8')
  const checksum = Buffer.from(signature, 'utf8')

  if (checksum.length === digest.length && crypto.timingSafeEqual(digest, checksum)) {
    res.status(200).send("Successfully issued deployment command")

    // Execute rebuild script
    shell.exec('echo "hello world!"')
  } else {
    res.status(403).send("Secrets do not match")
  }
}

module.exports = {
  deploy
}
