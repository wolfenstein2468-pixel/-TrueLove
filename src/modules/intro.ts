import './intro.css';

export class IntroModule {
  private onFinished: () => void;

  constructor(onFinished: () => void) {
    this.onFinished = onFinished;
    this.init();
  }

  private init(): void {
    const envelopeCard = document.getElementById('envelopeCard');
    const modalOverlay = document.getElementById('modalOverlay');
    const video = document.getElementById('myVideo') as HTMLVideoElement;
    const fadeScreen = document.getElementById('fadeScreen');

    let isOpened = false;

    envelopeCard?.addEventListener('click', () => {
      if (isOpened) return;
      isOpened = true;

      envelopeCard.classList.add('open');

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
      fadeScreen?.classList.add('active');
      setTimeout(() => {
        this.onFinished();
      }, 1000); // Время совпадает с transition в CSS
    });
  }
}
