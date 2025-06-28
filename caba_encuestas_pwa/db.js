let db;

export function inicializarDB() {
  const request = indexedDB.open("EncuestasCABA", 1);
  request.onupgradeneeded = e => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("comentarios")) {
      db.createObjectStore("comentarios", { keyPath: "id", autoIncrement: true });
    }
  };
  request.onsuccess = e => { db = e.target.result; };
} 

///////////// FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyARkuiGfKg1RCa0YttkNvXUW2GnI8qZCtI",
  authDomain: "pwa-notificaciones-e6e82.firebaseapp.com",
  projectId: "pwa-notificaciones-e6e82",
  storageBucket: "pwa-notificaciones-e6e82.firebasestorage.app",
  messagingSenderId: "60021226417",
  appId: "1:60021226417:web:d356c8456ada6ad55f1b90"
};


const app = initializeApp(firebaseConfig);
const dbFirestore = getFirestore(app);

export async function guardarComentario(categoria, comentario) {
  try {
    await addDoc(collection(dbFirestore, "comentarios"), {
      ...comentario,
      categoria
    });
    console.log("Comentario guardado en Firestore");
  } catch (error) {
    console.error("Error al guardar comentario:", error);
  }
}

export async function traerComentarios(categoria) {
  try {
    const q = query(
      collection(dbFirestore, "comentarios"),
      where("categoria", "==", categoria)
    );

    const querySnapshot = await getDocs(q);
    const resultados = [];
    querySnapshot.forEach((doc) => {
      resultados.push(doc.data());
    });
    return resultados;
  } catch (error) {
    console.error("Error al traer comentarios:", error);
    return [];
  }
}