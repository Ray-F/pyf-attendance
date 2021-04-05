import crypto from 'crypto';
import config from '../utils/Config';
import shell from 'shelljs';
import { getUserByEmailFromDb } from '../models/mongodb/MongoRepository';

/**
 * Automatically deploys the latest changes to the web server. This function will only return 200 success if run
 * on the web server, and when sent a request via Github Webhook.
 *
 * @param {Object} req.body - The Github payload.
 * @param {string} req.body.head_commit - The latest commit to the repository on GitHub.
 * @param {string} req.body.ref - Which branch the action was made inside.
 * @param {*} req.get - Function to get the specified value from the request headers.
 */
const deploy = async (req, res, next) => {
  const payload = JSON.stringify(req.body);
  const signature = req.get('X-Hub-Signature-256');

  if (!payload || !signature) {
    res.status(404).send('Payload and/or signature missing');
    return;
  }

  if (req.body.ref !== 'refs/heads/master') {
    res.status(409).send('Push was not to master');
    return;
  } else if (!req.body.head_commit.message.includes('[BOT] Update project version to')) {
    res.status(409).send('Latest commit was not a release commit');
    return;
  }

  // new version number from GitHub
  const newVersion = req.body.head_commit.message.split(' ').slice(-1)[0];

  // Webhook secret
  const secret = process.env.GH_WEBHOOK_SECRET;

  // Create comparisons to match
  const hmac = crypto.createHmac('sha256', secret);
  const digest = Buffer.from('sha256=' + hmac.update(payload).digest('hex'), 'utf8');
  const checksum = Buffer.from(signature, 'utf8');

  if (checksum.length === digest.length && crypto.timingSafeEqual(digest, checksum)) {
    res.status(200).send(`Successfully issued deployment command for release version ${newVersion}`);

    // Execute rebuild script
    console.log('\n\n[SERVER] Deploying new version:'.yellow, newVersion.bold);
    const shellResp = shell.exec('../scripts/build.sh');

    if (shellResp.code === 0) {
      // Exit this current instance of the server so that PM2 can automatically restart
      process.exit(0);
    } else {
      console.error('[SERVER] Failed to build automatically through webhook'.red);
    }

  } else {
    res.status(403).send('Secrets do not match');
  }
};

/**
 * Resets the development database to have the same information as production database.
 */
const resetDevelopmentDatabase = async (req, res, next) => {
  // Script arguments
  const PROD_URI = config.DatabaseUri.PROD;
  const DEV_URI = config.DatabaseUri.DEV;
  const currentDate = Date.now();

  // Execute script file
  const shellResp = shell.exec(`../scripts/reset-dev-db.sh "${PROD_URI}" "${DEV_URI}" "${currentDate}"`);

  if (shellResp.code === 0) {
    res.status(200).send('200: Successfully reset development database to match production environment!');
  } else {
    res.status(500).send(`500: Error when executing shell script. Exit code ${shellResp.code}`);
  }
};

/**
 * Checks if a user is authorised to use this (pyf-attendance) resource.
 */
const authorize = async (req, res, next) => {
  const email = req.body.verifiedEmail;

  if (email) {
    const user = await getUserByEmailFromDb(email);

    if (user) {
      res.status(200).json({ scope: user.scope });
    } else {
      res.status(403).json({});
    }
  }
};


export {
  deploy,
  resetDevelopmentDatabase,
  authorize,
};
