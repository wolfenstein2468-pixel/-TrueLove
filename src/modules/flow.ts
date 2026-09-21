import * as Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import Hls from 'hls.js';
import { FlowStep } from '../types';

export class FlowModule {
  private container: HTMLElement;
  private steps: FlowStep[];
  private onFinished: () => void;
  
  private currentIndex: number = 0;
  private isAnswered: boolean = false;
  private lastAnswerWasCorrect: boolean = false;
  private player: any = null;
  private hlsInstance: Hls | null = null;

  constructor(container: HTMLElement, steps: FlowStep[], onFinished: () => void) {
    this.container = container;
    this.steps = steps;
    this.onFinished = onFinished;
    this.renderLayout();
    this.initPlayer();
    this.renderStep();
  }

  private renderLayout(): void {
    this.container.innerHTML = `
      <div class="flow-screen-container">
        <div id="quizContainer" class="valentine-box">
          <div class="question-media-card">
            <img id="qImg" class="question-image" src="" alt="Question Image">
            <div id="qText" class="question-text-wrap"></div>
          </div>
          <div class="answers-grid">
            <button class="valentine-option" id="opt-0"></button>
            <button class="valentine-option" id="opt-1"></button>
            <button class="valentine-option" id="opt-2"></button>
            <button class="valentine-option" id="opt-3"></button>
          </div>
        </div>

        <div id="videoContainer" class="video-wrapper">
          <video id="flowPlayer" playsinline webkit-playsinline controls crossorigin></video>
          <button id="continueBtn" class="continue-btn-overlay">Продолжить ✨</button>
        </div>

        <div id="memeModal" class="meme-overlay">
          <div class="meme-card">
            <img id="memeImg" class="meme-img" src="" alt="Meme">
            <div id="memeTitle" class="meme-title"></div>
            <div id="memeDesc" class="meme-desc"></div>
          </div>
        </div>
      </div>
    `;

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`opt-${i}`);
      btn?.addEventListener('click', () => this.handleAnswer(i));
    }

    document.getElementById('continueBtn')?.addEventListener('click', () => this.onVideoContinue());
    document.getElementById('memeModal')?.addEventListener('click', () => this.closeMeme());
  }

  private initPlayer(): void {
    const videoEl = document.getElementById('flowPlayer') as HTMLVideoElement;
    if (videoEl) {
      const PlyrConstructor = (Plyr as any).default || Plyr;
      this.player = new PlyrConstructor(videoEl, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume'],
        loop: { active: false },
        clickToPlay: true
      });

      this.player.on('ended', () => {
        document.getElementById('continueBtn')?.classList.add('show');
      });
    }
  }

  private renderStep(): void {
    const step = this.steps[this.currentIndex];
    const quizBox = document.getElementById('quizContainer');
    const videoBox = document.getElementById('videoContainer');
    const continueBtn = document.getElementById('continueBtn');

    continueBtn?.classList.remove('show');

    if (!step) {
      this.onFinished();
      return;
    }

    if (step.type === 'quiz') {
      if (videoBox) videoBox.classList.remove('active');
      if (quizBox) quizBox.style.display = 'block';

      // Останавливаем видео при возврате к квизу, если оно играло
      if (this.player) {
        this.player.pause();
      }

      const imgEl = document.getElementById('qImg') as HTMLImageElement;
      if (imgEl) {
        if (step.questionImage) {
          imgEl.src = step.questionImage;
          imgEl.style.display = 'block';
        } else {
          imgEl.style.display = 'none';
        }
      }

      const qText = document.getElementById('qText');
      if (qText && step.question) qText.innerText = step.question;

      for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`opt-${i}`);
        if (btn && step.answers && step.answers[i]) {
          btn.innerText = step.answers[i].text;
          btn.className = 'valentine-option';
          (btn as HTMLButtonElement).style.pointerEvents = 'auto';
        }
      }
      this.isAnswered = false;

    } else if (step.type === 'video') {
      if (quizBox) quizBox.style.display = 'none';
      if (videoBox) videoBox.classList.add('active');

      const videoEl = document.getElementById('flowPlayer') as HTMLVideoElement;
      if (videoEl && step.url) {
        // Очищаем предыдущий экземпляр HLS, если он был
        if (this.hlsInstance) {
          this.hlsInstance.destroy();
          this.hlsInstance = null;
        }

        const videoSrc = step.url;

        // Проверяем, является ли источник HLS потоком или обычным MP4
        if (videoSrc.includes('.m3u8')) {
          if (Hls.isSupported()) {
            this.hlsInstance = new Hls();
            this.hlsInstance.loadSource(videoSrc);
            this.hlsInstance.attachMedia(videoEl);
            this.hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
              this.playVideoSafely();
            });
          } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
            // Нативная поддержка Safari / iOS
            videoEl.src = videoSrc;
            this.playVideoSafely();
          }
        } else {
          // Обычный MP4 файл
          if (this.player) {
            this.player.source = {
              type: 'video',
              sources: [{ src: videoSrc, type: 'video/mp4' }]
            };
          }
          this.playVideoSafely();
        }
      }
    }
  }

  private playVideoSafely(): void {
    setTimeout(() => {
      if (this.player) {
        this.player.play().catch(() => {
          console.log("Autoplay restricted by mobile browser, waiting for user interaction.");
        });
      }
    }, 200);
  }

  private handleAnswer(selectedIndex: number): void {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const step = this.steps[this.currentIndex] as any;
    if (!step || step.type !== 'quiz') return;

    const ans = step.answers[selectedIndex];
    this.lastAnswerWasCorrect = selectedIndex === step.correctIndex;
    const selectedBtn = document.getElementById(`opt-${selectedIndex}`);

    if (selectedBtn) {
      selectedBtn.classList.add(this.lastAnswerWasCorrect ? 'correct' : 'wrong');
    }

    if (step.correctIndex !== undefined) {
      const correctBtn = document.getElementById(`opt-${step.correctIndex}`);
      if (correctBtn && !this.lastAnswerWasCorrect) {
        correctBtn.classList.add('correct');
      }
    }

    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`opt-${i}`);
      if (btn) (btn as HTMLButtonElement).style.pointerEvents = 'none';
    }

    setTimeout(() => {
      this.showMeme(ans);
    }, 400);
  }

  private showMeme(ans: any): void {
    const memeModal = document.getElementById('memeModal');
    const memeImg = document.getElementById('memeImg') as HTMLImageElement;
    const memeTitle = document.getElementById('memeTitle');
    const memeDesc = document.getElementById('memeDesc');

    if (memeImg) memeImg.src = ans.memeImg || '';
    if (memeTitle) memeTitle.innerText = ans.memeTitle || '';
    if (memeDesc) memeDesc.innerText = ans.memeDesc || '';

    memeModal?.classList.add('show');
  }

  private closeMeme(): void {
    const memeModal = document.getElementById('memeModal');
    memeModal?.classList.remove('show');

    if (this.lastAnswerWasCorrect) {
      this.currentIndex++;
      this.renderStep();
    } else {
      this.isAnswered = false;
      for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`opt-${i}`);
        if (btn) {
          btn.className = 'valentine-option';
          (btn as HTMLButtonElement).style.pointerEvents = 'auto';
        }
      }
    }
  }

  private onVideoContinue(): void {
    if (this.player) {
      this.player.pause();
    }
    this.currentIndex++;
    this.renderStep();
  }
}
