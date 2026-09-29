import './styles.css';
import { VaultModule } from './modules/vault';
import { IntroModule } from './modules/intro';
import { FlowModule } from './modules/flow';
import { GameStorage } from './modules/storage';
import { FlowStep } from './types';
import './modules/flow.css';
import data from './data.json';
import { initGame } from './modules/game'; // Импортируем функцию initGame, а не GameModule!
import { BackgroundSwitcher } from './modules/BackgroundSwitcher';


// Инициализируем менеджер фона
const bgSwitcher = new BackgroundSwitcher('#app');
bgSwitcher.setBackground('color', '#1e3c72');

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

  document.getElementById('modalOverlay')?.classList.remove('hidden');
  
  // 3. Запускаем модуль письма/видео
  new IntroModule(() => {
    document.body.classList.remove('intro-stage');
    
    // 4. Запускаем квиз (FlowModule)
    if (app) {
      app.innerHTML = '';
      const storySteps: FlowStep[] = data.flowSteps as FlowStep[];

      new FlowModule(app, storySteps, () => {
        app.innerHTML = `
          <div class="game-ui active" id="gameUi" style="display:flex; flex-direction:column; align-items:center; width:100%; height:100%;">
            <div class="ui-bar">
              <span>Прогресс:</span>
              <span id="percentText">0%</span>
            </div>
            <div class="progress-bg">
              <div class="progress-fill" id="progressFill"></div>
            </div>
            <div class="canvas-wrapper" style="position:relative; width:100%;">
              <canvas id="gameCanvas" width="350" height="250"></canvas>
              <button id="interactBtn" class="interact-btn">Сундук!</button>
            </div>
            <div class="controls" style="display:flex; justify-content:space-between; width:100%; margin-top:15px;">
              <button id="btnLeft" class="ctrl-btn">◀</button>
              <button id="btnRight" class="ctrl-btn">▶</button>
            </div>
          </div>

          <!-- Диалоговое окно -->
          <div id="dialogBox" class="dialog-box">
            <div id="dialogAvatar" class="dialog-avatar"></div>
            <div class="dialog-content">
              <div class="dialog-speaker">Персонаж</div>
              <div id="dialogText" class="dialog-text"></div>
              <button id="dialogNext" class="dialog-next">Далее</button>
            </div>
          </div>

          <!-- Модалка победы -->
          <div id="winModal" class="win-modal">
            <div class="win-title">Победа!</div>
            <button id="finalRewardBtn" class="open-btn">Забрать награду</button>
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
    <div style="text-align: center; padding: 30px; display: flex; flex-direction: column; align-items: center; gap: 16px;">
      <h2>🎉 Миссия выполнена!</h2>
      <div style="background: rgba(255, 77, 141, 0.15); border: 1px solid rgba(255, 77, 141, 0.4); padding: 24px; border-radius: 16px; width: 100%; max-width: 340px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <h3 style="color: #ff4d8d; margin-bottom: 10px; font-size: 20px;">🎁 Карточка Free Fire</h3>
        <p style="font-size: 14px; color: #ddd; line-height: 1.5;">
          Все этапы пройдены, награда разблокирована!
        </p>
      </div>
    </div>
  `;
}
