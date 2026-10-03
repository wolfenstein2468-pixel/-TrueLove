import './styles.css';
import './modules/game.css'; // если стили игры лежат отдельно
import { initGame } from './modules/game';

// Находим корневой контейнер
const app = document.getElementById('app');

if (app) {
    // Очищаем экран и создаем разметку для теста игры и карусели
    app.innerHTML = `
        <!-- Экран выбора скина -->
        <div id="selectScreen" class="select-screen">
            <h2>Выбери персонажа</h2>
            <div class="carousel">
                <button id="prevSkin">◀</button>
                <div id="skinPreview" style="width: 100px; height: 100px; background-size: contain; background-repeat: no-repeat; background-position: center;"></div>
                <button id="nextSkin">▶</button>
            </div>
            <div id="skinName">Герой 1</div>
            <button id="startBtn">В бой!</button>
        </div>

        <!-- Игровой интерфейс -->
        <div id="gameUi" class="game-ui" style="display: none;">
            <div class="progress-bar">
                <div id="progressFill" style="width: 0%; height: 10px; background: gold;"></div>
                <span id="percentText">0%</span>
            </div>
            
            <canvas id="gameCanvas" width="800" height="400" style="background: #222; display: block; margin: 20px auto;"></canvas>
            
            <button id="interactBtn" style="display:none;">Открыть сундук</button>
            
            <div class="controls">
                <button id="btnLeft">◀ Влево</button>
                <button id="btnRight">Вправо ▶</button>
            </div>
        </div>

        <!-- Диалог -->
        <div id="dialogBox" class="dialog-box" style="display: none;">
            <div id="dialogAvatar" style="width: 50px; height: 50px; background-size: contain;"></div>
            <div id="dialogText"></div>
            <button id="dialogNext">Далее</button>
        </div>

        <!-- Модалка победы -->
        <div id="winModal" class="win-modal" style="display: none;">
            <h3>Победа! Сундук открыт!</h3>
            <button id="finalRewardBtn">Играть снова</button>
        </div>
    `;

    // Простейшая логика карусели для теста перед стартом игры
    const skins = [
        { name: "Герой 1", src: "sprite.png" }, // Укажи путь к своим спрайтам в assets или корне
        { name: "Герой 2", src: "sprite2.png" }
    ];
    let currentSkinIndex = 0;

    const skinPreviewEl = document.getElementById('skinPreview') as HTMLElement;
    const skinNameEl = document.getElementById('skinName') as HTMLElement;
    const prevBtn = document.getElementById('prevSkin');
    const nextBtn = document.getElementById('nextSkin');
    const startBtn = document.getElementById('startBtn');
    const selectScreen = document.getElementById('selectScreen');
    const gameUi = document.getElementById('gameUi');

    function updateCarousel() {
        skinPreviewEl.style.backgroundImage = `url('${skins[currentSkinIndex].src}')`;
        skinNameEl.innerText = skins[currentSkinIndex].name;
    }

    prevBtn?.addEventListener('click', () => {
        currentSkinIndex = (currentSkinIndex - 1 + skins.length) % skins.length;
        updateCarousel();
    });

    nextBtn?.addEventListener('click', () => {
        currentSkinIndex = (currentSkinIndex + 1 + skins.length) % skins.length;
        updateCarousel();
    });

    updateCarousel();

    startBtn?.addEventListener('click', () => {
        if (selectScreen) selectScreen.style.display = 'none';
        if (gameUi) gameUi.style.display = 'block';
        
        // Запускаем твой модуль игры из src/modules/game.ts
        initGame(skins[currentSkinIndex].src);
    });
}
