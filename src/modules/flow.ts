import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { FlowStep } from '../types';

export class FlowModule {
  private container: HTMLElement;
  private steps: FlowStep[];
  private onFinished: () => void;
  
  private currentIndex: number = 0;
  private isAnswered: boolean = false;
  private pendingNextStep: boolean = false;
  private player: Plyr | null = null;

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
          <video id="flowPlayer" playsinline controls crossorigin></video>
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
      this.player = new Plyr(videoEl, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume'],
        loop: { active: false }
      });

      this.player.once('ended', () => {
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
      if (qText) qText.innerText = step.question;

      for (let i = 0; i < 4; i++) {
        const btn = document.getElementById(`opt-${i}`);
        if (btn && step.answers[i]) {
          btn.innerText = step.answers[i].text;
          btn.className = 'valentine-option';
        }
      }
      this.isAnswered = false;

    } else if (step.type === 'video') {
      if (quizBox) quizBox.style.display = 'none';
      if (videoBox) videoBox.classList.add('active');

      if (this.player) {
        this.player.source = {
          type: 'video',
          sources: [{ src: step.url, type: 'video/mp4' }]
        };
        this.player.play();
      }
    }
  }

  private handleAnswer(selectedIndex: number): void {
    if (this.isAnswered) return;
    this.isAnswered = true;

    const step = this.steps[this.currentIndex] as any;
    if (!step || step.type !== 'quiz') return;

    const ans = step.answers[selectedIndex];
    const isCorrect = selectedIndex === step.correctIndex;
    const selectedBtn = document.getElementById(`opt-${selectedIndex}`);

    selectedBtn?.classList.add(isCorrect ? 'correct' : 'wrong');
    document.querySelectorAll('.valentine-option').forEach(btn => btn.classList.add('disabled'));

    const memeImg = document.getElementById('memeImg') as HTMLImageElement;
    const memeTitle = document.getElementById('memeTitle');
    const memeDesc = document.getElementById('memeDesc');
    const memeModal = document.getElementById('memeModal');

    if (memeImg) memeImg.src = ans.memeImg;
    if (memeTitle) memeTitle.innerText = ans.memeTitle;
    if (memeDesc) memeDesc.innerText = ans.memeDesc;
    memeModal?.classList.add('active');

    this.pendingNextStep = isCorrect;
  }

    private closeMeme(): void {
    document.getElementById('memeModal')?.classList.remove('active');

    if (this.pendingNextStep) {
      this.currentIndex++;
      this.renderStep();
    } else {
      document.querySelectorAll('.valentine-option').forEach(btn => {
        btn.classList.remove('disabled', 'wrong', 'correct');
      });
      this.isAnswered = false;
    }
  }

  private onVideoContinue(): void {
    this.currentIndex++;
    this.renderStep();
  }
}
