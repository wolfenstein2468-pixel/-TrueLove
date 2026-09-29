// Самостоятельно импортируем спрайт из папки assets
import './game.css';
import spriteSrc from '../assets/sprite.png';

interface Skin {
    name: string;
    src: string;
}

const skins: Skin[] = [
    { name: "Герой 1", src: spriteSrc },
    { name: "Герой 2", src: "sprite2.png" }
];

let currentSkinIndex = 0;

export function initGame(spriteSrc: string): void {
    const selectScreen = document.getElementById('selectScreen') as HTMLElement;
    const gameUi = document.getElementById('gameUi') as HTMLElement;
    const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
    const prevSkinBtn = document.getElementById('prevSkin') as HTMLButtonElement;
    const nextSkinBtn = document.getElementById('nextSkin') as HTMLButtonElement;
    const skinPreviewEl = document.getElementById('skinPreview') as HTMLElement;
    const skinNameEl = document.getElementById('skinName') as HTMLElement;

    function updateCarousel(): void {
        const skin = skins[currentSkinIndex];
        if (skinPreviewEl) skinPreviewEl.style.backgroundImage = `url('${skin.src}')`;
        if (skinNameEl) skinNameEl.innerText = skin.name;
    }

    if (prevSkinBtn) {
        prevSkinBtn.addEventListener('click', () => {
            currentSkinIndex = (currentSkinIndex - 1 + skins.length) % skins.length;
            updateCarousel();
        });
    }

    if (nextSkinBtn) {
        nextSkinBtn.addEventListener('click', () => {
            currentSkinIndex = (currentSkinIndex + 1) % skins.length;
            updateCarousel();
        });
    }

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            document.querySelector('.intro-overlay')?.remove();
            document.getElementById('myVideo')?.remove();
            document.querySelector('.flow-screen-container')?.remove();
            document.querySelector('.meme-overlay')?.remove();

            if (selectScreen) selectScreen.classList.add('hidden');
            if (gameUi) gameUi.classList.add('active');
            
            startCanvasGame(skins[currentSkinIndex].src);
        });
    }

    updateCarousel();
}

function startCanvasGame(spriteSrc: string): void {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const progressFillEl = document.getElementById('progressFill') as HTMLElement;
    const percentTextEl = document.getElementById('percentText') as HTMLElement;
    const interactBtnEl = document.getElementById('interactBtn') as HTMLButtonElement;
    const dialogBoxEl = document.getElementById('dialogBox') as HTMLElement;
    const dialogAvatarEl = document.getElementById('dialogAvatar') as HTMLElement;
    const dialogTextEl = document.getElementById('dialogText') as HTMLElement;
    const dialogNextBtn = document.getElementById('dialogNext') as HTMLButtonElement;
    const winModalEl = document.getElementById('winModal') as HTMLElement;
    const finalRewardBtn = document.getElementById('finalRewardBtn') as HTMLButtonElement;

    const spriteSheet = new Image();
    spriteSheet.src = spriteSrc;
    if (dialogAvatarEl) {
        dialogAvatarEl.style.backgroundImage = `url('${spriteSrc}')`;
    }

    const spriteData = {
        columns: 3,
        rows: 4,
        rowIdle: 0,
        rowWalkLeft: 1,
        rowWalkRight: 2
    };

    const worldWidth = 1200;
    const chestX = 1100;

    let player = {
        x: 40,
        y: 160,
        scale: 0.3,
        speed: 3.5,
        currentFrame: 1,
        currentRow: 0,
        isMoving: false
    };

    let activeDirection = 0;
    let isGamePaused = false;
    let dialogStep = 0;

    const dialogLines = [
        "Приветствую! Путь к сундуку открыт, но будь осторожна на дороге.",
        "Спасибо за подсказку! Скоро я заберу свою награду."
    ];

    function setupButton(id: string, dir: number): void {
        const el = document.getElementById(id) as HTMLButtonElement;
        if (!el) return;
        const start = (e: Event) => { e.preventDefault(); if(!isGamePaused) activeDirection = dir; };
        const end = (e: Event) => { e.preventDefault(); if (activeDirection === dir) activeDirection = 0; };

        el.addEventListener('touchstart', start);
        el.addEventListener('touchend', end);
        el.addEventListener('mousedown', start);
        el.addEventListener('mouseup', end);
    }

    setupButton('btnLeft', -1);
    setupButton('btnRight', 1);

    if (interactBtnEl) {
        interactBtnEl.addEventListener('click', () => {
            isGamePaused = true;
            activeDirection = 0;
            interactBtnEl.style.display = 'none';
            dialogStep = 0;
            if (dialogTextEl) dialogTextEl.innerText = dialogLines[0];
            if (dialogBoxEl) dialogBoxEl.classList.add('active');
        });
    }

    if (dialogNextBtn) {
        dialogNextBtn.addEventListener('click', () => {
            dialogStep++;
            if (dialogStep < dialogLines.length) {
                if (dialogTextEl) dialogTextEl.innerText = dialogLines[dialogStep];
            } else {
                if (dialogBoxEl) dialogBoxEl.classList.remove('active');
                if (winModalEl) winModalEl.classList.add('active');
            }
        });
    }

    if (finalRewardBtn) {
        finalRewardBtn.addEventListener('click', () => {
            if (winModalEl) winModalEl.classList.remove('active');
            player.x = 40;
            isGamePaused = false;
        });
    }

    let frameTimer = 0;
    const frameInterval = 8;

    function update(): void {
        if (isGamePaused) return;

        player.isMoving = false;

        if (activeDirection === 1) {
            if (player.x + 30 < chestX) {
                player.x += player.speed;
            }
            player.currentRow = spriteData.rowWalkRight;
            player.isMoving = true;
        } else if (activeDirection === -1) {
            player.x -= player.speed;
            player.currentRow = spriteData.rowWalkLeft;
            player.isMoving = true;
        }

        player.x = Math.max(0, Math.min(player.x, chestX - 10));

        if (player.isMoving) {
            frameTimer++;
            if (frameTimer >= frameInterval) {
                frameTimer = 0;
                player.currentFrame = (player.currentFrame + 1) % spriteData.columns;
            }
        } else {
            player.currentFrame = 1;
            player.currentRow = spriteData.rowIdle;
        }

        const progress = Math.min(100, Math.max(0, Math.floor((player.x / (chestX - 30)) * 100)));
        if (progressFillEl) progressFillEl.style.width = `${progress}%`;
        if (percentTextEl) percentTextEl.innerText = `${progress}%`;

        const isAtChest = (player.x + 25 >= chestX - 20);
        if (interactBtnEl) {
            interactBtnEl.style.display = (isAtChest && !isGamePaused) ? 'block' : 'none';
        }
    }

    function draw(): void {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let cameraX = player.x - (canvas.width / 2) + 20;
        cameraX = Math.max(0, Math.min(cameraX, worldWidth - canvas.width));

        ctx.save();
        ctx.translate(-cameraX, 0);

        // Земля
        ctx.fillStyle = '#5c3a21';
        ctx.fillRect(0, canvas.height - 50, worldWidth, 50);
        ctx.fillStyle = '#3d2413';
        ctx.fillRect(0, canvas.height - 50, worldWidth, 6);

        // Сундук
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(chestX, canvas.height - 90, 40, 40);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(chestX, canvas.height - 90, 40, 40);

        // Персонаж
        if (spriteSheet.complete && spriteSheet.naturalWidth > 0) {
            const frameWidth = spriteSheet.naturalWidth / spriteData.columns;
            const frameHeight = spriteSheet.naturalHeight / spriteData.rows;

            ctx.drawImage(
                spriteSheet,
                player.currentFrame * frameWidth,
                player.currentRow * frameHeight,
                frameWidth,
                frameHeight,
                player.x,
                player.y,
                frameWidth * player.scale,
                frameHeight * player.scale
            );
        }

        ctx.restore();
    }

    function gameLoop(): void {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    spriteSheet.onload = () => {
        requestAnimationFrame(gameLoop);
    };
    if (spriteSheet.complete) {
        requestAnimationFrame(gameLoop);
    }
}
