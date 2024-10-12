// Import the functions you need from the SDKs you need
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    getDoc,
    onSnapshot,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyADJSrEd1PoJO8TdigGb6VRXOHG9RLMIRc",
    authDomain: "todo-ea2b5.firebaseapp.com",
    projectId: "todo-ea2b5",
    storageBucket: "todo-ea2b5.appspot.com",
    messagingSenderId: "216109752320",
    appId: "1:216109752320:web:f8201ef268f3e2066db8e5",
    measurementId: "G-0LDM0M0YCM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider(); // Proveedor de Google

// Función para registrar un nuevo usuario
export function registerUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Registro exitoso. ¡Bienvenido!");
            window.location.href = 'welcome.html';
        })
        .catch((error) => {
            console.error("Error al registrar:", error.code, error.message);
            alert("Error al registrar: " + error.message);
        });
}

// Función para iniciar sesión
export function loginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log("Inicio de sesión exitoso. ¡Bienvenido!");
            window.location.href = 'welcome.html';
        })
        .catch((error) => {
            console.error("Error al iniciar sesión:", error.code, error.message);
            alert("Error al iniciar sesión: " + error.message);
        });
}

// Función para iniciar sesión con Google
export function loginWithGoogle() {
    return signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Inicio de sesión con Google exitoso. ¡Bienvenido!", result.user);
            window.location.href = 'welcome.html';
        })
        .catch((error) => {
            console.error("Error al iniciar sesión con Google:", error.code, error.message);
            alert("Error al iniciar sesión con Google: " + error.message);
        });
}

// Función para agregar una tarea
export function saveTask(title, description) {
    console.log("Saving task:", title, description);
    return addDoc(collection(db, 'tasks'), {
        title: title,
        description: description
    });
}

// Función para obtener todas las tareas
export function getTasks() {
    console.log("Fetching tasks list");
    return getDocs(collection(db, 'tasks'));
}

// Función para suscribirse a cambios en tiempo real
export function onGetTasks(callback) {
    return onSnapshot(collection(db, 'tasks'), callback);
}

// Función para eliminar una tarea
export function deleteTask(id) {
    console.log("Deleting task:", id);
    return deleteDoc(doc(db, "tasks", id));
}

// Función para obtener una tarea específica
export function getTask(id) {
    console.log("Fetching task:", id);
    return getDoc(doc(db, 'tasks', id));
}

// Función para actualizar una tarea
export function updateTask(id, newFields) {
    console.log("Updating Task:", id);
    return updateDoc(doc(db, 'tasks', id), newFields);
}

// Exportar autenticación y base de datos
export {
    auth,
    db
};
