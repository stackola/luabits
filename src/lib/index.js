import firebase from "lib/firebase";
import axios from "axios";

const sendNewProject = firebase.functions().httpsCallable("newProject");
const sendAddBucket = firebase.functions().httpsCallable("addBucket");
const sendAddFunction = firebase.functions().httpsCallable("addFunction");
const sendUpdateFunction = firebase.functions().httpsCallable("updateFunction");

export function isDev() {
  return process.env.NODE_ENV !== "production";
}

export function newProject(payload) {
  return sendNewProject(payload);
}
export function addBucket(payload) {
  return sendAddBucket(payload);
}

export function getUID() {
  return firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
}

export function addFunction(payload) {
  return sendAddFunction(payload);
}

export function updateFunction(payload) {
  return sendUpdateFunction(payload);
}

export function compileLua(source) {
  return axios.post("https://compile.luabits.com/", { source: source });
}

export function sanitize(s) {
  return s
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9\-]/gi, "");
}

export function hasGoogle() {
  let res =
    firebase.auth().currentUser.providerData.map(pd => {
      return pd.providerId == "google.com";
    }).length > 0;
  return res;
}
