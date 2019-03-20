// Config file
import firebase from "firebase/app";
import "firebase/functions";
import "firebase/firestore";
var config = {
  apiKey: "AIzaSyCZ1lIT4TLykoaSYLHx_jrhllxewX2MNQI",
  authDomain: "luabits-a4c52.firebaseapp.com",
  databaseURL: "https://luabits-a4c52.firebaseio.com",
  projectId: "luabits-a4c52",
  storageBucket: "luabits-a4c52.appspot.com",
  messagingSenderId: "464053184148"
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());

//export default firebase.app();
