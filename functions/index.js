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

exports.getPublicFunction = functions.https.onCall((data, context) => {
  let uid = data.uid;
  let pid = data.pid;
  let fid = data.fid;
  let projectRef = db
    .collection("users")
    .doc(uid)
    .collection("projects")
    .doc(pid);
  let funcRef = projectRef.collection("functions").doc(fid);

  return projectRef.get().then(pSnap => {
    let pData = pSnap.data();
    return funcRef.get().then(fSnap => {
      let fData = fSnap.data();
      if (pData && fData && (fData.public || pData.public)) {
        return { status: "ok", func: fData, proj: pData };
      } else {
        return { status: "error", text: "Function not found or not public." };
      }
    });
  });
});

exports.getPublicProject = functions.https.onCall((data, context) => {
  let uid = data.uid;
  let pid = data.pid;
  let projectRef = db
    .collection("users")
    .doc(uid)
    .collection("projects")
    .doc(pid);

  return projectRef.get().then(pSnap => {
    let pData = pSnap.data();
    if (pData && pData.public) {
      return { status: "ok", proj: pData };
    } else {
      return { status: "error", text: "Project not found or not public." };
    }
  });
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
    projectRef
      .get()
      .then(projObj => {
        funcRef
          .get()
          .then(funcObj => {
            let funcData = funcObj.data();
            let projData = projObj.data();
            //console.log(parseToLua(data));
            console.log(projData.buckets);
            let env = {
              req: {
                json: parseToLua(data),
                query: parseToLua(request.query)
              },
              db: {
                list: (bucket, options, cb) => {
                  if (!options) {
                    options = {};
                  } else {
                    options = parseAndReturn(options);
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
                        options.where[0],
                        options.where[1],
                        options.where[2]
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
                      cb.call(null, parseToLua(ret));
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
                  //console.log("get called");
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
                      //console.log("good promise!");
                      let d = res.data();
                      if (d.time) {
                        d.time = d.time.toDate();
                      }
                      if (cb) {
                        //console.log(parseToLua(d));
                        cb.call(null, parseToLua(d));
                      } else {
                        response.json({ status: "ok", data: { item: d } });
                      }
                    })
                    .catch(e => {
                      console.log("ooops", e);
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
                  //console.log(data);
                  data = parseAndReturn(data);
                  data.time = new Date();
                  let newEntry = projectRef
                    .collection("buckets")
                    .doc("main")
                    .collection(bucket)
                    .doc();
                  data.id = newEntry.id;
                  newEntry
                    .create(data)
                    .then(() => {
                      //console.log("done");
                      if (cb) {
                        cb.call(null, data);
                      } else {
                        //console.log("sending default response.");
                        response.json({ status: "ok", data: { item: data } });
                      }
                    })
                    .catch(e => {
                      //console.log("uff", e);
                      if (cb) {
                        cb.call(null, false);
                      } else {
                        response.json({
                          status: "error",
                          data: { e }
                        });
                      }
                    });
                },
                update: (bucket, id, data, cb) => {
                  //console.log("updating-");
                  if (!projData.buckets.includes(bucket)) {
                    //console.log("illegal bucket");
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
                  data = parseAndReturn(data);
                  projectRef
                    .collection("buckets")
                    .doc("main")
                    .collection(bucket)
                    .doc(id)
                    .update(data)
                    .then(() => {
                      //console.log("done");
                      if (cb) {
                        cb.call(null, true);
                      } else {
                        //console.log("sending default response.");
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
                send: d => {
                  //console.log(d, "!!");
                  //d = parseAndReturn(d);

                  response.send(d);
                },
                json: d => {
                  d = parseAndReturn(d);
                  response.json(d);
                },
                redirect: path => {
                  response.redirect(path);
                },
                ok: d => {
                  d = parseAndReturn(d);
                  response.json({ status: "ok", data: d });
                },
                error: d => {
                  d = parseAndReturn(d);
                  response.json({ status: "error", data: d });
                }
              },
              utils: {
                log: (message, cb) => {
                  //save log entry for function to db.

                  message = parseAndReturn(message);
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
          })
          .catch(e => {
            response.json({ status: "error", data: { code: e.toString() } });
          });
      })
      .catch(e => {
        response.json({ status: "error", data: { code: e.toString() } });
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
  let newData = {
    pid: pid
  };
  if (data.source) {
    newData.source = data.source;
  }
  if (data.byteCode) {
    newData.byteCode = data.byteCode;
  }
  newData.public = data.public || false;
  let name = sanitize(data.name);
  newData.time = new Date();
  //create new function.
  let userRef = db.collection("users").doc(uid);
  let projectRef = userRef.collection("projects").doc(pid);
  return projectRef
    .collection("functions")
    .doc(name)
    .update(newData)
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

function identify(elem) {
  if (typeof elem === "string") {
    return "string";
  }
  if (typeof elem === "boolean") {
    return "boolean";
  }
  if (typeof elem === "number") {
    return "number";
  }
  if (typeof elem === "object") {
    if (Array.isArray(elem)) {
      return "array";
    }
    if (Object.keys(elem).length > 0 && !elem.__shine) {
      return "object";
    }
    if (Object.keys(elem).length > 1 && elem.__shine) {
      return "luaobject";
    }
    if (
      elem.__shine &&
      elem.__shine.numValues &&
      elem.__shine.numValues.length > 1
    ) {
      return "luaarray";
    }
  }

  return "neither";
}

function parseAndReturn(elem) {
  if (typeof elem == "undefined") {
    return undefined;
  }
  if (elem == null) {
    return null;
  }
  elem = JSON.parse(JSON.stringify(elem));
  if (identify(elem) == "number") {
    return elem;
  }
  if (identify(elem) == "string") {
    return elem;
  }
  if (identify(elem) == "boolean") {
    return elem;
  }
  if (identify(elem) == "object") {
    if (Object.keys(elem).length == 0) {
      return {};
    }
    let tmp = {};
    Object.keys(elem).map(k => {
      let v = elem[k];
      tmp[k] = parseAndReturn(v);
    });
    return tmp;
  }
  if (identify(elem) == "array") {
    let tmp = elem
      .filter(v => {
        return v != "___12456luaNull___";
      })
      .map(v => {
        return parseAndReturn(v);
      });
    return tmp;
  }
  if (identify(elem) == "luaobject") {
    let tmp = elem;
    delete tmp.__shine;
    Object.keys(tmp).map(k => {
      let v = tmp[k];
      tmp[k] = parseAndReturn(v);
    });
    return tmp;
  }
  if (identify(elem) == "luaarray") {
    let tmp = elem.__shine.numValues.slice(1).map(v => {
      return parseAndReturn(v);
    });
    return tmp;
  }

  //console.log(elem);
  return {};
}

function parseToLua(elem) {
  //console.log("parsing " + elem);
  if (typeof elem == "undefined") {
    return undefined;
  }
  if (elem == null) {
    return null;
  }
  elem = JSON.parse(JSON.stringify(elem));
  if (identify(elem) == "number") {
    return elem;
  }
  if (identify(elem) == "string") {
    return elem;
  }
  if (identify(elem) == "boolean") {
    return elem;
  }
  if (identify(elem) == "object") {
    let tmp = {};
    Object.keys(elem).map(k => {
      let v = elem[k];
      tmp[k] = parseToLua(v);
    });
    return tmp;
  }
  if (identify(elem) == "array") {
    let tmp = ["___12456luaNull___"].concat(
      elem.map(v => {
        return parseToLua(v);
      })
    );
    return tmp;
  }
  //console.log(elem);
  return {};
}
