import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyAk5tDY93JHAt-0pv-6av2HDWeHQ9HRDAs",
  authDomain: "appmoviles-recetas.firebaseapp.com",
  projectId: "appmoviles-recetas",
  storageBucket: "appmoviles-recetas.appspot.com",
  messagingSenderId: "959821768103",
  appId: "1:959821768103:web:850a7539e9229e3f868282",
  measurementId: "G-FWKP3RKYWE"
};


const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);