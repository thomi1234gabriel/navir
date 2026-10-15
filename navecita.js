const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const healthBar = document.getElementById('health-bar');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const btnRestart = document.getElementById('btn-restart');
const bossWarning = document.getElementById('boss-warning');

// Variables de estado
let score = 0;
let health = 100;
let isGameOver = false;
let shotType = 'normal'; // normal, doble, potente
let frames = 0;
let bossActive = false;
let boss = null;

// Objetos
const player = { x: 175, y: 430, width: 40, height: 40, speed: 5, dx: 0 };
let bullets = [];
let enemies = [];
let particles = []; // Para explosiones pequeñas

// Tienda y Cooldowns
const btnDoble = document.getElementById('btn-doble');
const btnPotente = document.getElementById('btn-potente');
const cdDoble = document.getElementById('cd-doble');
const cdPotente = document.getElementById('cd-potente');
const SKILL_DURATION = 10000; // 10 segundos dura la habilidad

// ================= EVENTOS =================
// Controles PC
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === 'ArrowRight') player.dx = player.speed;
    if (e.key === ' ' || e.key === 'Spacebar') shoot();
});
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') player.dx = 0;
});

// Controles Móviles
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');
const btnShoot = document.getElementById('btn-shoot');

if(btnLeft && btnRight && btnShoot) {
    const startLeft = (e) => { if(e) e.preventDefault(); player.dx = -player.speed; };
    const startRight = (e) => { if(e) e.preventDefault(); player.dx = player.speed; };
    const stopMove = (e) => { if(e) e.preventDefault(); player.dx = 0; };
    const fire = (e) => { if(e) e.preventDefault(); shoot(); };

    btnLeft.addEventListener('touchstart', startLeft);
    btnLeft.addEventListener('mousedown', startLeft);
    btnLeft.addEventListener('touchend', stopMove);
    btnLeft.addEventListener('mouseup', stopMove);
    
    btnRight.addEventListener('touchstart', startRight);
    btnRight.addEventListener('mousedown', startRight);
    btnRight.addEventListener('touchend', stopMove);
    btnRight.addEventListener('mouseup', stopMove);
    
    btnShoot.addEventListener('touchstart', fire);
    btnShoot.addEventListener('mousedown', fire);
}

// Botón Reiniciar
btnRestart.addEventListener('click', () => { location.reload(); });

// ================= HABILIDADES (Con tiempo limitado) =================
function activateSkill(type, cost, btn, cdBar) {
    if (score >= cost && shotType === 'normal') {
        score -= cost;
        updateScore();
        shotType = type;
        
        btn.disabled = true;
        btnDoble.disabled = true;
        btnPotente.disabled = true;
        
        let timeLeft = SKILL_DURATION;
        btn.innerHTML = `<i class="fa-solid fa-stopwatch"></i> Activo`;

        // Animación de la barra de tiempo
        let interval = setInterval(() => {
            timeLeft -= 100;
            cdBar.style.width = (timeLeft / SKILL_DURATION) * 100 + '%';
            
            if (timeLeft <= 0) {
                clearInterval(interval);
                shotType = 'normal';
                btnDoble.disabled = false;
                btnPotente.disabled = false;
                btnDoble.innerHTML = `<i class="fa-solid fa-angles-up"></i> Tiro Doble (50 pts)`;
                btnPotente.innerHTML = `<i class="fa-solid fa-bolt"></i> Tiro Potente (100 pts)`;
                cdBar.style.width = '0%';
            }
        }, 100);
    }
}

btnDoble.addEventListener('click', () => activateSkill('doble', 50, btnDoble, cdDoble));
btnPotente.addEventListener('click', () => activateSkill('potente', 100, btnPotente, cdPotente));


// ================= LÓGICA CORE =================
function shoot() {
    if (isGameOver) return;
    let bSpeed = 8;
    let bColor = shotType === 'potente' ? '#fca311' : '#e63946';
    let bWidth = shotType === 'potente' ? 12 : 5;
    let bDamage = shotType === 'potente' ? 4 : 1; // Potente hace 4 de daño

    if (shotType === 'doble') {
        bullets.push({ x: player.x + 5, y: player.y, width: 4, height: 15, speed: bSpeed, color: bColor, damage: 1 });
        bullets.push({ x: player.x + player.width - 9, y: player.y, width: 4, height: 15, speed: bSpeed, color: bColor, damage: 1 });
    } else {
        bullets.push({ x: player.x + player.width / 2 - bWidth/2, y: player.y, width: bWidth, height: 18, speed: bSpeed, color: bColor, damage: bDamage });
    }
}

function takeDamage(amount) {
    health -= amount;
    if (health <= 0) { health = 0; triggerGameOver(); }
    
    healthBar.style.width = health + '%';
    // Cambiar color de barra según vida
    if (health > 60) healthBar.style.background = 'linear-gradient(90deg, #4caf50, #81c784)';
    else if (health > 30) healthBar.style.background = 'linear-gradient(90deg, #fca311, #ffdca8)';
    else healthBar.style.background = 'linear-gradient(90deg, #e63946, #ff7a7a)';
}

function triggerGameOver() {
    isGameOver = true;
    finalScoreElement.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

function createExplosion(x, y, color) {
    for(let i=0; i<5; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
            life: 20, color: color
        });
    }
}

function spawnEnemy() {
    if (bossActive) return;

    // Frecuencia constante: 1 enemigo aprox cada 1.5 segundos
    if (frames % 80 === 0) {
        let size = 35 + Math.random() * 10;
        let x = Math.random() * (canvas.width - size);
        
        // DIFICULTAD: Aumenta la vida de los enemigos basandose en el puntaje, no la cantidad.
        let hp = 1;
        if (score >= 100) hp = Math.random() > 0.5 ? 2 : 1; // Aparecen enemigos de 2 de vida
        if (score >= 250) hp = Math.random() > 0.4 ? 3 : 2; // Aparecen de 3 de vida
        if (score >= 400) hp = Math.random() > 0.3 ? 5 : 3; // Muy resistentes antes del jefe

        let speed = 2 + Math.random() * 1.5; // Velocidad estable, no muy rápidos
        
        // Color según resistencia
        let color = hp >= 3 ? '#4a3b32' : (hp === 2 ? '#8d7154' : '#b88d56');

        enemies.push({ x: x, y: -size, width: size, height: size, speed: speed, hp: hp, maxHp: hp, color: color, isBoss: false });
    }
}

function spawnBoss() {
    bossActive = true;
    bossWarning.classList.remove('hidden');
    setTimeout(() => { bossWarning.classList.add('hidden'); }, 3000);

    boss = {
        x: canvas.width / 2 - 40,
        y: -80,
        width: 80,
        height: 80,
        speed: 1.5,
        hp: 60, // Jefe muy resistente
        maxHp: 60,
        color: '#4a3b32',
        isBoss: true,
        direction: 1
    };
    enemies.push(boss);
}

function updateScore() {
    scoreElement.innerText = score;
    if (score >= 500 && !bossActive && !boss) spawnBoss();
}

// ================= DIBUJO Y BUCLE =================
function drawNave(x, y, w, h) {
    ctx.fillStyle = '#fffefb';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.fill();
    // Motor trasero
    ctx.fillStyle = '#e63946';
    ctx.fillRect(x + w/2 - 5, y + h, 10, 5 + Math.random() * 5); // Fuego animado
}

function update() {
    if (isGameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Mover jugador
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    drawNave(player.x, player.y, player.width, player.height);

    // Partículas (Explosiones)
    particles.forEach((p, index) => {
        p.x += p.vx; p.y += p.vy; p.life--;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        if(p.life <= 0) particles.splice(index, 1);
    });

    // Balas
    bullets.forEach((b, index) => {
        b.y -= b.speed;
        ctx.fillStyle = b.color;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, 5); // Balas redondeadas
        ctx.fill();
        if (b.y < 0) bullets.splice(index, 1);
    });

    spawnEnemy();

    // Enemigos y Jefe
    enemies.forEach((enemy, eIndex) => {
        if (enemy.isBoss) {
            if (enemy.y < 40) enemy.y += enemy.speed;
            else {
                enemy.x += enemy.speed * 2 * enemy.direction;
                if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) enemy.direction *= -1;
            }
        } else {
            enemy.y += enemy.speed;
        }
        
        // Dibujar cubo enemigo con bordes redondeados
        ctx.fillStyle = enemy.color;
        ctx.beginPath();
        ctx.roundRect(enemy.x, enemy.y, enemy.width, enemy.height, 8);
        ctx.fill();
        
        // Barra de vida pequeña para enemigos resistentes o jefe
        if(enemy.hp > 1) {
            let hpPercentage = enemy.hp / enemy.maxHp;
            ctx.fillStyle = enemy.isBoss ? '#e63946' : '#fca311';
            ctx.fillRect(enemy.x, enemy.y - 8, enemy.width * hpPercentage, 4);
        }

        // Colisión Bala - Enemigo
        bullets.forEach((b, bIndex) => {
            if (b.x < enemy.x + enemy.width && b.x + b.width > enemy.x &&
                b.y < enemy.y + enemy.height && b.y + b.height > enemy.y) {
                
                enemy.hp -= b.damage;
                createExplosion(b.x, b.y, '#fca311'); // Chispas
                bullets.splice(bIndex, 1);

                if (enemy.hp <= 0) {
                    createExplosion(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.color);
                    enemies.splice(eIndex, 1);
                    if (enemy.isBoss) {
                        score += 300;
                        bossActive = false;
                        boss = null;
                    } else {
                        score += enemy.maxHp * 5; // Más puntos por matar enemigos resistentes
                    }
                    updateScore();
                }
            }
        });

        // Colisión Enemigo - Jugador
        if (player.x < enemy.x + enemy.width && player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height && player.y + player.height > enemy.y) {
            
            enemies.splice(eIndex, 1);
            createExplosion(player.x + player.width/2, player.y, '#e63946');
            
            if (enemy.isBoss) takeDamage(100); // Muerte instantánea
            else takeDamage(15); // Daño ajustado
        }

        // Si el enemigo sale por abajo (Penalización menor)
        if (enemy.y > canvas.height) {
            enemies.splice(eIndex, 1);
            if (!enemy.isBoss) takeDamage(5); // Pierdes solo 5 de vida por dejarlo pasar
        }
    });

    frames++;
    requestAnimationFrame(update);
}

update();