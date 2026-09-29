import './styles.css';
import './modules/flow.css';
import './modules/game.css';
import { initGame } from './modules/game';

const app = document.getElementById('app');

if (app) {
  // Сразу рисуем игровую разметку в обход сейфов и квизов для теста
  app.innerHTML = `
    <div class="game-ui-container">
      <div class="ui-bar">
        <span>Прогресс: </span><span id="percentText">0%</span>
        <div class="progress-bg">
          <div id="progressFill" class="progress-fill"></div>
        </div>
      </div>

      <div class="canvas-wrapper">
        <canvas id="gameCanvas" width="320" height="220"></canvas>
        <button id="interactBtn" class="interact-btn">Сундук!</button>
      </div>

      <div class="controls-row">
        <button id="btnLeft" class="ctrl-btn">◀</button>
        <button id="btnRight" class="ctrl-btn">▶</button>
      </div>

      <div id="dialogBox" class="dialog-box">
        <div id="dialogSpeaker" class="dialog-speaker">Персонаж</div>
        <div id="dialogText" class="dialog-text"></div>
        <button id="dialogNext" class="dialog-next">Далее</button>
      </div>

      <div id="winModal" class="win-modal">
        <div class="win-title">Победа!</div>
        <button id="finalRewardBtn" class="open-btn">Забрать награду</button>
      </div>
    </div>
  `;
  
  // Запускаем игру (путь к спрайту по умолчанию из public или через URL)
  initGame('gameCanvas');
}
