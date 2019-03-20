const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const faker = require("faker");
const shine = require("./shine");
const cors = require("cors")({
  origin: true
});

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
        time: new Date()
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
      time: new Date()
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
      time: new Date()
    })
    .then(res => {
      return { status: "ok", newFunction: name };
    })
    .catch(() => {
      return { status: "error" };
    });
});

exports.run = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    let uid = request.query.uid;
    let pid = request.query.pid;
    let func = request.query.func;
    let data = request.body;

    let userRef = db.collection("users").doc(uid);
    let projectRef = userRef.collection("projects").doc(pid);
    let funcRef = projectRef.collection("functions").doc(func);
    projectRef.get().then(projObj => {
      funcRef.get().then(funcObj => {
        let funcData = funcObj.data();
        let projData = projObj.data();
        console.log(projData.buckets);
        let env = {
          req: {
            json: data,
            query: request.query
          },
          db: {
            list: (bucket, options, cb) => {
              if (!options) {
                options = {};
              }
              if (!projData.buckets.includes(bucket)) {
                console.log("illegal bucket");
                if (cb) {
                  cb.call(null, false);
                } else {
                  response.json({
                    status: "error",
                    data: { text: "Illegal bucket" }
                  });
                }
                return;
              }

              let pageSize = 10;
              if (options.pageSize >= 1 && options.pageSize <= 25) {
                pageSize = options.pageSize;
              }

              let q = projectRef
                .collection("buckets")
                .doc("main")
                .collection(bucket)
                .limit(pageSize);

              if (options.order) {
                q = q.orderBy(options.order[0], options.order[1]);
              } else {
                if (options.where) {
                  console.log(options.where);
                  q = q.where(
                    options.where.__shine.numValues[1],
                    options.where.__shine.numValues[2],
                    options.where.__shine.numValues[3]
                  );
                } else {
                  q = q.orderBy("time", "desc");
                }
              }

              let processThat = snap => {
                let docs = snap.docs;
                let ret = {};
                if (docs.length == pageSize) {
                  ret.pageToken = docs[docs.length - 1].id;
                }

                docs = docs.map(d => {
                  d = d.data();
                  if (d.time) {
                    d.time = d.time.toDate();
                  }
                  return d;
                });
                ret.items = docs;
                if (cb) {
                  cb.call(null, ret);
                } else {
                  response.json({ status: "ok", data: ret });
                }
              };

              if (options.pageToken) {
                projectRef
                  .collection("buckets")
                  .doc("main")
                  .collection(bucket)
                  .doc(options.pageToken)
                  .get()
                  .then(pageCursor => {
                    q.startAfter(pageCursor)
                      .get()
                      .then(snap => {
                        processThat(snap);
                      })
                      .catch(() => {
                        if (cb) {
                          cb.call(null, false);
                        } else {
                          response.json({
                            status: "error",
                            data: { text: "Couldn't get items." }
                          });
                        }
                      });
                  })
                  .catch(() => {
                    if (cb) {
                      cb.call(null, false);
                    } else {
                      response.json({
                        status: "error",
                        data: { text: "Problem with pageToken" }
                      });
                    }
                  });
              } else {
                q.get()
                  .then(snap => {
                    processThat(snap);
                  })
                  .catch(() => {
                    if (cb) {
                      cb.call(null, false);
                    } else {
                      response.json({
                        status: "error",
                        data: { text: "Couldn't get items." }
                      });
                    }
                  });
              }
            },
            get: (bucket, id, cb) => {
              //fetch id item from bucket.
              if (!projData.buckets.includes(bucket)) {
                console.log("illegal bucket");
                if (cb) {
                  cb.call(null, false);
                } else {
                  response.json({
                    status: "error",
                    data: { text: "Illegal bucket" }
                  });
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
                  if (d.time) {
                    d.time = d.time.toDate();
                  }
                  if (cb) {
                    cb.call(null, d);
                  } else {
                    response.json({ status: "ok", data: { item: d } });
                  }
                })
                .catch(() => {
                  if (cb) {
                    cb.call(null, false);
                  } else {
                    response.json({
                      status: "error",
                      data: { text: "Error getting item" }
                    });
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
                  response.json({
                    status: "error",
                    data: { text: "Illegal bucket" }
                  });
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
              data.time = new Date();
              newEntry
                .create(data)
                .then(() => {
                  console.log("done");
                  if (cb) {
                    cb.call(null, newEntry.id);
                  } else {
                    console.log("sending default response.");
                    response.json({ status: "ok", data: { item: data } });
                  }
                })
                .catch(e => {
                  console.log("uff", e);
                  if (cb) {
                    cb.call(null, false);
                  } else {
                    response.json({
                      status: "error",
                      data: { text: "ID Taken." }
                    });
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
                  response.json({
                    status: "error",
                    data: { text: "Illegal bucket" }
                  });
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
                    response.json({
                      status: "error",
                      data: { text: "Error updating item." }
                    });
                  }
                });
            }
          },
          res: {
            send: s => {
              s = JSON.parse(JSON.stringify(s));
              delete s.__shine;
              response.send(s);
            },
            json: d => {
              d = JSON.parse(JSON.stringify(d));
              delete d.__shine;
              response.json(d);
            },
            redirect: path => {
              response.redirect(path);
            },
            ok: d => {
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
            log: (message, cb) => {
              //save log entry for function to db.
              let logEntry = funcRef.collection("logs").doc();
              logEntry
                .set({
                  message: message,
                  time: new Date(),
                  func: func,
                  id: logEntry.id
                })
                .then(() => {
                  cb && cb.call(null, true);
                })
                .catch(() => {
                  cb && cb.call(null, false);
                });
            }
          }
        };
        let vm = new shine.VM(env);
        try {
          vm.load(funcData.byteCode);
        } catch (e) {
          console.log("caught some.", e);
          response.json({ status: "error", data: { code: e.toString() } });
        }
      });
    });
  });
  //fetch correct function.
});

exports.makeUserTest = functions.https.onRequest((request, response) => {
  admin
    .auth()
    .createUser({
      uid: "some-uid32",
      password: "testpw"
    })
    .then(function(userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord);
      response.json(userRecord);
    })
    .catch(function(error) {
      console.log("Error creating new user:", error);
    });
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
      time: new Date()
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
