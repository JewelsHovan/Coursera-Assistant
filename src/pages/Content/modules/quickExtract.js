const QUICK_EXTRACT_STYLES = `
  .quick-extract-button {
    margin-left: 8px !important;
  }

  .quick-extract-notification {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #527885;
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    z-index: 10000;
    animation: notificationSlide 0.3s ease forwards, notificationFade 0.3s ease 2s forwards;
  }

  @keyframes notificationSlide {
    from { transform: translateY(100px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes notificationFade {
    to { opacity: 0; visibility: hidden; }
  }
`;

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'quick-extract-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Remove notification after animation completes
  setTimeout(() => {
    notification.remove();
  }, 2500);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification('✓ Transcript copied to clipboard');
  } catch (err) {
    console.error('Failed to copy:', err);
    showNotification('❌ Failed to copy transcript');
  }
}

export function createQuickExtractButton() {
  // Add styles
  const styles = document.createElement('style');
  styles.textContent = QUICK_EXTRACT_STYLES;
  document.head.appendChild(styles);

  // Create button matching Coursera's style
  const button = document.createElement('button');
  button.className =
    'cds-105 cds-button-disableElevation cds-button-ghost css-l0otf2 quick-extract-button';
  button.setAttribute('type', 'button');
  button.setAttribute('data-testid', 'quick-extract-button');

  button.innerHTML = `
    <span class="cds-button-label">
      <span class="cds-button-startIcon">
        <svg aria-hidden="true" fill="none" focusable="false" height="20" viewBox="0 0 20 20" width="20" class="css-1u8qly9">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3 3h14v14H3V3zm1 1v12h12V4H4z" fill="currentColor"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7 7h6v1H7V7zm0 3h6v1H7v-1zm0 3h4v1H7v-1z" fill="currentColor"/>
        </svg>
      </span>
      Quick Extract
    </span>
  `;

  // Add click handler
  button.addEventListener('click', async () => {
    const transcriptText = window.getTranscriptText();
    if (transcriptText === 'No transcript found.') {
      showNotification('❌ No transcript available');
      return;
    }
    await copyToClipboard(transcriptText);
  });

  return button;
}

export function injectQuickExtractButton() {
  // Find the container where the "Save note" button is located
  const saveNoteContainer = document.querySelector(
    '.rc-CaptureHighlightButton'
  );

  if (!saveNoteContainer) {
    console.log('Save note container not found');
    return;
  }

  // Remove existing quick extract button if it exists
  const existingButton = document.querySelector(
    '[data-testid="quick-extract-button"]'
  );
  if (existingButton) {
    existingButton.remove();
  }

  // Create and inject the new button
  const quickExtractButton = createQuickExtractButton();
  saveNoteContainer.appendChild(quickExtractButton);
}
