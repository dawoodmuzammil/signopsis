// FIREBASE SETUP
var admin = require("firebase-admin");

var serviceAccount = require("../firebase_adminsdk.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://node-signchat.firebaseio.com"
});

const db = admin.firestore();

module.exports = db;