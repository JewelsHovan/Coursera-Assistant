import { indexCourse } from './courseIndexer';
import { getStoredTranscripts } from './courseIndexer';

// Add this before createSidebar function
export function updateSidebarStatus(message, type = 'info') {
  const statusEl = document.querySelector('.current-transcript');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = `current-transcript status-${type}`; // Add CSS for different status types
  }
}

export function createSidebar() {
  // Remove existing sidebar if it exists
  const existingSidebar = document.querySelector('#coursera-helper-sidebar');
  if (existingSidebar) {
    existingSidebar.remove();
  }

  // Instead of inline styles, inject the CSS file
  const existingStyles = document.querySelector('#coursera-helper-styles');
  if (!existingStyles) {
    const link = document.createElement('link');
    link.id = 'coursera-helper-styles';
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL('content.styles.css');
    document.head.appendChild(link);
  }

  // Create toggle button
  const toggle = document.createElement('div');
  toggle.className = 'sidebar-toggle';
  toggle.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 6h16M4 12h16M4 18h16"></path>
    </svg>
  `;

  // Create sidebar with new structure
  const sidebar = document.createElement('div');
  sidebar.id = 'coursera-helper-sidebar';
  sidebar.innerHTML = `
    <div class="resize-handle"></div>
    <div class="sidebar-header">
      <h2>Coursera AI Chat</h2>
    </div>
    <div class="transcript-selector">
      <select class="transcript-select">
        <option value="">Select a transcript...</option>
      </select>
      <div class="current-transcript"></div>
    </div>
    <div class="sidebar-content">
      <div class="chat-container">
        <div class="chat-messages">
          <div class="message assistant">
            <div class="message-content">
              Hello! I'm here to help you with the course content. You can ask me questions about the video or transcript.
            </div>
            <div class="message-time">Just now</div>
          </div>
        </div>
        <div class="chat-input-container">
          <textarea 
            class="chat-input" 
            placeholder="Ask about the video or transcript..."
            rows="1"
          ></textarea>
          <button class="chat-submit">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="sidebar-footer">
      <div class="footer-buttons">
        <button class="footer-button" data-action="index-course">
          📚 Index Course
        </button>
        <button class="footer-button" data-action="show-settings">
          ⚙️ Settings
        </button>
        <button class="footer-button" data-action="show-help">
          ❓ Help
        </button>
      </div>
    </div>
  `;

  // Add resize functionality
  const resizeHandle = sidebar.querySelector('.resize-handle');
  let isResizing = false;
  let startX;
  let startWidth;

  // Load saved width preference
  const savedWidth = localStorage.getItem('courseraHelperSidebarWidth');
  if (savedWidth) {
    sidebar.style.width = savedWidth + 'px';
  }

  function startResize(e) {
    isResizing = true;
    startX = e.pageX;
    startWidth = parseInt(getComputedStyle(sidebar).width, 10);

    // Add resizing class to disable transitions during resize
    sidebar.classList.add('resizing');
    toggle.classList.add('resizing');
    resizeHandle.classList.add('active');

    // Add event listeners to document for better drag handling
    document.addEventListener('mousemove', handleResize, { passive: true });
    document.addEventListener('mouseup', stopResize);

    // Prevent text selection while resizing
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'ew-resize';
  }

  function handleResize(e) {
    if (!isResizing) return;

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      const diff = startX - e.pageX;
      const newWidth = Math.min(Math.max(startWidth + diff, 300), 800);

      sidebar.style.width = `${newWidth}px`;

      // Only update toggle position if sidebar is open
      if (isOpen) {
        toggle.style.right = `${newWidth}px`;
      }

      // Update the closed position of the sidebar
      if (!isOpen) {
        sidebar.style.right = `-${newWidth}px`;
      }
    });
  }

  function stopResize() {
    if (!isResizing) return;

    isResizing = false;

    // Remove resizing classes to re-enable transitions
    sidebar.classList.remove('resizing');
    toggle.classList.remove('resizing');
    resizeHandle.classList.remove('active');

    // Clean up event listeners
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);

    // Restore user select and cursor
    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    // Save width preference
    localStorage.setItem('courseraHelperSidebarWidth', sidebar.style.width);
  }

  // Add touch support for mobile devices
  resizeHandle.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startResize({ pageX: e.touches[0].pageX });
  });

  document.addEventListener(
    'touchmove',
    (e) => {
      if (isResizing) {
        e.preventDefault();
        handleResize({ pageX: e.touches[0].pageX });
      }
    },
    { passive: false }
  );

  document.addEventListener('touchend', stopResize);

  resizeHandle.addEventListener('mousedown', startResize);

  // Instead of reassigning toggleSidebar, let's create it differently
  let isOpen = false;

  // Define toggleSidebar as a let instead of const
  let toggleSidebar = () => {
    isOpen = !isOpen;
    const currentWidth = parseInt(sidebar.style.width || '300', 10);

    if (isOpen) {
      sidebar.classList.add('open');
      toggle.classList.add('open');
      toggle.style.right = `${currentWidth}px`;
      sidebar.style.right = '0px';
      // Add transcript update here directly
      updateTranscriptOptions();
    } else {
      sidebar.classList.remove('open');
      toggle.classList.remove('open');
      toggle.style.right = '0px';
      sidebar.style.right = `-${currentWidth}px`;
    }
  };

  toggle.addEventListener('click', toggleSidebar);

  // Update button handlers
  const buttonHandlers = {
    'index-course': async () => {
      try {
        const button = sidebar.querySelector('[data-action="index-course"]');
        button.disabled = true;
        button.textContent = '📚 Indexing...';

        await indexCourse();

        // Update transcript selector after indexing
        await updateTranscriptOptions();

        button.textContent = '📚 Index Complete!';
        setTimeout(() => {
          button.disabled = false;
          button.textContent = '📚 Index Course';
        }, 2000);
      } catch (error) {
        console.error('Indexing failed:', error);
        const button = sidebar.querySelector('[data-action="index-course"]');
        button.textContent = '❌ Index Failed';
        setTimeout(() => {
          button.disabled = false;
          button.textContent = '📚 Index Course';
        }, 2000);
      }
    },
    'show-settings': () => {
      console.log('Settings clicked');
    },
    'show-help': () => {
      console.log('Help clicked');
    },
  };

  sidebar.querySelectorAll('.footer-button').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (buttonHandlers[action]) {
        buttonHandlers[action]();
      }
    });
  });

  // Add auto-expanding textarea behavior
  const chatInput = sidebar.querySelector('.chat-input');
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
  });

  // Add transcript selector functionality
  const transcriptSelect = sidebar.querySelector('.transcript-select');
  const currentTranscriptInfo = sidebar.querySelector('.current-transcript');

  async function updateTranscriptOptions() {
    const courseId = extractCourseId();
    const transcripts = await getStoredTranscripts(courseId);

    transcriptSelect.innerHTML = '';

    if (!transcripts || transcripts.length === 0) {
      transcriptSelect.innerHTML = `
        <option value="">No transcripts available - Click "Index Course"</option>
      `;
      return;
    }

    transcripts.forEach((transcript, index) => {
      const option = document.createElement('option');
      option.value = transcript.url;
      option.textContent = `${transcript.sectionTitle} - ${transcript.title}`;
      transcriptSelect.appendChild(option);

      // If this is the current video URL, select it
      if (window.location.href === transcript.url) {
        option.selected = true;
        currentTranscriptInfo.textContent = `Current: ${transcript.title}`;
      }
    });
  }

  // Update transcript selection change handler
  transcriptSelect.addEventListener('change', async (e) => {
    const selectedUrl = e.target.value;
    const courseId = extractCourseId();
    const transcripts = await getStoredTranscripts(courseId);

    const selectedTranscript = transcripts.find((t) => t.url === selectedUrl);
    if (selectedTranscript) {
      currentTranscriptInfo.textContent = `Current: ${selectedTranscript.title}`;
      // TODO: Update chat context with this transcript
      console.log('Selected transcript:', selectedTranscript);
    }
  });

  // Initial update
  updateTranscriptOptions();

  // Append elements to DOM
  document.body.appendChild(toggle);
  document.body.appendChild(sidebar);

  return {
    sidebar,
    toggle,
    toggleSidebar,
  };
}

// Helper function to extract course ID from URL
function extractCourseId() {
  const match = window.location.pathname.match(/learn\/(.+?)(\/|$)/);
  return match ? match[1] : null;
}
