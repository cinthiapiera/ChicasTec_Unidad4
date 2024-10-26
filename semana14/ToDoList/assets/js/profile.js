import { auth, createPost, onGetPosts, getCurrentUserId, updatePostLikes, fetchPosts} from "./config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";

const btnLogout = document.getElementById('logout');

const postForm = document.getElementById('postForm');
const postText = document.getElementById('postText');
const postImage = document.getElementById('postImage');

const postsContainer = document.getElementById('postsContainer');

postForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const text = postText.value;
    const image = postImage.files[0];
    createPost(text, image).then(() => {
        alert("Publicación creada exitosamente");
        postForm.reset();
    }).catch((error) => {
        console.error("Error al crear la publicación:", error);
    });
});

// Función para mostrar las publicaciones
function displayPosts(posts) {
    postsContainer.innerHTML = ''; // Limpiar el contenedor
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('col-12', 'col-md-6'); // Configuración de columnas responsive
        postElement.innerHTML = `
            <div class="card shadow-sm h-100">
                <div class="card-body">
                    <p class="card-text">${post.text}</p>
                    ${post.imageUrl ? `<img src="${post.imageUrl}" alt="Imagen de publicación" class="img-fluid rounded">` : ''}
                </div>
                <div class="card-footer text-muted d-flex justify-content-between align-items-center">
                    <div>
                        <button class="btn btn-outline-primary btn-sm like-btn" data-id="${post.id}">
                            👍 <span>${post.likes ? Object.keys(post.likes).length : 0}</span>
                        </button>
                        <button class="btn btn-outline-danger btn-sm dislike-btn" data-id="${post.id}">
                            👎 <span>${post.dislikes ? Object.keys(post.dislikes).length : 0}</span>
                        </button>
                    </div>
                    <small>${new Date(post.createdAt.seconds * 1000).toLocaleString()}</small>
                </div>
            </div>
        `;
        postsContainer.appendChild(postElement);
    });

        // Añadir listeners a los botones de like y dislike después de que se hayan añadido las publicaciones
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');

    likeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const postId = button.getAttribute('data-id');
            const userId = getCurrentUserId();
            if (userId) {
                await updatePostLikes(postId, userId, 'like');
                displayPosts(await fetchPosts()); // Refresca las publicaciones
            }
        });
    });

    dislikeButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const postId = button.getAttribute('data-id');
            const userId = getCurrentUserId();
            if (userId) {
                await updatePostLikes(postId, userId, 'dislike');
                displayPosts(await fetchPosts()); // Refresca las publicaciones
            }
        });
    });
}



// Llamada a la función que escucha las publicaciones en tiempo real
onGetPosts(displayPosts);

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