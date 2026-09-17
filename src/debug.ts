export function showDebugLog(text: string, isError = false) {
  let debugBox = document.getElementById('debug-box');
  if (!debugBox) {
    debugBox = document.createElement('div');
    debugBox.id = 'debug-box';
    debugBox.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.9); color: #00ffcc; padding: 12px; font-size: 13px; z-index: 99999; max-height: 200px; overflow-y: auto; font-family: monospace; border-top: 2px solid #00ffcc;';
    document.body.appendChild(debugBox);
  }
  const item = document.createElement('div');
  item.style.color = isError ? '#ff4444' : '#00ffcc';
  item.style.marginBottom = '4px';
  item.textContent = `> ${text}`;
  debugBox.appendChild(item);
}
