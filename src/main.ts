import './styles.css';
import { VaultModule } from './modules/vault';
import { IntroModule } from './modules/intro';
import { FlowModule } from './modules/flow';
import { FlowStep } from './types';
import './modules/flow.css';
import data from './data.json';
import { showDebugLog } from './modules/debug'; // Импортируем отладчик

const secretCode = data.vault.secretCode as [number, number, number, number];

showDebugLog('Приложение запущено, сейф ждет ввода');

// 1. При старте включаем фоновый стиль для сейфа
document.body.classList.add('intro-stage');

// 2. Запускаем сейф
new VaultModule(secretCode, () => {
  showDebugLog('Код сейфа введен верно!');
  const app = document.getElementById('app');
  if (app) app.innerHTML = ''; // Очищаем контейнер сейфа

  // Показываем конверт
  document.getElementById('modalOverlay')?.classList.remove('hidden');
  
  // 3. Запускаем модуль письма/видео
  new IntroModule(() => {
    showDebugLog('IntroModule завершил работу (видео закончилось)');
    
    // ВАЖНО: Видео закончилось и отработало затемнение, убираем временный класс сцены!
    document.body.classList.remove('intro-stage');
    
    console.log('Видео завершено, запускаем квиз!');
    
    // 4. Запускаем квиз (FlowModule) в контейнере `#app`
    if (app) {
      showDebugLog('Создаем FlowModule...');
      const storySteps: FlowStep[] = data.flowSteps as FlowStep[];

      try {
        const flow = new FlowModule(app, storySteps, () => {
          showDebugLog('История полностью завершена! 🎉');
          console.log('История полностью завершена!');
        });
        // Если у твоего FlowModule есть метод init() или render(), вызови его здесь, например:
        // flow.init(); 
        showDebugLog('FlowModule успешно запущен');
      } catch (err: any) {
        showDebugLog(`Ошибка в FlowModule: ${err.message}`, true);
      }
    } else {
      showDebugLog('Ошибка: элемент #app не найден!', true);
    }
  });
});
