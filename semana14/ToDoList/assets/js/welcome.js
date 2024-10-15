import { auth, saveTask, getTasks, onGetTasks, deleteTask, getTask, updateTask } from "./config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const taskForm = document.getElementById('task-form');
const tasksContainer = document.getElementById('tasks-container');
const btnCancel = document.getElementById('btn-task-cancel');
const btnLogout = document.getElementById('logout');

let editStatus = false; //bandera
let id = '';

// Cargar tareas al iniciar
window.addEventListener('DOMContentLoaded', async function () {

    // const querySnapshot = await getTasks();
    // console.log(querySnapshot);
    
    onGetTasks(function (querySnapshot) {
        tasksContainer.innerHTML = '';

        querySnapshot.forEach(doc => {
            const task = doc.data();
            // console.log(task, doc.id)
            tasksContainer.innerHTML += `
                <div class="card card-body mt-2">
                    <h3 class="h5">${task.title}</h3>
                    <p>${task.description}</p>
                    <div>
                        <button class='btn btn-warning btn-edit' data-id='${doc.id}'>edit</button>
                        <button class='btn btn-danger btn-delete' data-id='${doc.id}'>delete</button>
                    </div>
                </div>
            `;
        });

        // Listener para botones de eliminar
        const btnsDelete = tasksContainer.querySelectorAll('.btn-delete');
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', function (event) {
                const taskId = event.target.dataset.id;
                deleteTask(taskId);
            });
        });

        // Listener para botones de editar
        const btnsEdit = tasksContainer.querySelectorAll('.btn-edit');
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async function (event) {
                const taskId = event.target.dataset.id;
                const doc = await getTask(taskId);
                const task = doc.data();

                taskForm['task-title'].value = task.title;
                taskForm['task-description'].value = task.description;

                editStatus = true;
                id = doc.id;
                taskForm['btn-task-save'].innerText = 'Update';
                btnCancel.style.display = 'inline'; 
            });
        });
    });
});

// onAuthStateChanged
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Usuario está autenticado:", user);
    } else {
        console.log("Usuario no está autenticado.");
        window.location.href = 'index.html'; // Redirige si no hay usuario
    }
});

// Cerrar sesión
btnLogout.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            console.log("Cierre de sesión exitoso.");
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión. Intenta de nuevo.");
        });
});

// Manejar el envío del formulario
taskForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = taskForm['task-title'].value;
    const description = taskForm['task-description'].value;

    if (editStatus) {
        updateTask(id, { title: title, description: description });
        editStatus = false;
        taskForm['btn-task-save'].innerText = 'Save';
        btnCancel.style.display = 'none';
    } else {
        saveTask(title, description);
    }
    taskForm.reset();
});

// Botón de cancelar
btnCancel.addEventListener('click', function () {
    // Restablecer el formulario y el estado
    taskForm.reset();
    editStatus = false;
    id = '';
    
    // Cambiar el texto del botón "Update" a "Save"
    taskForm['btn-task-save'].innerText = 'Save';
    
    // Ocultar el botón de "Cancelar"
    btnCancel.style.display = 'none';
});