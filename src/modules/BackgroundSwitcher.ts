export type BackgroundType = 'image' | 'video' | 'color';

export class BackgroundSwitcher {
    private container: HTMLElement;
    private video: HTMLVideoElement;
    private layer: HTMLDivElement;

    constructor(selector: string) {
        this.container = document.querySelector(selector) as HTMLElement;
        if (!this.container) throw new Error(`Контейнер ${selector} не найден`);

        if (getComputedStyle(this.container).position === 'static') {
            this.container.style.position = 'relative';
        }
        this.container.style.overflow = 'hidden';

        this.video = this.createMediaElement('video', { zIndex: '-2', display: 'none' }) as HTMLVideoElement;
        Object.assign(this.video, { autoplay: true, muted: true, loop: true, playsInline: true });

        this.layer = this.createMediaElement('div', { zIndex: '-1', backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background 0.3s ease' }) as HTMLDivElement;
    }

    private createMediaElement(tag: string, styles: Partial<CSSStyleDeclaration>): HTMLElement {
        const el = document.createElement(tag);
        Object.assign(el.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', ...styles });
        this.container.appendChild(el);
        return el;
    }

    public setBackground(type: BackgroundType, src: string): void {
        const isVideo = type === 'video';

        this.video.style.display = isVideo ? 'block' : 'none';
        this.layer.style.display = isVideo ? 'none' : 'block';

        if (isVideo) {
            if (this.video.src !== src) { this.video.src = src; this.video.play().catch(() => {}); }
        } else {
            this.layer.style.backgroundColor = type === 'color' ? src : 'transparent';
            this.layer.style.backgroundImage = type === 'image' ? `url("${src}")` : 'none';
        }
    }
}
