const admin = require("firebase-admin");
const serviceAccount = require("./mdad-test-firebase-adminsdk-fbsvc-92b3845eed.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
