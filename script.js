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