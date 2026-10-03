// src/main.ts
import { GameEngine } from './modules/game';

document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.getElementById('app');
    
    if (appContainer) {
        // Создаем контейнер под игру, если его нет
        const gameDiv = document.createElement('div');
        gameDiv.id = 'game-root';
        appContainer.appendChild(gameDiv);

        // Инициализируем движок
        const game = new GameEngine({ containerId: 'game-root' });
        game.init();
    }
});
