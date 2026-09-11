import './styles.css';
import { VaultModule } from './modules/vault';
import { IntroModule } from './modules/intro';
import data from './data.json';

const secretCode = data.vault.secretCode as [number, number, number, number];

// Запускаем сейф
new VaultModule(secretCode, () => {
  // Когда сейф разгадан: убираем сейф и показываем конверт
  const app = document.getElementById('app');
  if (app) app.innerHTML = '';

  document.getElementById('modalOverlay')?.classList.remove('hidden');
  
  // Запускаем логику конверта, частиц и видео
  new IntroModule(() => {
    console.log('Видео завершено!');
  });
});

