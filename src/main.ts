import './styles.css';
import { VaultModule } from './modules/vault';
import { IntroModule } from './modules/intro';
import { FlowModule } from './modules/flow';
import { GameStorage } from './modules/storage';
import { FlowStep } from './types';
import './modules/flow.css';
import './modules/game.css';
import data from './data.json';
import { initGame } from './modules/game';

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

            new FlowModule(app, storySteps, () => {
                app.innerHTML = `
                    <div class="game-ui-container">
                        <div class="ui-bar">
                            <span>Прогресс:</span>
                            <span id="percentText">0%</span>
                        </div>
                        <div class="progress-bg">
                            <div id="progressFill" class="progress-fill"></div>
                        </div>

                        <div class="canvas-wrapper">
                            <canvas id="gameCanvas" width="320" height="220"></canvas>
                            <button id="interactBtn" class="interact-btn">Сундук!</button>

                            <div id="dialogBox" class="dialog-box">
                                <div id="dialogSpeaker" class="dialog-speaker">Персонаж</div>
                                <div id="dialogText" class="dialog-text">Приветствую! Сундук твой.</div>
                                <button id="dialogNext" class="dialog-next">Далее</button>
                            </div>

                            <div id="winModal" class="win-modal">
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

                // 5. Запускаем игру
                initGame('gameCanvas', 'sprite.png');
            });
        }
    });
});

// Финальный экран с наградой
function showFinalReward(container: HTMLElement | null) {
    if (!container) return;
    container.innerHTML = `
        <div style="text-align: center; padding: 30px; display: flex; flex-direction: column; align-items: center; font-size: 20px;">
            🎁 Карточка
        </div>
    `;
}
