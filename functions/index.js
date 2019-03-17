const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
var faker = require("faker");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.exec = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!!");
});

let defaultBalance = 10000;
exports.makeUser = functions.auth.user().onCreate(user => {
  let uid = user.uid;
  // make a user record.
  var randomName = faker.internet.userName();
  return db
    .collection("users")
    .doc(uid)
    .set(
      {
        id: uid,
        name: randomName,
        credits: defaultBalance,
        time: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );
});
