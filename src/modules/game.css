* { box-sizing: border-box; margin: 0; padding: 0; user-select: none; -webkit-user-select: none; }
body, html {
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    font-family: sans-serif;
}

/* Общий контейнер сайта/приложения — здесь работает BackgroundSwitcher */
.game-container {
    width: 100%;
    max-width: 380px;
    height: 100%;
    max-height: 650px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 30px rgba(0,0,0,0.8);
}

/* Экран выбора скина */
.select-screen {
    position: absolute;
    inset: 0;
    background: rgba(26, 26, 26, 0.85);
    backdrop-filter: blur(5px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 30;
    padding: 20px;
    text-align: center;
}
.select-screen.hidden { display: none; }
.select-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 20px;
    color: #ffd700;
    letter-spacing: 1px;
}
.carousel-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    width: 100%;
}
.skin-display {
    width: 120px;
    height: 150px;
    background: rgba(42, 42, 42, 0.9);
    border: 3px solid #ffd700;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}
.skin-preview {
    width: 60px;
    height: 75px;
    background-size: 300% 400%;
    background-position: 0 0;
    image-rendering: pixelated;
}
.skin-name {
    margin-top: 8px;
    font-size: 0.9rem;
    font-weight: bold;
    color: #fff;
}

/* Широкие кнопки переключения скинов */
.wide-buttons-row {
    display: flex;
    gap: 10px;
    width: 100%;
    max-width: 260px;
}
.wide-btn {
    background: rgba(51, 51, 51, 0.9);
    color: white;
    border: 2px solid #555;
    font-size: 1rem;
    font-weight: bold;
    padding: 12px;
    border-radius: 10px;
    cursor: pointer;
    flex: 1;
}
.wide-btn:active { background: #555; }

.start-game-btn {
    background: #ffd700;
    color: #000;
    font-weight: bold;
    border: none;
    padding: 12px 35px;
    border-radius: 25px;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
}

/* Игровой интерфейс */
.game-ui {
    width: 100%;
    height: 100%;
    display: none;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    background: rgba(0, 0, 0, 0.4);
}
.game-ui.active { display: flex; }

.ui-bar {
    width: 100%;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    font-weight: bold;
    letter-spacing: 1px;
}
.progress-bg {
    width: 100%;
    height: 6px;
    background: rgba(51, 51, 51, 0.8);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 8px;
    border: 1px solid #555;
}
.progress-fill {
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #ff7e5f, #feb47b);
    transition: width 0.1s linear;
}
.canvas-wrapper {
    position: relative;
    width: 100%;
}
canvas {
    background: transparent;
    border: 4px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
    image-rendering: pixelated;
    image-rendering: crisp-edges;
    width: 100%;
    max-width: 380px;
    height: 280px;
    display: block;
}

.interact-btn {
    display: none;
    position: absolute;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    background: #ffd700;
    color: #000;
    font-weight: bold;
    border: none;
    padding: 8px 18px;
    border-radius: 20px;
    font-size: 0.95rem;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.5);
    z-index: 10;
}

.dialog-box {
    display: none;
    position: absolute;
    bottom: 10px; left: 10px; right: 10px;
    background: rgba(20, 20, 30, 0.95);
    border: 3px solid #ffd700;
    border-radius: 8px;
    padding: 12px;
    z-index: 15;
    box-shadow: 0 5px 15px rgba(0,0,0,0.7);
}
.dialog-box.active { display: flex; gap: 10px; align-items: center; }
.dialog-avatar {
    width: 50px; height: 50px;
    background: #444; border: 2px solid #fff; border-radius: 4px;
    flex-shrink: 0; background-size: 300% 400%; background-position: 0 0;
    image-rendering: pixelated;
}
.dialog-content { flex-grow: 1; display: flex; flex-direction: column; }
.dialog-speaker { font-size: 0.75rem; color: #ffd700; font-weight: bold; margin-bottom: 4px; }
.dialog-text { font-size: 0.82rem; line-height: 1.2; color: #fff; min-height: 30px; }
.dialog-next {
    margin-top: 6px; align-self: flex-end; background: #ffd700; color: #000;
    border: none; padding: 3px 10px; font-size: 0.75rem; font-weight: bold; border-radius: 4px; cursor: pointer;
}

.win-modal {
    display: none;
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    flex-direction: column; align-items: center; justify-content: center;
    z-index: 20; text-align: center; padding: 20px;
}
.win-modal.active { display: flex; }
.win-title { font-size: 1.1rem; font-weight: bold; margin: 12px 0; color: #ffd700; }
.open-btn { background: #4cd137; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-size: 0.95rem; font-weight: bold; cursor: pointer; }

.controls {
    display: flex; justify-content: space-between; width: 100%; margin-top: auto; padding-bottom: 10px;
}
.ctrl-btn {
    background: rgba(34, 34, 34, 0.9); color: white; border: 3px solid #fff; font-size: 2rem;
    width: 48%; height: 65px; border-radius: 12px; display: flex; justify-content: center; align-items: center;
    cursor: pointer; touch-action: manipulation; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
.ctrl-btn:active { background: #444; }
