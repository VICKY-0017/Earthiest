import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCztAIenrgpROVK8__l3hN4kmUvxYPDR-0",
  authDomain: "grow-greens-give-back.firebaseapp.com",
  projectId: "grow-greens-give-back",
  storageBucket: "grow-greens-give-back.firebasestorage.app",
  messagingSenderId: "79421110609",
  appId: "1:79421110609:web:4fba5e9e3a1c082c4c7b70",
  measurementId: "G-NP6HR913NF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export{app,auth,analytics}