import './intro.css';
export class IntroModule {
  private onFinished: () => void;
  private isOpened: boolean = false;
  private particles: any[] = [];
  private ambientHearts: any[] = [];
  
  private gradientPairs = [
    ['#ff4d6d', '#ff758f'],
    ['#ff0054', '#ff5400'],
    ['#7000ff', '#ff007f'],
    ['#ffb3c1', '#ffffff'],
    ['#ff85a1', '#fbb1bd'],
    ['#ff0077', '#ffb703'],
    ['#e0aaff', '#ff9e00']
  ];

  constructor(onFinished: () => void) {
    this.onFinished = onFinished;
    this.init();
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

    const drawGradientHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, colors: string[], alpha: number, angle = 0) => {
      c.save();
      c.translate(x, y);
      c.rotate(angle);
      c.globalAlpha = alpha;

      const grad = c.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
      grad.addColorStop(0, colors[0]);
      grad.addColorStop(1, colors[1]);
      c.fillStyle = grad;

      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      c.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      c.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      c.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      c.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      c.closePath();
      
      c.shadowColor = colors[0];
      c.shadowBlur = size * 0.3;
      c.fill();
      c.restore();
    };

    const createBurst = (x: number, y: number) => {
      for (let i = 0; i < 60; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 4;
        const randomColors = this.gradientPairs[Math.floor(Math.random() * this.gradientPairs.length)];
        
        this.particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 3,
          size: Math.random() * 28 + 16,
          colors: randomColors,
          alpha: 1,
          rot: Math.random() * Math.PI,
          vRot: (Math.random() - 0.5) * 0.12
        });
      }
    };

    const spawnAmbientHeart = () => {
      if (!this.isOpened) return;
      const randomColors = this.gradientPairs[Math.floor(Math.random() * this.gradientPairs.length)];
      this.ambientHearts.push({
        x: Math.random() * width,
        y: height + 40,
        vy: -(Math.random() * 2 + 1),
        vx: Math.sin(Math.random() * Math.PI) * 0.8,
        size: Math.random() * 25 + 14,
        colors: randomColors,
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

        drawGradientHeart(ctx, p.x, p.y, p.size, p.colors, Math.max(0, p.alpha), p.rot);
        if (p.alpha <= 0) this.particles.splice(i, 1);
      }

      for (let i = this.ambientHearts.length - 1; i >= 0; i--) {
        let h = this.ambientHearts[i];
        h.y += h.vy;
        h.x += Math.sin(h.y * 0.015) * 0.8;
        h.rot += h.vRot;

        drawGradientHeart(ctx, h.x, h.y, h.size, h.colors, h.alpha, h.rot);
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
