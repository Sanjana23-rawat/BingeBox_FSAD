import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyA-zI0zQoNqH6itoDePe9w2uLOHpJxGnGI",
    authDomain: "netflix-clone-devops.firebaseapp.com",
    projectId: "netflix-clone-devops",
    storageBucket: "netflix-clone-devops.appspot.com",
    messagingSenderId: "608491648352",
    appId: "1:608491648352:web:b75942a6bf74ec19071a05",
    measurementId: "G-56WB4VR3PH"
  };
  

  const app = initializeApp(firebaseConfig);

  export const firebaseAuth = getAuth(app);