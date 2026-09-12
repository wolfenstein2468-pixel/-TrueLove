import './styles.css';
import { VaultModule } from './modules/vault';
import { IntroModule } from './modules/intro';
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
});


