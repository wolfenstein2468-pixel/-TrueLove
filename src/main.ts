export async function initGame(container: HTMLElement) {
    // 1. Внедряем CSS-стили динамически (всё в одном файле)
    if (!document.getElementById('game-inline-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'game-inline-styles';
        styleEl.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

            .game-wrapper {
                font-family: 'Inter', sans-serif;
                background: #0f172a;
                color: #f8fafc;
                width: 100%;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                padding: 15px;
            }

            .select-screen {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 24px;
                border-radius: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                max-width: 340px;
                width: 100%;
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            }

            .select-screen h2 {
                margin: 0 0 16px 0;
                font-size: 20px;
                font-weight: 700;
            }

            .carousel-container {
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 12px;
            }

            .skin-preview {
                width: 70px;
                height: 70px;
                background: #0f172a;
                border: 2px solid #38bdf8;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 28px;
            }

            .skin-name {
                font-size: 16px;
                font-weight: 600;
                color: #94a3b8;
                margin-bottom: 20px;
            }

            .open-btn {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 12px 24px;
                font-size: 15px;
                font-weight: 700;
                border-radius: 10px;
                cursor: pointer;
                width: 100%;
                transition: background 0.2s;
            }

            .open-btn:hover {
                background: #2563eb;
            }

            .ctrl-btn {
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: white;
                width: 36px;
                height: 36px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ctrl-btn:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .game-ui-container {
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 16px;
                border-radius: 20px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                max-width: 340px;
                width: 100%;
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
            }

            .ui-bar {
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                color: #94a3b8;
                font-weight: 600;
            }

            .progress-bg {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.08);
                border-radius: 3px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                width: 0%;
                background: #38bdf8;
                border-radius: 3px;
                transition: width 0.3s;
            }

            .canvas-wrapper {
                position: relative;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: #000;
            }

            canvas {
                display: block;
                width: 100%;
                height: auto;
            }

            .win-modal {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 23, 42, 0.95);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
            }

            .win-title {
                font-size: 22px;
                font-weight: 700;
                color: #facc15;
                margin-bottom: 15px;
            }

            .controls-row {
                display: flex;
                gap: 10px;
            }

            .controls-row .ctrl-btn {
                flex: 1;
                border-radius: 10px;
                height: 42px;
                font-weight: 600;
            }
        `;
        document.head.appendChild(styleEl);
    }

    // 2. Рендерим разметку игры
    container.innerHTML = `
        <div class="game-wrapper">
            <!-- Экран выбора скина -->
            <div id="selectScreen" class="select-screen">
                <h2>Выбери своего героя</h2>
                <div class="carousel-container">
                    <button id="prevSkin" class="ctrl-btn">◄</button>
                    <div id="skinPreview" class="skin-preview">🛡️</div>
                    <button id="nextSkin" class="ctrl-btn">►</button>
                </div>
                <div id="skinName" class="skin-name">Паладин</div>
                <button id="startBtn" class="open-btn">В бой!</button>
            </div>

            <!-- Игровой интерфейс -->
            <div id="gameUi" class="game-ui-container" style="display: none;">
                <div class="ui-bar">
                    <span>Прогресс:</span>
                    <span id="percentText">0%</span>
                </div>
                <div class="progress-bg">
                    <div id="progressFill" class="progress-fill"></div>
                </div>

                <div class="canvas-wrapper">
                    <canvas id="gameCanvas" width="320" height="220"></canvas>

                    <div id="winModal" class="win-modal" style="display: none;">
                        <div class="win-title">🏆 Победа!</div>
                        <button id="finalRewardBtn" class="open-btn">Забрать награду</button>
                    </div>
                </div>

                <div class="controls-row">
                    <button id="btnLeft" class="ctrl-btn">◄ Влево</button>
                    <button id="btnRight" class="ctrl-btn">Вправо ►</button>
                </div>
            </div>
        </div>
    `;

    // 3. Логика карусели и запуска
    const selectScreen = container.querySelector('#selectScreen') as HTMLElement;
    const gameUi = container.querySelector('#gameUi') as HTMLElement;
    const startBtn = container.querySelector('#startBtn') as HTMLButtonElement;

    let currentSkinIndex = 0;
    const skins = [
        { name: 'Паладин', icon: '🛡️' },
        { name: 'Маг огня', icon: '🔥' },
        { name: 'Убийца', icon: '🗡️' }
    ];
    
    const skinNameEl = container.querySelector('#skinName') as HTMLElement;
    const skinPreviewEl = container.querySelector('#skinPreview') as HTMLElement;
    const prevSkinBtn = container.querySelector('#prevSkin');
    const nextSkinBtn = container.querySelector('#nextSkin');

    function updateSkin() {
        if (skinNameEl) skinNameEl.textContent = skins[currentSkinIndex].name;
        if (skinPreviewEl) skinPreviewEl.textContent = skins[currentSkinIndex].icon;
    }

    prevSkinBtn?.addEventListener('click', () => {
        currentSkinIndex = (currentSkinIndex - 1 + skins.length) % skins.length;
        updateSkin();
    });

    nextSkinBtn?.addEventListener('click', () => {
        currentSkinIndex = (currentSkinIndex + 1) % skins.length;
        updateSkin();
    });

    startBtn?.addEventListener('click', () => {
        selectScreen.style.display = 'none';
        gameUi.style.display = 'flex';
        startMainGameLoop(container);
    });
}

// Игровой цикл
function startMainGameLoop(container: HTMLElement) {
    const canvas = container.querySelector('#gameCanvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    const percentText = container.querySelector('#percentText') as HTMLElement;
    const progressFill = container.querySelector('#progressFill') as HTMLElement;
    const winModal = container.querySelector('#winModal') as HTMLElement;
    const finalRewardBtn = container.querySelector('#finalRewardBtn') as HTMLButtonElement;

    if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#38bdf8';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎮 Игра идет...', canvas.width / 2, canvas.height / 2);
    }

    let progress = 0;
    const timer = setInterval(() => {
        progress += 25;
        if (percentText) percentText.textContent = `${progress}%`;
        if (progressFill) progressFill.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(timer);
            setTimeout(() => {
                if (winModal) winModal.style.display = 'flex';
            }, 400);
        }
    }, 500);

    finalRewardBtn?.addEventListener('click', () => {
        // Сохраняем флаг прохождения прямо в sessionStorage без всяких сторажей
        sessionStorage.setItem('game_is_completed', 'true');
        showFinalRewardScreen(container);
    });
}

// Экран финальной награды
function showFinalRewardScreen(container: HTMLElement) {
    container.innerHTML = `
        <div class="game-wrapper">
            <div class="select-screen" style="text-align: center;">
                <h2 style="color: #facc15;">🎉 Поздравляем!</h2>
                <div style="font-size: 50px; margin: 15px 0;">🎁</div>
                <p style="color: #94a3b8; font-size: 14px; margin-bottom: 20px;">Ваша секретная карточка успешно получена!</p>
            </div>
        </div>
    `;
}
