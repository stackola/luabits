const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const faker = require("faker");
const shine = require("./shine");

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

exports.newProject = functions.https.onCall((data, context) => {
  //make a new project.

  const uid = context.auth.uid;
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    return { status: "error", text: "Not authenticated" };
  }

  //let uid = "10fIQQ4a6sblWn0OEHaYrNd2V2x1";
  //TODO: Check if user can create more.

  let userRef = db.collection("users").doc(uid);
  let name = data.name;
  let id = sanitize(name);
  let newProj = userRef.collection("projects").doc(id);
  return newProj
    .create({
      id: id,
      user: uid,
      name: name,
      time: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      //created project.
      return { status: "ok", newProject: id };
    })
    .catch(() => {
      return { status: "error", text: "Error creating project." };
    });
});

exports.addBucket = functions.https.onCall((data, context) => {
  //make a new project.

  const uid = context.auth.uid;
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    return { status: "error", text: "Not authenticated" };
  }

  //let uid = "10fIQQ4a6sblWn0OEHaYrNd2V2x1";
  //TODO: Check if user can create more.

  //get project
  //run tx
  let pid = data.pid;
  let name = data.name;
  name = sanitize(data.name);

  let userRef = db.collection("users").doc(uid);
  let projectRef = userRef.collection("projects").doc(pid);
  return db.runTransaction(transaction => {
    return transaction.get(projectRef).then(projectDoc => {
      let projectData = projectDoc.data();
      console.log(projectData);
      let buckets = projectData.buckets || [];
      if (buckets.includes(name)) {
        return { status: "error", text: "Bucket already exists." };
      }
      buckets.push(name);
      transaction.update(projectRef, { buckets: buckets });
      return { status: "ok" };
    });
  });
});

exports.addFunction = functions.https.onCall((data, context) => {
  const uid = context.auth.uid;
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    return { status: "error", text: "Not authenticated" };
  }

  //let uid = "10fIQQ4a6sblWn0OEHaYrNd2V2x1";
  //TODO: Check if user can create more.
  let pid = data.pid;
  let name = data.name;
  let source = data.source;
  let byteCode = data.byteCode;
  name = sanitize(data.name);
  //create new function.
  let userRef = db.collection("users").doc(uid);
  let projectRef = userRef.collection("projects").doc(pid);
  return projectRef
    .collection("functions")
    .doc(name)
    .create({
      name: name,
      project: pid,
      user: uid,
      source: source,
      byteCode: byteCode,
      time: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(res => {
      return { status: "ok", newFunction: name };
    })
    .catch(() => {
      return { status: "error" };
    });
});

exports.run = functions.https.onRequest((request, response) => {
  let uid = request.query.uid;
  let pid = request.query.pid;
  let func = request.query.func;
  let data = request.body;

  let userRef = db.collection("users").doc(uid);
  let projectRef = userRef.collection("projects").doc(pid);
  let funcRef = projectRef.collection("functions").doc(func);
  return projectRef.get().then(projObj => {
    return funcRef.get().then(funcObj => {
      let funcData = funcObj.data();
      let projData = projObj.data();
      console.log(projData.buckets);
      let env = {
        json: data,
        query: request.query,
        db: {
          get: (bucket, id, cb) => {
            //fetch id item from bucket.
            if (!projData.buckets.includes(bucket)) {
              console.log("illegal bucket");
              if (cb) {
                cb.call(null, false);
              } else {
                response.json({ status: "error", text: "Illegal bucket" });
              }
              return;
            }
            projectRef
              .collection("buckets")
              .doc("main")
              .collection(bucket)
              .doc(id)
              .get()
              .then(res => {
                let d = res.data();
                d.time = d.time.toDate();
                if (cb) {
                  cb.call(null, d);
                } else {
                  response.json({ status: "ok", data: d });
                }
              })
              .catch(() => {
                if (cb) {
                  cb.call(null, false);
                } else {
                  response.json({ status: "error" });
                }
              });
          },
          list: (bucket, cb) => {
            //fetch id item from bucket.
            if (!projData.buckets.includes(bucket)) {
              console.log("illegal bucket");
              if (cb) {
                cb.call(null, false);
              } else {
                response.json({ status: "error", text: "Illegal bucket" });
              }
              return;
            }
            projectRef
              .collection("buckets")
              .doc("main")
              .collection(bucket)
              .get()
              .then(res => {
                console.log(res);
                let d = res.docs.map(snap => {
                  let r = snap.data();
                  if (r.time && r.time.toDate) {
                    r = { ...r, time: r.time.toDate() };
                  }
                  return r;
                });
                console.log(d);
                if (cb) {
                  cb.call(null, d);
                } else {
                  response.json({ status: "ok", data: d });
                }
              })
              .catch(e => {
                if (cb) {
                  cb.call(null, false);
                } else {
                  response.json({ status: "error", code: e });
                }
              });
          },
          create: (bucket, data, cb) => {
            console.log("creating-");
            if (!projData.buckets.includes(bucket)) {
              console.log("illegal bucket");
              if (cb) {
                cb.call(null, false);
              } else {
                response.json({ status: "error", text: "Illegal bucket" });
              }
              return;
            }
            data = JSON.parse(JSON.stringify(data));
            delete data.__shine;
            let newEntry = projectRef
              .collection("buckets")
              .doc("main")
              .collection(bucket)
              .doc();
            data.id = newEntry.id;
            data.time = admin.firestore.FieldValue.serverTimestamp();
            newEntry
              .create(data)
              .then(() => {
                console.log("done");
                if (cb) {
                  cb.call(null, newEntry.id);
                } else {
                  console.log("sending default response.");
                  response.json({ status: "ok", newId: newEntry.id });
                }
              })
              .catch(e => {
                console.log("uff", e);
                if (cb) {
                  cb.call(null, false);
                } else {
                  response.json({ status: "error", text: "ID taken." });
                }
              });
          },
          update: (bucket, id, data, cb) => {
            console.log("updating-");
            if (!projData.buckets.includes(bucket)) {
              console.log("illegal bucket");
              if (cb) {
                cb.call(null, false);
              } else {
                response.json({ status: "error", text: "Illegal bucket" });
              }
              return;
            }
            data = JSON.parse(JSON.stringify(data));
            delete data.__shine;
            projectRef
              .collection("buckets")
              .doc("main")
              .collection(bucket)
              .doc(id)
              .update(data)
              .then(() => {
                console.log("done");
                if (cb) {
                  cb.call(null, newEntry.id);
                } else {
                  console.log("sending default response.");
                  response.json({ status: "ok" });
                }
              })
              .catch(e => {
                console.log("uff", e);
                if (cb) {
                  cb.call(null, false);
                } else {
                  response.json({ status: "error", text: "Error updating." });
                }
              });
          }
        },
        response: {
          send: d => {
            d = JSON.parse(JSON.stringify(d));
            delete d.__shine;
            response.json({ status: "ok", data: d });
          },
          error: d => {
            d = JSON.parse(JSON.stringify(d));
            delete d.__shine;
            response.json({ status: "error", data: d });
          }
        },
        utils: {
          log: message => {
            console.log("Message from Lua: " + message);
          }
        }
      };
      let vm = new shine.VM(env);
      try {
        vm.load(funcData.byteCode);
      } catch (e) {
        console.log("caught some.", e);
        response.json({ status: "error", code: e.toString() });
      }
    });
  });
  //fetch correct function.
});

exports.updateFunction = functions.https.onCall((data, context) => {
  const uid = context.auth.uid;
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    return { status: "error", text: "Not authenticated" };
  }

  //let uid = "10fIQQ4a6sblWn0OEHaYrNd2V2x1";
  //TODO: Check if user can create more.
  let pid = data.pid;
  let source = data.source;
  let byteCode = data.byteCode;
  name = sanitize(data.name);
  //create new function.
  let userRef = db.collection("users").doc(uid);
  let projectRef = userRef.collection("projects").doc(pid);
  return projectRef
    .collection("functions")
    .doc(name)
    .update({
      source: source,
      byteCode: byteCode,
      time: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(res => {
      return { status: "ok" };
    })
    .catch(() => {
      return { status: "error" };
    });
});

function sanitize(s) {
  return s
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9\-]/gi, "");
}
