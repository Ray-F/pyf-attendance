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
  
  console.log(req.body.ref)
  if (req.body.ref !== "refs/heads/master") {
    res.status(409).send("Push was not to master")
    return
  } else if (!req.body.head_commit.message.includes("[BOT] Update project version to")) {
    res.status(409).send("Latest commit was not a release commit")
    return
  }

  // new version number from GitHub
  const newVersion = req.body.head_commit.message.split(' ').slice(-1)[0]

  // Webhook secret
  const secret = process.env.GH_WEBHOOK_SECRET

  // Create comparisons to match
  const hmac = crypto.createHmac('sha256', secret)
  const digest = Buffer.from('sha256=' + hmac.update(payload).digest('hex'), 'utf8')
  const checksum = Buffer.from(signature, 'utf8')

  if (checksum.length === digest.length && crypto.timingSafeEqual(digest, checksum)) {
    res.status(200).send(`Successfully issued deployment command for release version ${newVersion}`)

    // Execute rebuild script
    console.log("\n\n[SERVER] Deploying new version:".yellow, newVersion.bold)
    shell.exec('../scripts/build.sh')
  } else {
    res.status(403).send("Secrets do not match")
  }
}

module.exports = {
  deploy
}
