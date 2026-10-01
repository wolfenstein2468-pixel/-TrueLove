
import { GameStorage } from './modules/storage';

// Функция отображения финальной награды (если игра уже пройдена)
function showFinalReward(container: HTMLElement | null) {
    if (!container) return;
    container.innerHTML = `
        <div style="text-align: center; padding: 30px; display: flex; flex-direction: column; align-items: center; font-size: 20px; color: white;">
            🎁 Награда уже получена!
        </div>
    `;
}

// Стартовая точка приложения для теста игры
async function initTest() {
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = '';

    // Убираем фоновый класс интро/сейфа, если он остался
    document.body.classList.remove('intro-stage');

    // Проверка статуса прохождения (опционально для теста)
    if (GameStorage.isCompleted()) {
        showFinalReward(app);
        return;
    }

    // Создаем обертку для игры
    const gameWrapper = document.createElement('div');
    gameWrapper.className = 'game-module-wrapper';
    app.appendChild(gameWrapper);

    // Асинхронно подгружаем и запускаем модуль игры
    const gameModule = await import('./modules/game');
    gameModule.initGame(gameWrapper);
}

// Запускаем тест сразу при загрузке страницы
initTest();
