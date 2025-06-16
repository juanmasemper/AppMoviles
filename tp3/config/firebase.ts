import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAk5tDY93JHAt-0pv-6av2HDWeHQ9HRDAs",
  authDomain: "appmoviles-recetas.firebaseapp.com",
  projectId: "appmoviles-recetas",
  storageBucket: "appmoviles-recetas.firebasestorage.app",
  messagingSenderId: "959821768103",
  appId: "1:959821768103:web:850a7539e9229e3f868282",
  measurementId: "G-FWKP3RKYWE"
};


let app;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);


export { auth, db };
