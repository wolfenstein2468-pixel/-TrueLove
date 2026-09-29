import './styles.css';
import { VaultModule } from './modules/vault';
import { IntroModule } from './modules/intro';
import { FlowModule } from './modules/flow';
import { GameStorage } from './modules/storage';
import { FlowStep } from './types';
import './modules/flow.css';
import data from './data.json';
// ВНИМАНИЕ: game.css больше не импортируем здесь! Он подгрузится внутри game.ts асинхронно.

const secretCode = data.vault.secretCode as [number, number, number, number];

// 1. При старте включаем фоновый стиль для сейфа
document.body.classList.add('intro-stage');

// 2. Запускаем сейф
new VaultModule(secretCode, () => {
    const app = document.getElementById('app');
    if (app) app.innerHTML = '';

    if (GameStorage.isCompleted()) {
        showFinalReward(app);
        return;
    }

    // 3. Запускаем модуль письма/видео
    new IntroModule(() => {
        document.body.classList.remove('intro-stage');

        // 4. Запускаем квиз
        if (app) {
            app.innerHTML = '';
            const storySteps: FlowStep[] = data.flowSteps as FlowStep[];

            new FlowModule(app, storySteps, async () => {
                // Квиз закончен! Очищаем экран под игру
                app.innerHTML = '';

                // Создаем обертку для игры, чтобы изолировать стили
                const gameWrapper = document.createElement('div');
                gameWrapper.className = 'game-module-wrapper';
                app.appendChild(gameWrapper);

                // Асинхронно подгружаем и запускаем модуль игры (Vite сделает это отдельным чанком)
                const gameModule = await import('./modules/game');
                gameModule.initGame(gameWrapper);
            });
        }
    });
});

// Финальный экран с наградой (если уже всё пройдено ранее)
function showFinalReward(container: HTMLElement | null) {
    if (!container) return;
    container.innerHTML = `
        <div style="text-align: center; padding: 30px; display: flex; flex-direction: column; align-items: center; font-size: 20px; color: white;">
            🎁 Награда уже получена!
        </div>
    `;
}
