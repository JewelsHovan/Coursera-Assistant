// Constants for styling
const STYLES = `
  #coursera-helper-overlay {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
  }
  
  #coursera-helper-overlay .overlay-container {
    animation: overlayFadeIn 0.2s ease;
  }
  
  #coursera-helper-overlay .overlay-backdrop {
    animation: backdropFadeIn 0.2s ease;
  }
  
  @keyframes overlayFadeIn {
    from { opacity: 0; transform: translate(-50%, -48%); }
    to { opacity: 1; transform: translate(-50%, -50%); }
  }
  
  @keyframes backdropFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

export function createOverlayInterface() {
  const overlay = document.createElement('div');
  overlay.id = 'coursera-helper-overlay';
  overlay.innerHTML = `
    <div class="overlay-container" style="
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      max-width: 90vw;
      height: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      z-index: 10000;
      display: flex;
      flex-direction: column;
    ">
      <div class="overlay-header" style="
        padding: 16px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <h2 style="margin: 0; font-size: 18px;">Coursera Helper</h2>
        <button class="close-button" style="
          border: none;
          background: none;
          cursor: pointer;
          font-size: 20px;
          padding: 4px 8px;
        ">×</button>
      </div>
      <div class="overlay-content" style="
        padding: 16px;
        flex-grow: 1;
        overflow-y: auto;
      ">
        <div id="overlay-main-content">
          <h3>Transcript</h3>
          <div id="transcript-content"></div>
        </div>
      </div>
    </div>
    <div class="overlay-backdrop" style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      z-index: 9999;
    "></div>
  `;

  // Add styles
  const styles = document.createElement('style');
  styles.textContent = STYLES;
  overlay.appendChild(styles);

  // Add event listeners
  const closeButton = overlay.querySelector('.close-button');
  const backdrop = overlay.querySelector('.overlay-backdrop');

  const closeOverlay = () => {
    overlay.remove();
  };

  closeButton.addEventListener('click', closeOverlay);
  backdrop.addEventListener('click', closeOverlay);

  return overlay;
}

export function showOverlay(content) {
  const overlay = createOverlayInterface();
  const transcriptContent = overlay.querySelector('#transcript-content');

  if (content) {
    transcriptContent.textContent = content;
  }

  document.body.appendChild(overlay);
  return overlay;
}
