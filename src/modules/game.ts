import { GameStorage } from './storage';

export async function initGame(container: HTMLElement) {
    // 1. Внедряем стили динамически для быстрого теста
    if (!document.getElementById('game-inline-styles')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'game-inline-styles';
        styleEl.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

            .game-module-wrapper {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #090d16 0%, #1e1b4b 100%);
                color: #f8fafc;
                width: 100%;
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
            }

            .select-screen {
                background: rgba(30, 41, 59, 0.7);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 24px;
                display: flex;
                flex-direction: column;
                align-items: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
                transition: opacity 0.3s ease;
                max-width: 360px;
                width: 100%;
            }

            .header-badge {
                background: rgba(56, 189, 248, 0.1);
                color: #38bdf8;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                margin-bottom: 15px;
                letter-spacing: 0.5px;
                text-transform: uppercase;
            }

            .select-screen h2 {
                margin: 0 0 20px 0;
                font-size: 22px;
                font-weight: 700;
                text-align: center;
            }

            .carousel-container {
                display: flex;
                align-items: center;
                gap: 20px;
                margin-bottom: 15px;
            }

            .skin-preview {
                width: 90px;
                height: 90px;
                background: radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(15,23,42,0.8) 100%);
                border: 2px solid rgba(56, 189, 248, 0.4);
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                box-shadow: 0 0 20px rgba(56, 189, 248, 0.2);
            }

            .skin-icon {
                font-size: 40px;
            }

            .skin-name {
                font-size: 18px;
                font-weight: 600;
                color: #e2e8f0;
                margin-bottom: 25px;
            }

            .action-btn {
                background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                color: white;
                border: none;
                padding: 12px 28px;
                font-size: 16px;
                font-weight: 700;
                border-radius: 12px;
                cursor: pointer;
                box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4);
                transition: all 0.2s ease;
                width: 100%;
            }

            .action-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(37, 99, 235, 0.6);
            }

            .ctrl-btn-nav {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: white;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: background 0.2s;
            }

            .ctrl-btn-nav:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .game-ui-container {
                background: rgba(15, 23, 42, 0.85);
                backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.08);
                padding: 20px;
                border-radius: 24px;
                display: flex;
                flex-direction: column;
                gap: 15px;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
                max-width: 360px;
                width: 100%;
            }

            .ui-header-bar {
                display: flex;
                justify-content: space-between;
                font-size: 13px;
                color: #94a3b8;
                font-weight: 600;
            }

            .ui-percent {
                color: #38bdf8;
            }

            .progress-bg {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #38bdf8);
                border-radius: 4px;
                transition: width 0.3s ease;
            }

            .canvas-wrapper {
                position: relative;
                border-radius: 14px;
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
                background: rgba(15, 23, 42, 0.9);
                backdrop-filter: blur(6px);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
                text-align: center;
            }

            .win-title {
                font-size: 24px;
                font-weight: 800;
                color: #facc15;
                margin-bottom: 5px;
            }

            .win-subtitle {
                font-size: 13px;
                color: #94a3b8;
                margin-bottom: 20px;
            }

            .success-btn {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
            }

            .success-btn:hover {
                box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
            }

            .controls-row {
                display: flex;
                gap: 10px;
            }

            .ctrl-btn-action {
                flex: 1;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: white;
                padding: 12px;
                border-radius: 12px;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            }

            .ctrl-btn-action:hover {
                background: rgba(255, 255, 255, 0.12);
            }

            .reward-screen {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                min-height: 100vh;
            }

            .reward-card {
                background: rgba(30, 41, 59, 0.8);
                backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.15);
                padding: 40px 30px;
                border-radius: 28px;
                text-align: center;
                max-width: 320px;
                width: 100%;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
                animation: scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            }

            .reward-icon-wrapper {
                font-size: 60px;
                margin-bottom: 15px;
            }

            .reward-card h2 {
                margin: 0 0 10px 0;
                font-size: 24px;
                color: #f8fafc;
            }

            .reward-card p {
                color: #94a3b8;
                font-size: 14px;
                line-height: 1.5;
                margin: 0;
            }

            @keyframes scaleUp {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(styleEl);
    }

    // 2. Рендерим HTML-разметку внутрь контейнера
    container.innerHTML = `
        <div class="game-module-wrapper">
            <!-- Экран выбора скина -->
            <div id="selectScreen" class="select-screen">
                <div class="header-badge">⚔️ Выбор персонажа</div>
                <h2>Выбери своего героя</h2>
                
                <div class="carousel-container">
                    <button id="prevSkin" class="ctrl-btn-nav" aria-label="Назад">◄</button>
                    <div id="skinPreview" class="skin-preview">
                        <div class="skin-icon" id="skinIcon">🛡️</div>
                    </div>
                    <button id="nextSkin" class="ctrl-btn-nav" aria-label="Вперед">►</button>
                </div>
                
                <div id="skinName" class="skin-name">Паладин</div>
                <button id="startBtn" class="action-btn primary-btn">В бой! 🚀</button>
            </div>

            <!-- Игровой интерфейс (изначально скрыт) -->
            <div id="gameUi" class="game-ui-container" style="display: none;">
                <div class="ui-header-bar">
                    <span class="ui-label">Происхождение миссии</span>
                    <span id="percentText" class="ui-percent">0%</span>
                </div>
                
                <div class="progress-bg">
                    <div id="progressFill" class="progress-fill" style="width: 0%;"></div>
                </div>

                <div class="canvas-wrapper">
                    <canvas id="gameCanvas" width="320" height="220"></canvas>
                    
                    <div id="winModal" class="win-modal" style="display: none;">
                        <div class="win-title">🏆 Победа!</div>
                        <p class="win-subtitle">Уровень успешно пройден</p>
                        <button id="finalRewardBtn" class="action-btn success-btn">Забрать награду</button>
                    </div>
                </div>

                <div class="controls-row">
                    <button id="btnLeft" class="ctrl-btn-action">◀ Влево</button>
                    <button id="btnRight" class="ctrl-btn-action">Вправо ▶</button>
                </div>
            </div>
        </div>
    `;

    // 3. Логика карусели скинов
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
    const skinIconEl = container.querySelector('#skinIcon') as HTMLElement;
    const prevSkinBtn = container.querySelector('#prevSkin');
    const nextSkinBtn = container.querySelector('#nextSkin');

    function updateSkinDisplay() {
        if (skinNameEl) skinNameEl.textContent = skins[currentSkinIndex].name;
        if (skinIconEl) skinIconEl.textContent = skins[currentSkinIndex].icon;
    }

    prevSkinBtn?.addEventListener('click', () => {
        currentSkinIndex = (currentSkinIndex - 1 + skins.length) % skins.length;
        updateSkinDisplay();
    });

    nextSkinBtn?.addEventListener('click', () => {
        currentSkinIndex = (currentSkinIndex + 1) % skins.length;
        updateSkinDisplay();
    });

    // Кнопка «В бой!»
    startBtn?.addEventListener('click', () => {
        selectScreen.style.opacity = '0';
        setTimeout(() => {
            selectScreen.style.display = 'none';
            gameUi.style.display = 'flex';
            startMainGameLoop(container);
        }, 300);
    });
}

// Игровой цикл
function startMainGameLoop(container: HTMLElement) {
    const canvas = container.querySelector('#gameCanvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    const winModal = container.querySelector('#winModal') as HTMLElement;
    const finalRewardBtn = container.querySelector('#finalRewardBtn') as HTMLButtonElement;
    const percentText = container.querySelector('#percentText') as HTMLElement;
    const progressFill = container.querySelector('#progressFill') as HTMLElement;

    // Отрисовка холста
    if (ctx) {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#38bdf8';
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('🎮 Игра запущена...', canvas.width / 2, canvas.height / 2 - 10);
    }

    // Симуляция прогресса для теста
    let progress = 0;
    const interval = setInterval(() => {
        progress += 20;
        if (percentText) percentText.textContent = `${progress}%`;
        if (progressFill) progressFill.style.width = `${progress}%`;

        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                if (winModal) winModal.style.display = 'flex';
            }, 500);
        }
    }, 400);

    finalRewardBtn?.addEventListener('click', () => {
        GameStorage.saveComplete();
        showFinalRewardScreen(container);
    });
}

// Экран финальной награды
function showFinalRewardScreen(container: HTMLElement) {
    container.innerHTML = `
        <div class="game-module-wrapper">
            <div class="reward-card">
                <div class="reward-icon-wrapper">🎁</div>
                <h2>🎉 Поздравляем!</h2>
                <p>Ваша секретная карточка успешно получена и сохранена!</p>
            </div>
        </div>
    `;
}
