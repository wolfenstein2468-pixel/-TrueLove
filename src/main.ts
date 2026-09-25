import './styles.css';
import { VaultModule } from './modules/vault';
import { IntroModule } from './modules/intro';
import { FlowModule } from './modules/flow';
import { GameModule } from './modules/game';
import { GameStorage } from './modules/storage';
import { FlowStep } from './types';
import './modules/flow.css';
import data from './data.json';

const secretCode = data.vault.secretCode as [number, number, number, number];

// 1. При старте включаем фоновый стиль для сейфа
document.body.classList.add('intro-stage');

// 2. Запускаем сейф
new VaultModule(secretCode, () => {
  const app = document.getElementById('app');
  if (app) app.innerHTML = ''; // Очищаем контейнер сейфа

  // Если пользователь уже проходил игру ранее — сразу открываем финал
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
      const storySteps: FlowStep[] = data.flowSteps as FlowStep[];

      new FlowModule(app, storySteps, () => {
        // Квиз завершен! Запускаем мини-игру-платформер
        const game = new GameModule(app, () => {
          // Победа: дошли до сундука
          GameStorage.saveComplete(); // Сохраняем прогресс в localStorage
          game.destroy(); // Убираем холст и кнопки игры
          showFinalReward(app); // Показываем карточку награды
        });
        
        game.start();
      });
    }
  });
});

// Функция отрисовки финального экрана с наградой
function showFinalReward(container: HTMLElement | null) {
  if (!container) return;
  container.innerHTML = `
    <div style="text-align: center; padding: 30px; display: flex; flex-direction: column; align-items: center; gap: 16px;">
      <h2>🎉 Миссия выполнена!</h2>
      <div style="background: rgba(255, 77, 141, 0.15); border: 1px solid rgba(255, 77, 141, 0.4); padding: 24px; border-radius: 16px; width: 100%; max-width: 340px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
        <h3 style="color: #ff4d8d; margin-bottom: 10px; font-size: 20px;">🎁 Карточка Free Fire</h3>
        <p style="font-size: 14px; color: #ddd; line-height: 1.5;">
          Сундук успешно собран, все уровни пройдены. Твой специальный бонус разблокирован!
        </p>
      </div>
    </div>
  `;
}
