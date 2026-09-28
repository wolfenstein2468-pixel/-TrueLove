import './styles.css';
import { VaultModule } from './modules/vault';
import { IntroModule } from './modules/intro';
import { FlowModule } from './modules/flow';
import { GameStorage } from './modules/storage';
import { FlowStep } from './types';
import './modules/flow.css';
import data from './data.json';
import { initGame } from './modules/game'; // Укажи правильный путь к твоему файлу игры
import { BackgroundSwitcher } from './BackgroundSwitcher';

// Пример корректного использования:
const bgSwitcher = new BackgroundSwitcher('#appContainer');
bgSwitcher.setBackground('color', '#1e3c72');

// Запускаем игру, передавая ID канваса и спрайт
initGame('gameCanvas', 'sprite.png');

const secretCode = data.vault.secretCode as [number, number, number, number];

// 1. При старте включаем фоновый стиль для сейфа
document.body.classList.add('intro-stage');

// 2. Запускаем сейф
new VaultModule(secretCode, () => {
  const app = document.getElementById('app');
  if (app) app.innerHTML = ''; // Очищаем контейнер сейфа

  // Если игра уже пройдена — сразу ведем к финалу
  if (GameStorage.isCompleted()) {
    showFinalReward(app);
    return;
  }

  // Показываем конверт
  document.getElementById('modalOverlay')?.classList.remove('hidden');
  
  // 3. Запускаем модуль письма/видео
  new IntroModule(() => {
    // Видео закончилось, убираем временный класс сцены
    document.body.classList.remove('intro-stage');
    
    // 4. Запускаем квиз (FlowModule)
    if (app) {
      app.innerHTML = ''; // Очищаем экран под квиз
      const storySteps: FlowStep[] = data.flowSteps as FlowStep[];

      new FlowModule(app, storySteps, () => {
        // КВИЗ ЗАВЕРШЕН. Полностью очищаем app перед запуском игры!
        app.innerHTML = ''; 
        
        // 5. Запускаем игру строго после квиза
        const game = new GameModule(app, () => {
          GameStorage.saveComplete();
          game.destroy();
          showFinalReward(app);
        });
        
        game.start();
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
