export class GameModule {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animFrameId: number = 0;
  private onComplete: () => void;

  // Игровые сущности
  private player = {
    x: 50,
    y: 200,
    width: 24,
    height: 36,
    vx: 0,
    vy: 0,
    speed: 3,
    jumpPower: -8,
    grounded: false
  };

  private platforms = [
    { x: 0, y: 280, w: 600, h: 40 },  // Земля
    { x: 150, y: 200, w: 90, h: 12 },
    { x: 280, y: 140, w: 90, h: 12 },
    { x: 420, y: 90, w: 90, h: 12 }
  ];

  private chest = { x: 450, y: 50, w: 24, h: 24, reached: false };
  private keys: { [key: string]: boolean } = {};

  constructor(container: HTMLElement, onCompleteCallback: () => void) {
    this.onComplete = onCompleteCallback;

    // Создаем canvas динамически
    this.canvas = document.createElement('canvas');
    this.canvas.width = 480;
    this.canvas.height = 320;
    this.canvas.style.cssText = 'width: 100%; max-width: 480px; aspect-ratio: 3/2; background: #0d0612; border-radius: 12px; border: 1px solid rgba(255,182,193,0.2); box-shadow: 0 8px 20px rgba(0,0,0,0.6); display: block; margin: 0 auto;';
    
    container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    this.initInputs();
  }

  // Настройка управления (клавиатура + мобильные кнопки)
  private initInputs() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if ((e.code === 'Space' || e.code === 'ArrowUp') && this.player.grounded) {
        this.player.vy = this.player.jumpPower;
        this.player.grounded = false;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });
  }

  // Метод для управления с экранных кнопок (для телефона)
  public moveLeft(isDown: boolean) { this.keys['ArrowLeft'] = isDown; }
  public moveRight(isDown: boolean) { this.keys['ArrowRight'] = isDown; }
  public jump() {
    if (this.player.grounded) {
      this.player.vy = this.player.jumpPower;
      this.player.grounded = false;
    }
  }

  // Запуск игрового цикла
  public start() {
    const loop = () => {
      this.update();
      this.draw();
      if (!this.chest.reached) {
        this.animFrameId = requestAnimationFrame(loop);
      }
    };
    loop();
  }

  public destroy() {
    cancelAnimationFrame(this.animFrameId);
    this.canvas.remove();
  }

  private update() {
    // Горизонтальное движение
    this.player.vx = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) this.player.vx = -this.player.speed;
    if (this.keys['ArrowRight'] || this.keys['KeyD']) this.player.vx = this.player.speed;

    this.player.x += this.player.vx;

    // Границы экрана
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x + this.player.width > this.canvas.width) {
      this.player.x = this.canvas.width - this.player.width;
    }

    // Гравитация
    this.player.vy += 0.4; // гравитация
    this.player.y += this.player.vy;
    this.player.grounded = false;

    // Коллизии с платформами
    for (let p of this.platforms) {
      if (
        this.player.x < p.x + p.w &&
        this.player.x + this.player.width > p.x &&
        this.player.y + this.player.height >= p.y &&
        this.player.y + this.player.height - this.player.vy <= p.y + 8 &&
        this.player.vy > 0
      ) {
        this.player.y = p.y - this.player.height;
        this.player.vy = 0;
        this.player.grounded = true;
      }
    }

    // Проверка сбора сундука
    if (
      !this.chest.reached &&
      this.player.x < this.chest.x + this.chest.w &&
      this.player.x + this.player.width > this.chest.x &&
      this.player.y < this.chest.y + this.chest.h &&
      this.player.y + this.player.height > this.chest.y
    ) {
      this.chest.reached = true;
      // Вызываем событие победы
      setTimeout(() => this.onComplete(), 300);
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Рисуем платформы
    this.ctx.fillStyle = '#261433';
    for (let p of this.platforms) {
      this.ctx.fillRect(p.x, p.y, p.w, p.h);
      this.ctx.strokeStyle = '#ff4d8d';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(p.x, p.y, p.w, p.h);
    }

    // Рисуем сундук (цель)
    this.ctx.fillStyle = this.chest.reached ? '#00ffcc' : '#ffcc00';
    this.ctx.fillRect(this.chest.x, this.chest.y, this.chest.w, this.chest.h);

    // Рисуем персонажа (Хината)
    this.ctx.fillStyle = '#ff4d8d';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    // Глаза персонажа для милоты
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(this.player.x + 14, this.player.y + 6, 4, 4);
  }
}
