import './intro.css';

export class IntroModule {
  private onFinished: () => void;
  private isOpened: boolean = false;
  private particles: any[] = [];
  private ambientHearts: any[] = [];
  
  // Массив путей к твоим картинкам-сердечкам (положи файлы в папку public)
  private heartImages: HTMLImageElement[] = [];
  private imageSources = [
    '/heart1.png',
    '/heart2.png',
    '/heart3.png'
    // Добавь сюда столько путей, сколько нужно
  ];

  constructor(onFinished: () => void) {
    this.onFinished = onFinished;
    this.preloadImages(() => {
      this.init();
    });
  }

  // Предзагрузка картинок, чтобы они не дергались при появлении
  private preloadImages(callback: () => void) {
    let loadedCount = 0;
    if (this.imageSources.length === 0) {
      callback();
      return;
    }

    this.imageSources.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.heartImages.push(img);
        loadedCount++;
        if (loadedCount === this.imageSources.length) {
          callback();
        }
      };
      img.onerror = () => {
        // Если какая-то картинка не нашлась, всё равно продолжаем
        loadedCount++;
        if (loadedCount === this.imageSources.length) {
          callback();
        }
      };
    });
  }

  private init(): void {
    const canvas = document.getElementById('fxCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Отрисовка случайной картинки сердца вместо векторной графики
    const drawHeartImage = (c: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, size: number, alpha: number, angle = 0) => {
      if (!img) return;
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.globalAlpha = alpha;
      c.drawImage(img, -size / 2, -size / 2, size, size);
      c.restore();
    };

    const createBurst = (x: number, y: number) => {
      if (this.heartImages.length === 0) return;
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 4;
        const randomImg = this.heartImages[Math.floor(Math.random() * this.heartImages.length)];
        
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: Math.random() * 24 + 16,
          img: randomImg,
          alpha: 1,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.12
        });
      }
    };

    const spawnAmbientHeart = () => {
      if (!this.isOpened || this.heartImages.length === 0) return;
      const randomImg = this.heartImages[Math.floor(Math.random() * this.heartImages.length)];
      
      this.ambientHearts.push({
        x: Math.random() * width,
        y: height + 40,
        vy: -(Math.random() * 2 + 1),
        vx: Math.sin(Math.random() * Math.PI) * 0.8,
        size: Math.random() * 22 + 12,
        img: randomImg,
        alpha: Math.random() * 0.6 + 0.4,
        rot: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.05
      });
    };

    const loop = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        let p = this.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.alpha -= 0.012;
        p.rot += p.vRot;

        drawHeartImage(ctx, p.img, p.x, p.y, p.size, Math.max(0, p.alpha), p.rot);
        if (p.alpha <= 0) this.particles.splice(i, 1);
      }

      for (let i = this.ambientHearts.length - 1; i >= 0; i--) {
        let h = this.ambientHearts[i];
        h.y += h.vy;
        h.x += Math.sin(h.y * 0.015) * 0.8;
        h.rot += h.vRot;

        drawHeartImage(ctx, h.img, h.x, h.y, h.size, h.alpha, h.rot);
        if (h.y < -50) this.ambientHearts.splice(i, 1);
      }

      requestAnimationFrame(loop);
    };
    loop();

    setInterval(spawnAmbientHeart, 250);

    const envelopeCard = document.getElementById('envelopeCard');
    const modalOverlay = document.getElementById('modalOverlay');
    const video = document.getElementById('myVideo') as HTMLVideoElement;
    const fadeScreen = document.getElementById('fadeScreen');

    // Установка рандомного сердечка на саму печать конверта при инициализации
    const envelopeSeal = envelopeCard?.querySelector('.envelope-seal');
    if (envelopeSeal && this.heartImages.length > 0) {
      const randomSealImg = this.heartImages[Math.floor(Math.random() * this.heartImages.length)];
      envelopeSeal.innerHTML = `<img src="${randomSealImg.src}" style="width: 28px; height: 28px; object-fit: contain;" alt="seal" />`;
    }

    envelopeCard?.addEventListener('click', () => {
      if (this.isOpened) return;
      
      const rect = envelopeCard.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      envelopeCard.classList.add('open');
      createBurst(centerX, centerY);

      this.isOpened = true;
      if (video) {
        video.currentTime = 0;
        video.muted = false;
        video.loop = false;
        
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            video.muted = true;
            video.play();
          });
        }
        video.classList.add('active');
      }
      
      setTimeout(() => {
        modalOverlay?.classList.add('hidden');
      }, 500);
    });

    video?.addEventListener('ended', () => {
      this.isOpened = false;
      fadeScreen?.classList.add('active');
      setTimeout(() => {
        this.onFinished();
      }, 1000);
    });
  }
}
