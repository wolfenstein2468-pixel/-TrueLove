export type BackgroundType = 'image' | 'video' | 'color';

export class BackgroundSwitcher {
    private container: HTMLElement;
    private video: HTMLVideoElement;
    private bgLayer: HTMLDivElement;

    constructor(containerSelector: string) {
        const el = document.querySelector(containerSelector);
        if (!el) {
            throw new Error(`BackgroundSwitcher: Контейнер "${containerSelector}" не найден.`);
        }
        this.container = el as HTMLElement;

        // Гарантируем корректное позиционирование для абсолютных слоев фона
        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }
        this.container.style.overflow = 'hidden';

        // 1. Создаем видео-слой
        this.video = document.createElement('video');
        this.video.autoplay = true;
        this.video.muted = true;
        this.video.loop = true;
        this.video.playsInline = true;
        Object.assign(this.video.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: '-2',
            display: 'none'
        });
        this.container.appendChild(this.video);

        // 2. Создаем слой для картинок и фоновых цветов
        this.bgLayer = document.createElement('div');
        Object.assign(this.bgLayer.style, {
            position: 'absolute',
            inset: '0',
            width: '100%',
            height: '100%',
            zIndex: '-1',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transition: 'background 0.3s ease'
        });
        this.container.appendChild(this.bgLayer);
    }

    /**
     * Универсальный метод установки фона
     * @param type Тип фона: 'color' | 'image' | 'video'
     * @param src Путь к файлу, URL или CSS-код цвета/градиента
     */
    public setBackground(type: BackgroundType, src: string): void {
        if (type === 'video') {
            this.bgLayer.style.display = 'none';
            this.video.style.display = 'block';
            if (this.video.src !== src) {
                this.video.src = src;
                this.video.play().catch(() => {
                    // Автоплей может блокироваться браузером без mute, но mute уже включен
                });
            }
        } else {
            this.video.pause();
            this.video.style.display = 'none';
            this.bgLayer.style.display = 'block';

            if (type === 'color') {
                this.bgLayer.style.backgroundImage = 'none';
                this.bgLayer.style.backgroundColor = src;
            } else {
                this.bgLayer.style.backgroundImage = `url("${src}")`;
            }
        }
    }
}
