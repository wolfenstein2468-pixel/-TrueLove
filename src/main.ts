import './styles.css';
import { VaultModule } from './modules/vault';
import data from './data.json';

// Забираем секретный код из json
const secretCode = data.vault.secretCode as [number, number, number, number];

new VaultModule(secretCode, () => {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = `<div style="text-align: center; font-size: 1.5rem; margin-top: 40vh; color: #3fb950;">Сейф успешно открыт! Переход к следующей сцене...</div>`;
  }
});
