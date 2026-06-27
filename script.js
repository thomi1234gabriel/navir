// 1. IMPORTACIONES DE FIREBASE (¡Siempre arriba de todo!)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// --- Lógica del Contador de Amor ---
function actualizarContador() {
    const fechaInicio = new Date('2026-05-18T00:00:00');
    const ahora = new Date();
    
    let diferencia = ahora - fechaInicio;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    diferencia -= dias * (1000 * 60 * 60 * 24);

    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    diferencia -= horas * (1000 * 60 * 60);

    const minutos = Math.floor(diferencia / (1000 * 60));
    diferencia -= minutos * (1000 * 60);

    const segundos = Math.floor(diferencia / 1000);

    const elemento = document.getElementById('reloj');
    if (elemento) {
        elemento.innerHTML = `
            <div class="tiempo-box"><strong>${dias}</strong><span>días</span></div>
            <div class="tiempo-box"><strong>${horas}</strong><span>hs</span></div>
            <div class="tiempo-box"><strong>${minutos}</strong><span>min</span></div>
            <div class="tiempo-box"><strong>${segundos}</strong><span>seg</span></div>
        `;
    }
}

// --- Generador de copos de nieve ---
function createSnowflakes() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-container';
    document.body.appendChild(snowContainer);

    const isMobile = window.innerWidth < 768;
    const snowFlakesCount = isMobile ? 20 : 50;

    for (let i = 0; i < snowFlakesCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '<i class="fa-solid fa-snowflake"></i>';
        
        const startLeft = Math.random() * 100;
        const duration = Math.random() * 5 + 5;
        const size = Math.random() * 10 + 10;

        snowflake.style.left = `${startLeft}vw`;
        snowflake.style.fontSize = `${size}px`;
        
        snowflake.animate([
            { transform: 'translate3d(0, -10vh, 0) rotate(0deg)' },
            { transform: `translate3d(${Math.random() * 40 - 20}px, 110vh, 0) rotate(360deg)` }
        ], {
            duration: duration * 1000,
            iterations: Infinity,
            easing: 'linear',
            delay: -(Math.random() * 15000) 
        });
        
        snowContainer.appendChild(snowflake);
    }
}

// Inicialización
window.onload = () => {
    createSnowflakes();
    actualizarContador();
    setInterval(actualizarContador, 1000); 
};

// --- Reproductor de YouTube ---
let player;
let reproduciendo = false;

window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('player', {
        height: '0', 
        width: '0',
        playerVars: {
            listType: 'playlist',
            list: 'PL7PKcN4RbDt8gKsiGeNC4SCRwv0e34HOc',
            autoplay: 0 // Mejor empezar pausado
        },
        events: {
            'onReady': () => console.log("Reproductor listo!")
        }
    });
}

// Botones
document.addEventListener("DOMContentLoaded", () => {
    const playBtn = document.getElementById("playBtn");
    
    if (playBtn) {
        playBtn.addEventListener("click", () => {
            // Protección: si el player no cargó, no hacemos nada
            if (!player) {
                alert("El reproductor está cargando, esperá un seg...");
                return;
            }

            if (!reproduciendo) {
                player.playVideo();
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                reproduciendo = true;
            } else {
                player.pauseVideo();
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                reproduciendo = false;
            }
        });
    }

    // Asegurate de que los ID de los botones coincidan con tu HTML
    document.getElementById("nextBtn")?.addEventListener("click", () => player?.nextVideo());
    document.getElementById("prevBtn")?.addEventListener("click", () => player?.previousVideo());
});

// --- Lógica de Firebase ---
const firebaseConfig = {
    apiKey: "AIzaSyC3-ykjxnh4yC-8cThkoEGVPeH2boDwLFI",
    authDomain: "navir-b8bec.firebaseapp.com",
    projectId: "navir-b8bec",
    storageBucket: "navir-b8bec.firebasestorage.app",
    messagingSenderId: "142103427406",
    appId: "1:142103427406:web:16afc5b2bd4e2cdcb5461f",
    measurementId: "G-JM6T0QTCYE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
    const btnAdd = document.getElementById('btn-add-memory');
    const modal = document.getElementById('modal-memory');
    const btnCerrar = document.getElementById('btn-cerrar-memory');
    const btnGuardar = document.getElementById('btn-guardar-memory');
    const textarea = document.getElementById('texto-nuevo-recuerdo');
    const memoryBoard = document.querySelector('.memory-board');

    if (btnAdd && modal && memoryBoard) {
        btnAdd.addEventListener('click', () => {
            modal.classList.add('activo');
            textarea.focus();
        });
        
        btnCerrar.addEventListener('click', () => {
            modal.classList.remove('activo');
            textarea.value = ''; 
        });
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove('activo');
                textarea.value='';
            }
        });

        btnGuardar.addEventListener('click', async () => {
            const texto = textarea.value.trim();
            if(texto !== "") {
                try {
                    btnGuardar.disabled = true;
                    btnGuardar.innerText = "Guardando...";
                    await addDoc(collection(db, "mensajes_navir"), {
                        texto: texto,
                        fecha: new Date()
                    });
                    textarea.value = "";
                    modal.classList.remove('activo');
                } catch (e) {
                    console.error("Error al guardar: ", e);
                    alert("Error al guardar.");
                } finally {
                    btnGuardar.disabled = false;
                    btnGuardar.innerText = "Guardar";
                }
            }
        });

        const q = query(collection(db, "mensajes_navir"), orderBy("fecha", "asc"));
        onSnapshot(q, (snapshot) => {
            document.querySelectorAll('.nota-firebase').forEach(nota => nota.remove());
            snapshot.forEach((doc) => {
                renderizarNuevoRecuerdo(doc.data().texto, doc.id);
            });
        });
    }

    function renderizarNuevoRecuerdo(texto, id) {
        const div = document.createElement('div');
        const rot = Math.floor(Math.random() * 5) + 1;
        
        div.className = `memory-item note rot-${rot} nota-firebase`;
        
        div.innerHTML = `
            <button class="btn-borrar" title="Borrar mensaje"><i class="fa-solid fa-trash"></i></button>
            <div class="contenido-nota">
                <p>"${texto}"</p>
                <div class="firma">
                    <i class="fa-solid fa-heart" style="color: #e63946;"></i> <em>Navir</em>
                </div>
            </div>
        `;

        div.querySelector('.btn-borrar').addEventListener('click', async (e) => {
            e.stopPropagation(); // Evita que se disparen otros eventos al borrar
            if(confirm("¿Querés borrar este recuerdito?")) {
                try {
                    await deleteDoc(doc(db, "mensajes_navir", id));
                } catch (e) {
                    console.error("Error al borrar: ", e);
                }
            }
        });

        memoryBoard.appendChild(div);
    }
});

// Función para poner la patita en la pestaña
function configurarFavicon() {
    const svg = document.getElementById('favicon-patita');
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(blob);
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }
    link.href = url;
}

// Llamalo cuando cargue la página
window.addEventListener('load', configurarFavicon);