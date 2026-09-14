import './styles.css';
import { VaultModule } from './modules/vault';
import { IntroModule } from './modules/intro';
import { FlowModule } from './modules/flow';
import { FlowStep } from './types';
import './modules/flow.css'; // Подключаем стили квиза
import data from './data.json';

const secretCode = data.vault.secretCode as [number, number, number, number];

// 1. При старте включаем фоновый стиль для сейфа
document.body.classList.add('intro-stage');

// 2. Запускаем сейф
new VaultModule(secretCode, () => {
  const app = document.getElementById('app');
  if (app) app.innerHTML = ''; // Очищаем контейнер сейфа

  // Показываем конверт
  document.getElementById('modalOverlay')?.classList.remove('hidden');
  
  // 3. Запускаем модуль письма/видео
  new IntroModule(() => {
    // ВАЖНО: Видео закончилось, убираем временный класс сцены!
    document.body.classList.remove('intro-stage');
    
    console.log('Видео завершено, переходим к следующему экрану (например, квизу)!');
    // Здесь запускай модуль следующего экрана (квиза)
  });
  // Внутри IntroModule при окончании видео или по таймеру:
const fadeScreen = document.getElementById('fadeScreen');

if (fadeScreen) {
  // Плавное затемнение (переход завязан на transition: opacity 1s ease из твоей разметки)
  fadeScreen.style.opacity = '1';

  setTimeout(() => {
    // Вызываем callback окончания интро (переход к квизу)
    this.onComplete();

    // Возвращаем экрану прозрачность, когда квиз уже отрендерился под черным фоном
    setTimeout(() => {
      fadeScreen.style.opacity = '0';
    }, 100);
  }, 1000); // Время должно совпадать с transition (1 секунда)
}

});


