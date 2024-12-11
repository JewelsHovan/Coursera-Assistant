import { extractTranscriptFromUrl } from './transcriptExtractor';

// Add this at the top of the file
const style = document.createElement('style');
style.textContent = `
  .rotating {
    animation: rotate 2s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Create and style the batch extract button
function createBatchExtractButton() {
  const button = document.createElement('button');
  button.className = 'batch-extract-button';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
    </svg>
    Extract All Transcripts
  `;

  // Match Coursera's subtle button styling
  button.style.cssText = `
    display: none; /* Hidden by default */
    align-items: center;
    width: 100%;
    padding: 8px 20px;
    margin: 4px 0;
    border: none;
    background: transparent;
    color: #2a73cc;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  `;

  button.addEventListener('mouseenter', () => {
    button.style.backgroundColor = 'rgba(42, 115, 204, 0.08)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = 'transparent';
  });

  button.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const section = button.closest('.rc-CollapsibleLesson');
    const lessonTitle = section.querySelector('h2').textContent.trim();

    // Find all video links in this section
    const videoLinks = Array.from(
      section.querySelectorAll('.rc-LessonItems a')
    ).filter((link) => {
      const itemName = link.querySelector('.rc-NavItemName');
      return itemName && itemName.textContent.includes('Video:');
    });

    if (videoLinks.length === 0) {
      alert('No video transcripts found in this section.');
      return;
    }

    updateButtonState(button, 'loading');

    try {
      // Extract transcripts from all videos
      const transcripts = await Promise.all(
        videoLinks.map((link) => {
          const title = link
            .querySelector('.rc-NavItemName')
            .textContent.replace('Video:', '')
            .trim();
          return extractTranscriptFromUrl(link.href, title);
        })
      );

      // Format and download
      const formattedText = formatTranscripts(transcripts, lessonTitle);
      await downloadTranscripts(formattedText, lessonTitle);

      updateButtonState(button, 'complete');

      // Reset button after 3 seconds
      setTimeout(() => {
        updateButtonState(button, 'idle');
      }, 3000);
    } catch (error) {
      console.error('Error extracting transcripts:', error);
      alert('Error extracting transcripts. Please try again.');
      updateButtonState(button, 'idle');
    }
  });

  return button;
}

// Add batch extract buttons to all lesson sections
export function injectBatchExtractButtons() {
  const lessonSections = document.querySelectorAll('.rc-CollapsibleLesson');

  lessonSections.forEach((section) => {
    // Check if button already exists
    if (section.querySelector('.batch-extract-button')) {
      return;
    }

    const button = createBatchExtractButton();
    const itemList = section.querySelector('.item-list');

    // Insert at the top of the item list
    if (itemList) {
      itemList.insertBefore(button, itemList.firstChild);
    }

    // Show/hide button based on section expansion
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'aria-expanded') {
          const isExpanded = section.querySelector(
            'button[aria-expanded="true"]'
          );
          button.style.display = isExpanded ? 'flex' : 'none';
        }
      });
    });

    // Observe the expand/collapse button
    const expandButton = section.querySelector('button[aria-expanded]');
    if (expandButton) {
      observer.observe(expandButton, { attributes: true });

      // Set initial state
      button.style.display =
        expandButton.getAttribute('aria-expanded') === 'true' ? 'flex' : 'none';
    }
  });
}

// Observer to handle dynamically loaded content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      injectBatchExtractButtons();
    }
  });
});

export function initBatchExtract() {
  injectBatchExtractButtons();

  // Observe DOM changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function formatTranscripts(transcripts, lessonTitle) {
  return (
    `# ${lessonTitle}\n\n` +
    transcripts
      .map(({ title, transcript }) => `## ${title}\n\n${transcript}\n\n---\n\n`)
      .join('')
  );
}

async function downloadTranscripts(text, filename) {
  const blob = new Blob([text], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.md`;

  try {
    document.body.appendChild(a);
    a.click();
  } finally {
    // Only try to remove if it's still a child
    if (a.parentNode === document.body) {
      document.body.removeChild(a);
    }
    URL.revokeObjectURL(url);
  }
}

function updateButtonState(button, state) {
  const states = {
    idle: {
      html: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
        </svg>
        Extract All Transcripts
      `,
      disabled: false,
    },
    loading: {
      html: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;" class="rotating">
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
        </svg>
        Extracting Transcripts...
      `,
      disabled: true,
    },
    complete: {
      html: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        Download Transcripts
      `,
      disabled: false,
    },
  };

  const newState = states[state];
  button.innerHTML = newState.html;
  button.disabled = newState.disabled;
}
