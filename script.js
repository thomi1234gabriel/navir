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

// --- Generador de copos de nieve (Optimizado y Suave) ---
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
            // ESTA LÍNEA ES LA MAGIA PARA QUE CAIGAN A DESTIEMPO
            delay: -(Math.random() * 15000) 
        });
        
        snowContainer.appendChild(snowflake);
    }
}

// Inicialización
window.onload = () => {
    createSnowflakes();
    actualizarContador();
    setInterval(actualizarContador, 1000); // Actualiza cada segundo
};

let player;
let reproduciendo = false;

function onYouTubeIframeAPIReady() {

    player = new YT.Player('player', {
        height: '0',
        width: '0',

        playerVars: {
            listType: 'playlist',
            list: 'PL7PKcN4RbDt8gKsiGeNC4SCRwv0e34HOc'
        }
    });
}

const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

document.addEventListener("DOMContentLoaded", () => {

    const playBtn = document.getElementById("playBtn");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    if (playBtn) {
        playBtn.addEventListener("click", () => {
            if(!reproduciendo){
                player.playVideo();
                playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                reproduciendo = true;
            }else{
                player.pauseVideo();
                playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
                reproduciendo = false;
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", () => {
            player.nextVideo();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener("click", () => {
            player.previousVideo();
        });
    }
});

// =========================================
// LÓGICA PARA AGREGAR RECUERDOS (FIREBASE EN TIEMPO REAL)
// =========================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

// Tus credenciales exactas de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC3-ykjxnh4yC-8cThkoEGVPeH2boDwLFI",
    authDomain: "navir-b8bec.firebaseapp.com",
    projectId: "navir-b8bec",
    storageBucket: "navir-b8bec.firebasestorage.app",
    messagingSenderId: "142103427406",
    appId: "1:142103427406:web:16afc5b2bd4e2cdcb5461f",
    measurementId: "G-JM6T0QTCYE"
};

// Inicializar Firebase
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
        
        // 1. Abrir y cerrar el modal
        btnAdd.addEventListener('click', () => {
            modal.style.display = 'flex';
            textarea.focus();
        });
        
        btnCerrar.addEventListener('click', () => {
            modal.style.display = 'none';
            textarea.value = ''; 
        });

        // 2. Guardar el recuerdo en Firebase
        btnGuardar.addEventListener('click', async () => {
            const texto = textarea.value.trim();
            if(texto !== "") {
                try {
                    // Desactivar botón mientras guarda para evitar duplicados
                    btnGuardar.disabled = true;
                    btnGuardar.innerText = "Guardando...";

                    await addDoc(collection(db, "mensajes_navir"), {
                        texto: texto,
                        fecha: new Date() // Para ordenarlos por fecha
                    });

                    textarea.value = "";
                    modal.style.display = 'none';
                } catch (e) {
                    console.error("Error añadiendo el documento: ", e);
                    alert("Hubo un error al guardar el mensajito. Revisa las reglas de seguridad de Firestore.");
                } finally {
                    btnGuardar.disabled = false;
                    btnGuardar.innerText = "Guardar";
                }
            }
        });

       // 3. Escuchar los mensajes en TIEMPO REAL y persistirlos
import { getDocs } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js"; // Asegurate de agregar getDocs a tu import

// ... (dentro de tu DOMContentLoaded) ...

// Función para cargar y mostrar los mensajes
async function cargarMensajes() {
    const q = query(collection(db, "mensajes_navir"), orderBy("fecha", "asc"));
    
    // onSnapshot mantiene la conexión viva
    onSnapshot(q, (snapshot) => {
        // Limpiamos las notas actuales antes de volver a dibujar
        document.querySelectorAll('.nota-firebase').forEach(nota => nota.remove());

        snapshot.forEach((doc) => {
            const data = doc.data();
            renderizarNuevoRecuerdo(data.texto);
        });
    });
}

// Llamamos a la función al iniciar
cargarMensajes();
    }

    function renderizarNuevoRecuerdo(texto) {
        const div = document.createElement('div');
        const rot = Math.floor(Math.random() * 5) + 1;
        
        // Le agregamos 'nota-firebase' para poder identificarlas
        div.className = `memory-item note rot-${rot} nota-firebase`;
        div.style.width = '300px';
        div.style.textAlign = 'center';
        
        div.innerHTML = `<p>"${texto}" <br><br><i class="fa-solid fa-heart" style="color: #e63946;"></i> - <em>Navir</em></p>`;
        
        memoryBoard.appendChild(div);
    }
});