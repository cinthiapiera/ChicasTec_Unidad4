import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, onSnapshot, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage, ref, getDownloadURL,  uploadBytes } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

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
const storage = getStorage(app);
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
            console.log(userCredential);            
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

// Función carga una única vez todas las tareas desde la colección 'tasks'.
export function getTasks() {
    console.log("Fetching tasks list");
    return getDocs(collection(db, 'tasks'));
}

// Función escucha los cambios en tiempo real en la colección 'tasks'.
// Crea una suscripción. Cada vez que se agregue, elimine o actualice un documento, el callback se ejecutará automáticamente.
export function onGetTasks(callback) {
    return onSnapshot(collection(db, 'tasks'), callback);
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

// Función para eliminar una tarea
export function deleteTask(id) {
    console.log("Deleting task:", id);
    return deleteDoc(doc(db, "tasks", id));
}


// Publicaciones
export function createPost(text, imageFile) {
    let imageUrl = null;

    if (imageFile) {
        const storageRef = ref(storage, `images/${imageFile.name}`);
        return uploadBytes(storageRef, imageFile).then((snapshot) => {
            return getDownloadURL(snapshot.ref);
        }).then((url) => {
            imageUrl = url;
            return savePost(text, imageUrl);
        });
    } else {
        return savePost(text, null);
    }
}

// Guardar la publicación en Firestore
function savePost(text, imageUrl) {
    const post = {
        text: text,
        imageUrl: imageUrl,
        likes: 0,
        dislikes: 0,
        createdAt: new Date() // Usar la fecha actual como timestamp
    };

    return addDoc(collection(db, 'posts'), post);
}

export function onGetPosts(callback) {
    onSnapshot(collection(db, 'posts'), (snapshot) => {
        const posts = [];
        snapshot.forEach(doc => {
            posts.push({ id: doc.id, ...doc.data() }); // Agregar ID y datos de cada publicación
        });
        callback(posts); // Llamar al callback con las publicaciones
    });
}


//like y dislike
// Función para obtener el ID del usuario actual
export const getCurrentUserId = () => {
    const user = auth.currentUser;
    return user ? user.uid : null; // Retorna el ID del usuario autenticado o null
};

// Función para actualizar los likes en la base de datos
export const updatePostLikes = async (postId, userId, action) => {
    console.log("Post ID:", postId);
    console.log("User ID:", userId);
    console.log("Action:", action);
    const postRef = doc(db, 'posts', postId);
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
        const postData = postDoc.data();
        let likes = postData.likes || {};
        let dislikes = postData.dislikes || {};

        if (action === 'like') {
            if (dislikes[userId]) {
                delete dislikes[userId]; // Elimina el dislike si el usuario ya lo había dado
            }
            likes[userId] = true; // Añade o actualiza el like
        } else if (action === 'dislike') {
            if (likes[userId]) {
                delete likes[userId]; // Elimina el like si el usuario ya lo había dado
            }
            dislikes[userId] = true; // Añade o actualiza el dislike
        }

        // Actualiza el post en Firestore
        await updateDoc(postRef, { likes, dislikes });
    }
};

export async function fetchPosts() {
    const querySnapshot = await getDocs(collection(db, 'posts'));
    const posts = [];
    querySnapshot.forEach(doc => {
        posts.push({ id: doc.id, ...doc.data() });
    });
    return posts;
}

// Exportar autenticación y base de datos
export { auth};
