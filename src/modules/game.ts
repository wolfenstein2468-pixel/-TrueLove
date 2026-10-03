// Функция отображения финальной награды (если игра уже пройдена)
function showFinalReward(container: HTMLElement | null) {
    if (!container) return;
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; background: #0f172a; color: white; font-family: 'Inter', sans-serif;">
            <div style="font-size: 50px; margin-bottom: 15px;">🎁</div>
            <h2 style="font-size: 24px; margin: 0 0 10px 0; color: #facc15;">Награда уже получена!</h2>
            <p style="color: #94a3b8; font-size: 14px; margin: 0;">Вы уже прошли это испытание и забрали свой приз.</p>
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

    // Без стоража: просто проверяем флаг в памяти сессии (или напрямую рендерим игру)
    const isCompleted = sessionStorage.getItem('game_is_completed') === 'true';
    if (isCompleted) {
        showFinalReward(app);
        return;
    }

    // Создаем обертку для игры
    const gameWrapper = document.createElement('div');
    gameWrapper.className = 'game-module-wrapper';
    app.appendChild(gameWrapper);

    try {
        // Асинхронно подгружаем и запускаем модуль игры
        const gameModule = await import('./modules/game');
        gameModule.initGame(gameWrapper);
    } catch (error) {
        console.error('Не удалось загрузить модуль игры:', error);
        app.innerHTML = `<div style="color: #ef4444; padding: 20px; text-align: center;">Ошибка загрузки модуля игры. Проверь путь к ./modules/game</div>`;
    }
}

// Запускаем тест сразу при загрузке страницы
initTest();
