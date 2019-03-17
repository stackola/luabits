import firebase from "lib/firebase";
import firebase2 from "firebase";
import axios from "axios";

const sendNewProject = firebase.functions().httpsCallable("newProject");
const sendAddBucket = firebase.functions().httpsCallable("addBucket");
const sendAddFunction = firebase.functions().httpsCallable("addFunction");
const sendUpdateFunction = firebase.functions().httpsCallable("updateFunction");

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
  return axios.post("http://178.128.176.56:3000/", { source: source });
}
