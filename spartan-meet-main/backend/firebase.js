// import initializeApp from "../node_modules/firebase/app";

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getDatabase,
  set,
  ref,
  update,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBx7IdmhJA2TIz7tL0FVy-iMZQ6Gsc5zRc",
  authDomain: "spartanmeet-91576.firebaseapp.com",
  projectId: "spartanmeet-91576",
  storageBucket: "spartanmeet-91576.appspot.com",
  messagingSenderId: "252697455221",
  appId: "1:252697455221:web:53aea758869ff3aa51263c",
  measurementId: "G-YT40PPJ3LN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider(auth);
const githubProvider = new GithubAuthProvider(auth);

// GOOGLE SIGN-IN
document.getElementById("buttonGoogle").addEventListener("click", (event) => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const userCred = GoogleAuthProvider.credentialFromResult(result);
      const userToken = userCred.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log(user.displayName);
      alert(`Hello ${user.displayName}`);
      sessionStorage.setItem("currUser", user.displayName);

      window.location = "menu.html";

      // window.location = `room.html?room=${invCode}`;
    })
    .catch((error) => {
      const faultMsg = error.message;
      const faultCode = error.code;
      const faultCred = GoogleAuthProvider.credentialFromError(error);
      alert(`fault ${faultMsg} at ${faultCred}`);
    });
});

// GITHUB SIGN-IN
document.getElementById("buttonGithub").addEventListener("click", (event) => {
  signInWithPopup(auth, githubProvider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;

      // The signed-in user info.
      const user = result.user;
      console.log(user.displayName);
      alert(`Hello ${user.displayName}`);
      sessionStorage.setItem("currUser", user.displayName);

      window.location = "menu.html";

      // window.location = `room.html?room=${invCode}`;
    })
    .catch((error) => {
      const faultMsg = error.message;
      const faultCode = error.code;
      const faultCred = GithubAuthProvider.credentialFromError(error);

      alert(`fault ${faultMsg} at ${faultCred}`);
    });
});

export const currAuth = auth;

// CONTINUE WITHOUT SIGNING IN
document.getElementById("continue").onclick = function () {
  location.href = "menu.html";
};
