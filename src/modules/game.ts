import './game.css'; // Стили игры теперь грузятся прямо здесь
import { GameStorage } from './storage';

export async function initGame(container: HTMLElement) {
    // 1. Рендерим всю игровую разметку (выбор скина, канвас, UI, модалки) внутрь контейнера
    container.innerHTML = `
        <!-- Экран выбора скина -->
        <div id="selectScreen" class="select-screen">
            <h2>Выбери своего героя</h2>
            <div class="carousel-container">
                <button id="prevSkin" class="ctrl-btn">◄</button>
                <div id="skinPreview" class="skin-preview"></div>
                <button id="nextSkin" class="ctrl-btn">►</button>
            </div>
            <div id="skinName" class="skin-name">Герой 1</div>
            <button id="startBtn" class="open-btn">В бой!</button>
        </div>

        <!-- Игровой интерфейс (изначально скрыт, пока не выберем скина/нажмем старт) -->
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
                <button id="interactBtn" class="interact-btn" style="display: none;">Сундук!</button>

                <div id="dialogBox" class="dialog-box" style="display: none;">
                    <div id="dialogAvatar" class="dialog-avatar"></div>
                    <div class="dialog-content">
                        <div id="dialogText" class="dialog-text">Приветствую!</div>
                        <button id="dialogNext" class="dialog-next">Далее</button>
                    </div>
                </div>

                <div id="winModal" class="win-modal" style="display: none;">
                    <div class="win-title">Победа!</div>
                    <button id="finalRewardBtn" class="open-btn">Забрать награду</button>
                </div>
            </div>

            <div class="controls-row">
                <button id="btnLeft" class="ctrl-btn">◄</button>
                <button id="btnRight" class="ctrl-btn">►</button>
            </div>
        </div>
    `;

    // 2. Навешиваем логику выбора скина и запуска игры
    const selectScreen = container.querySelector('#selectScreen') as HTMLElement;
    const gameUi = container.querySelector('#gameUi') as HTMLElement;
    const startBtn = container.querySelector('#startBtn') as HTMLButtonElement;

    // Логика карусели скинов (пример)
    let currentSkinIndex = 0;
    const skins = ['Герой 1', 'Герой 2', 'Герой 3'];
    const skinNameEl = container.querySelector('#skinName') as HTMLElement;
    
    const prevSkinBtn = container.querySelector('#prevSkin');
    const nextSkinBtn = container.querySelector('#nextSkin');

    prevSkinBtn?.addEventListener('click', () => {
        currentSkinIndex = (currentSkinIndex - 1 + skins.length) % skins.length;
        if (skinNameEl) skinNameEl.textContent = skins[currentSkinIndex];
    });

    nextSkinBtn?.addEventListener('click', () => {
        currentSkinIndex = (currentSkinIndex + 1) % skins.length;
        if (skinNameEl) skinNameEl.textContent = skins[currentSkinIndex];
    });

    // Кнопка «В бой!»
    startBtn?.addEventListener('click', () => {
        selectScreen.style.display = 'none';
        gameUi.style.display = 'block';
        
        // Запускаем игровой цикл, канвас и т.д.
        startMainGameLoop(container);
    });
}

// Внутренняя логика самого игрового процесса
function startMainGameLoop(container: HTMLElement) {
    const canvas = container.querySelector('#gameCanvas') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');
    const percentText = container.querySelector('#percentText') as HTMLElement;
    const progressFill = container.querySelector('#progressFill') as HTMLElement;
    const winModal = container.querySelector('#winModal') as HTMLElement;
    const finalRewardBtn = container.querySelector('#finalRewardBtn') as HTMLButtonElement;

    // Пример отрисовки пустого канваса / теста
    if (ctx) {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '16px sans-serif';
        ctx.fillText('Игра идет...', 110, 110);
    }

    // Симуляция победы для теста (или привязывай свои обработчики нажатий/прогресса)
    // Например, по клику на финальную награду:
        finalRewardBtn?.addEventListener('click', () => {
        GameStorage.saveComplete(); // Правильный метод из storage.ts
        showFinalRewardScreen(container);
    });
    
}

// Экран финальной награды внутри модуля игры
function showFinalRewardScreen(container: HTMLElement) {
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; display: flex; flex-direction: column; align-items: center; font-size: 20px; color: white;">
            <h2>🎉 Поздравляем!</h2>
            <div style="margin: 20px 0; font-size: 40px;">🎁</div>
            <p>Ваша секретная карточка получена!</p>
        </div>
    `;
}
