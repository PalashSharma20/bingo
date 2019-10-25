import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"

const db = firebase
  .initializeApp({
    apiKey: "AIzaSyBX9WISm5PcZ_lEzDpT3hS8eR-ZK-aLQkI",
    authDomain: "p-bingo.firebaseapp.com",
    databaseURL: "https://p-bingo.firebaseio.com",
    projectId: "p-bingo",
    storageBucket: "",
    messagingSenderId: "382911421532"
  })
  .database()

const auth = firebase.auth()

const gamesRef = db.ref(`games`)

export { auth, gamesRef }
