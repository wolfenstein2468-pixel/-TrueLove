// src/modules/game.ts

export interface GameOptions {
    containerId: string;
    scoreElementId?: string;
}

export class GameEngine {
    private container: HTMLElement | null;
    private score: number = 0;

    constructor(options: GameOptions) {
        this.container = document.getElementById(options.containerId);
    }

    public init(): void {
        if (!this.container) {
            console.error("Game container not found!");
            return;
        }
        
        this.container.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <h2>Игровой модуль запущен</h2>
                <button id="click-btn" style="padding: 10px 20px; font-size: 16px;">Кликни меня!</button>
                <p>Счет: <span id="score-val">0</span></p>
            </div>
        `;

        const btn = document.getElementById("click-btn");
        btn?.addEventListener("click", () => {
            this.score++;
            const scoreVal = document.getElementById("score-val");
            if (scoreVal) scoreVal.textContent = String(this.score);
        });
    }
}
