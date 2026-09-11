  import { SecretCode } from '../types';

export class VaultModule {
  private currentDials: number[] = [0, 0, 0, 0];
  private secretCode: SecretCode;
  private onUnlocked: () => void;

  constructor(secretCode: SecretCode, onUnlocked: () => void) {
    this.secretCode = secretCode;
    this.onUnlocked = onUnlocked;
    this.render();
    this.initListeners();
  }

  private render(): void {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div id="safe-screen">
        <div class="safe-card">
          <div id="safeTitle" class="safe-title">Secure Vault</div>
          
          <div class="combination-lock">
            <div class="dial-column">
              <button class="dial-btn">▲</button>
              <div class="dial-wheel">
                <span id="dial-0" class="dial-value">0</span>
              </div>
              <button class="dial-btn">▼</button>
            </div>

            <div class="dial-column">
              <button class="dial-btn">▲</button>
              <div class="dial-wheel">
                <span id="dial-1" class="dial-value">0</span>
              </div>
              <button class="dial-btn">▼</button>
            </div>

            <div class="dial-column">
              <button class="dial-btn">▲</button>
              <div class="dial-wheel">
                <span id="dial-2" class="dial-value">0</span>
              </div>
              <button class="dial-btn">▼</button>
            </div>

            <div class="dial-column">
              <button class="dial-btn">▲</button>
              <div class="dial-wheel">
                <span id="dial-3" class="dial-value">0</span>
              </div>
              <button class="dial-btn">▼</button>
            </div>
          </div>

          <button class="open-vault-btn">Разблокировать</button>
        </div>
      </div>
    `;
  }

  private initListeners(): void {
    document.querySelectorAll('.dial-column').forEach((column, index) => {
      const btnUp = column.querySelector('.dial-btn:nth-child(1)');
      const btnDown = column.querySelector('.dial-btn:nth-child(3)');

      btnUp?.addEventListener('click', () => this.changeDial(index, 1));
      btnDown?.addEventListener('click', () => this.changeDial(index, -1));
    });

    const openBtn = document.querySelector('.open-vault-btn');
    openBtn?.addEventListener('click', () => this.checkCombination());
  }

  private changeDial(index: number, direction: number): void {
    this.currentDials[index] += direction;
    if (this.currentDials[index] > 9) this.currentDials[index] = 0;
    if (this.currentDials[index] < 0) this.currentDials[index] = 9;

    const dialElem = document.getElementById(`dial-${index}`);
    if (dialElem) {
      dialElem.innerText = String(this.currentDials[index]);
      dialElem.style.transform = direction > 0 ? "translateY(-6px)" : "translateY(6px)";
      setTimeout(() => {
        dialElem.style.transform = "translateY(0)";
      }, 150);
    }
  }

  private checkCombination(): void {
    const safeScreen = document.getElementById('safe-screen');
    const safeTitle = document.getElementById('safeTitle');
    const safeCard = document.querySelector('.safe-card');

    const isCorrect = this.currentDials.every((val, i) => val === this.secretCode[i]);

    if (isCorrect) {
      safeScreen?.classList.add('fade-out');
      setTimeout(() => {
        this.onUnlocked();
      }, 300);
    } else {
      safeCard?.classList.add('shake');
      if (safeTitle) {
        safeTitle.innerText = "Access Denied";
        safeTitle.style.color = "#ff4757";
      }

      setTimeout(() => {
        safeCard?.classList.remove('shake');
      }, 500);
    }
  }
}
