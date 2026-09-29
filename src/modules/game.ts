      new FlowModule(app, storySteps, () => {
        app.innerHTML = `
          <style>
            .game-ui-container {
              position: absolute;
              inset: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding: 20px;
              box-sizing: border-box;
              z-index: 10;
              font-family: sans-serif;
              pointer-events: none;
            }
            .game-ui-container > * { pointer-events: auto; }
            .ui-bar {
              background: rgba(0, 0, 0, 0.6);
              padding: 8px 16px;
              border-radius: 20px;
              color: #fff;
              font-size: 14px;
              text-align: center;
              backdrop-filter: blur(5px);
              border: 1px solid rgba(255, 255, 255, 0.15);
            }
            .progress-bg {
              width: 180px;
              height: 6px;
              background: rgba(255, 255, 255, 0.3);
              border-radius: 3px;
              overflow: hidden;
              margin-top: 6px;
            }
            .progress-fill {
              width: 0%;
              height: 100%;
              background: #4cd137;
              transition: width 0.3s ease;
            }
            .canvas-wrapper {
              position: relative;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            #gameCanvas {
              background: rgba(0, 0, 0, 0.3);
              border-radius: 14px;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .interact-btn {
              position: absolute;
              bottom: 12px;
              right: 12px;
              background: #ff4d8d;
              color: white;
              border: none;
              padding: 8px 14px;
              border-radius: 8px;
              font-weight: bold;
              cursor: pointer;
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
            }
            .controls-row {
              display: flex;
              justify-content: space-between;
              width: 100%;
              max-width: 280px;
              padding: 0 10px;
              margin-bottom: 10px;
            }
            .ctrl-btn {
              background: rgba(255, 255, 255, 0.25);
              border: 1px solid rgba(255, 255, 255, 0.4);
              color: white;
              font-size: 20px;
              width: 55px;
              height: 55px;
              border-radius: 50%;
              cursor: pointer;
              backdrop-filter: blur(5px);
            }
            .dialog-box {
              position: absolute;
              bottom: 80px;
              left: 20px;
              right: 20px;
              background: rgba(20, 20, 30, 0.95);
              border: 1px solid rgba(255, 255, 255, 0.25);
              border-radius: 14px;
              padding: 14px;
              display: none;
              flex-direction: column;
              gap: 6px;
              box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
            }
            .dialog-speaker { font-size: 12px; color: #ff4d8d; font-weight: bold; }
            .dialog-text { font-size: 14px; color: #fff; line-height: 1.4; }
            .dialog-next {
              align-self: flex-end;
              background: #ff4d8d;
              color: white;
              border: none;
              padding: 4px 12px;
              border-radius: 6px;
              cursor: pointer;
              font-size: 12px;
              font-weight: bold;
            }
            .win-modal {
              position: absolute;
              inset: 0;
              background: rgba(0, 0, 0, 0.85);
              display: none;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 20px;
              z-index: 30;
            }
            .win-title {
              font-size: 30px;
              color: #ff4d8d;
              font-weight: bold;
              text-shadow: 0 0 20px rgba(255, 77, 141, 0.5);
            }
            .open-btn {
              background: #4cd137;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 10px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
            }
          </style>

          <div class="game-ui-container">
            <div class="ui-bar">
              <span>Прогресс: </span><span id="percentText">0%</span>
              <div class="progress-bg">
                <div id="progressFill" class="progress-fill"></div>
              </div>
            </div>

            <div class="canvas-wrapper">
              <canvas id="gameCanvas" width="320" height="220"></canvas>
              <button id="interactBtn" class="interact-btn">Сундук!</button>
            </div>

            <div class="controls-row">
              <button id="btnLeft" class="ctrl-btn">◀</button>
              <button id="btnRight" class="ctrl-btn">▶</button>
            </div>

            <div id="dialogBox" class="dialog-box">
              <div id="dialogSpeaker" class="dialog-speaker">Персонаж</div>
              <div id="dialogText" class="dialog-text"></div>
              <button id="dialogNext" class="dialog-next">Далее</button>
            </div>

            <div id="winModal" class="win-modal">
              <div class="win-title">Победа!</div>
              <button id="finalRewardBtn" class="open-btn">Забрать награду</button>
            </div>
          </div>
        `;
        
        initGame('gameCanvas', 'sprite.png');
      });


export interface SkinConfig {
    name: string;
    src: string;
}

export function initGame(canvasId: string, spriteSrc: string) {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (!canvas) {
        throw new Error(`Canvas с id "${canvasId}" не найден.`);
    }
    const ctx = canvas.getContext('2d')!;

    // DOM-элементы внутри игрового интерфейса
    const progressFillEl = document.getElementById('progressFill') as HTMLElement;
    const percentTextEl = document.getElementById('percentText') as HTMLElement;
    const interactBtnEl = document.getElementById('interactBtn') as HTMLElement;
    const dialogBoxEl = document.getElementById('dialogBox') as HTMLElement;
    const dialogAvatarEl = document.getElementById('dialogAvatar') as HTMLElement;
    const dialogTextEl = document.getElementById('dialogText') as HTMLElement;
    const dialogNextBtn = document.getElementById('dialogNext') as HTMLElement;
    const winModalEl = document.getElementById('winModal') as HTMLElement;
    const finalRewardBtn = document.getElementById('finalRewardBtn') as HTMLElement;

    // Загрузка спрайта игрока
    const spriteSheet = new Image();
    spriteSheet.src = spriteSrc;
    if (dialogAvatarEl) {
        dialogAvatarEl.style.backgroundImage = `url('${spriteSrc}')`;
    }

    const spriteData = { columns: 3, rows: 4, rowIdle: 0, rowWalkLeft: 1, rowWalkRight: 2 };
    const worldWidth = 1200;
    const chestX = 1100;

    let player = { x: 40, y: 160, scale: 0.3, speed: 3.5, currentFrame: 1, currentRow: 0, isMoving: false };
    let activeDirection = 0;
    let isGamePaused = false;
    let dialogStep = 0;

    const dialogLines = [
        "Приветствую! Сундук твой.",
        "Отличная работа!"
    ];

    // Управление кнопками ходьбы
    function setupButton(id: string, dir: number) {
        const el = document.getElementById(id);
        if (!el) return;
        const start = (e: Event) => { e.preventDefault(); if (!isGamePaused) activeDirection = dir; };
        const end = (e: Event) => { e.preventDefault(); if (activeDirection === dir) activeDirection = 0; };
        el.addEventListener('touchstart', start);
        el.addEventListener('touchend', end);
        el.addEventListener('mousedown', start);
        el.addEventListener('mouseup', end);
    }

    setupButton('btnLeft', -1);
    setupButton('btnRight', 1);

    // Логика взаимодействия с сундуком
    if (interactBtnEl) {
        interactBtnEl.addEventListener('click', () => {
            isGamePaused = true;
            activeDirection = 0;
            interactBtnEl.style.display = 'none';
            dialogStep = 0;
            if (dialogTextEl) dialogTextEl.innerText = dialogLines[0];
            dialogBoxEl?.classList.add('active');
        });
    }

    if (dialogNextBtn) {
        dialogNextBtn.addEventListener('click', () => {
            dialogStep++;
            if (dialogStep < dialogLines.length) {
                if (dialogTextEl) dialogTextEl.innerText = dialogLines[dialogStep];
            } else {
                dialogBoxEl?.classList.remove('active');
                winModalEl?.classList.add('active');
            }
        });
    }

    if (finalRewardBtn) {
        finalRewardBtn.addEventListener('click', () => {
            winModalEl?.classList.remove('active');
            player.x = 40;
            isGamePaused = false;
        });
    }

    let frameTimer = 0;
    const frameInterval = 8;

    function update() {
        if (isGamePaused) return;
        player.isMoving = false;

        if (activeDirection === 1) {
            if (player.x + 30 < chestX) player.x += player.speed;
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

        // Обновление прогресс-бара
        const progress = Math.min(100, Math.max(0, Math.floor((player.x / (chestX - 30)) * 100)));
        if (progressFillEl) progressFillEl.style.width = `${progress}%`;
        if (percentTextEl) percentTextEl.innerText = `${progress}%`;

        // Проверка близости к сундуку
        const isAtChest = (player.x + 25 >= chestX - 20);
        if (interactBtnEl) {
            interactBtnEl.style.display = (isAtChest && !isGamePaused) ? 'block' : 'none';
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        let cameraX = player.x - (canvas.width / 2) + 20;
        cameraX = Math.max(0, Math.min(cameraX, worldWidth - canvas.width));

        ctx.save();
        ctx.translate(-cameraX, 0);

        // Земля / платформа
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

        // Отрисовка персонажа из спрайт-листа
        if (spriteSheet.complete && spriteSheet.naturalWidth > 0) {
            const frameWidth = spriteSheet.naturalWidth / spriteData.columns;
            const frameHeight = spriteSheet.naturalHeight / spriteData.rows;

            ctx.drawImage(
                spriteSheet,
                player.currentFrame * frameWidth,
                player.currentRow * frameHeight,
                frameWidth, frameHeight,
                player.x, player.y,
                frameWidth * player.scale,
                frameHeight * player.scale
            );
        }

        ctx.restore();
    }

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    if (spriteSheet.complete) {
        requestAnimationFrame(gameLoop);
    } else {
        spriteSheet.onload = () => requestAnimationFrame(gameLoop);
    }
            }
