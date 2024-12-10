const SIDEBAR_STYLES = `
  #coursera-helper-sidebar {
    position: fixed;
    right: -300px;
    top: 0;
    width: 300px;
    min-width: 300px;
    max-width: 800px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    transition: right 0.3s ease;
    will-change: width, right;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    font-size: clamp(14px, 1vw, 16px);
  }

  #coursera-helper-sidebar.open {
    right: 0 !important;
  }

  .sidebar-toggle {
    position: fixed;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: #527885;
    color: white;
    padding: 12px;
    border-radius: 8px 0 0 8px;
    cursor: pointer;
    z-index: 9997;
    transition: right 0.3s ease;
  }

  .sidebar-toggle.open {
    /* Will be set dynamically in JS */
  }

  .sidebar-header {
    padding: clamp(12px, 2vh, 20px);
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 60px;
  }

  .sidebar-header h2 {
    font-size: clamp(16px, 1.2vw, 20px);
    margin: 0;
    color: #2a2f45;
  }

  .sidebar-content {
    padding: clamp(12px, 2vh, 24px);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .chat-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: clamp(8px, 1.5vh, 16px);
    overflow: hidden;
  }

  .chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: clamp(8px, 1.5vh, 16px);
    background: #f8f9fa;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  /* New Message Styles */
  .message {
    display: flex;
    flex-direction: column;
    gap: 4px;
    max-width: 85%;
    animation: messageAppear 0.3s ease;
  }

  .message.user {
    align-self: flex-end;
  }

  .message-content {
    padding: clamp(8px, 1.5vh, 12px) clamp(12px, 2vw, 16px);
    border-radius: 12px;
    line-height: 1.4;
  }

  .message.user .message-content {
    background: #527885;
    color: white;
    border-radius: 12px 12px 2px 12px;
  }

  .message.assistant .message-content {
    background: #e9ecef;
    color: #2a2f45;
    border-radius: 12px 12px 12px 2px;
  }

  .message-time {
    font-size: 0.8em;
    color: #666;
    opacity: 0.8;
  }

  .chat-input-container {
    display: flex;
    gap: 8px;
    padding: clamp(8px, 1.5vh, 12px) 0;
    position: relative;
  }

  .chat-input {
    flex-grow: 1;
    padding: clamp(12px, 2vh, 16px);
    padding-right: 40px;
    border: 1px solid #ddd;
    border-radius: 12px;
    resize: none;
    min-height: 44px;
    max-height: 120px;
    font-size: inherit;
    line-height: 1.4;
    transition: all 0.2s ease;
  }

  .chat-input:focus {
    outline: none;
    border-color: #527885;
    box-shadow: 0 0 0 2px rgba(82, 120, 133, 0.2);
  }

  .chat-submit {
    width: 40px;
    height: 40px;
    padding: 8px;
    background: #527885;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chat-submit:hover {
    background: #3f5c66;
    transform: scale(1.05);
  }

  .chat-submit:active {
    transform: scale(0.95);
  }

  .sidebar-footer {
    border-top: 1px solid #eee;
    padding: clamp(12px, 2vh, 20px);
  }

  .footer-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .footer-button {
    padding: clamp(8px, 1.5vh, 12px);
    background: #f5f5f5;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.9em;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .footer-button:hover {
    background: #e5e5e5;
    transform: translateY(-1px);
  }

  /* Animations */
  @keyframes messageAppear {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Responsive Breakpoints */
  @media (min-width: 400px) {
    .footer-button {
      font-size: 1em;
    }
  }

  @media (min-width: 600px) {
    .chat-messages {
      gap: 20px;
    }
    
    .message {
      max-width: 80%;
    }
  }

  .resize-handle {
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    cursor: ew-resize;
    background: transparent;
    transition: background 0.2s ease;
    touch-action: none;
    will-change: background;
  }

  .resize-handle:hover,
  .resize-handle.active {
    background: rgba(82, 120, 133, 0.2);
  }

  .resize-handle::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    height: 40px;
    width: 2px;
    background: #527885;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .resize-handle:hover::after,
  .resize-handle.active::after {
    opacity: 0.5;
  }

  .transcript-selector {
    padding: clamp(8px, 1.5vh, 16px);
    border-bottom: 1px solid #eee;
    background: #f8f9fa;
  }

  .transcript-select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: inherit;
    transition: all 0.2s ease;
  }

  .transcript-select:hover {
    border-color: #527885;
  }

  .transcript-select:focus {
    outline: none;
    border-color: #527885;
    box-shadow: 0 0 0 2px rgba(82, 120, 133, 0.2);
  }

  .transcript-select option {
    padding: 8px;
  }

  .current-transcript {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
  }

  /* During resize, disable transitions */
  #coursera-helper-sidebar.resizing {
    transition: none;
  }

  .sidebar-toggle.resizing {
    transition: none;
  }
`;

export function createSidebar() {
  // Remove existing sidebar if it exists
  const existingSidebar = document.querySelector('#coursera-helper-sidebar');
  if (existingSidebar) {
    existingSidebar.remove();
  }

  // Create styles
  const styles = document.createElement('style');
  styles.textContent = SIDEBAR_STYLES;
  document.head.appendChild(styles);

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
        <option value="">Loading transcripts...</option>
      </select>
      <div class="current-transcript"></div>
    </div>
    <div class="sidebar-content">
      <div class="chat-container">
        <div class="chat-messages">
          <!-- Example message structure -->
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
        <button class="footer-button" data-action="show-navigation">
          🗺️ Courses
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
    'show-navigation': async () => {
      console.log('Navigation clicked - will show course history');
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

  function updateTranscriptOptions() {
    // Get all video elements on the page
    const videoElements = document.querySelectorAll('video');
    const currentUrl = window.location.href;

    // Clear existing options
    transcriptSelect.innerHTML = '';

    if (videoElements.length === 0) {
      transcriptSelect.innerHTML = `
        <option value="">No videos found on page</option>
      `;
      return;
    }

    // Add options for each video
    videoElements.forEach((video, index) => {
      // Try to get video title from nearby elements (this will need to be adjusted based on Coursera's structure)
      const videoContainer = video.closest('[data-e2e="video-container"]');
      const videoTitle =
        videoContainer?.querySelector('[data-e2e="video-title"]')
          ?.textContent || `Video ${index + 1}`;

      const option = document.createElement('option');
      option.value = index;
      option.textContent = videoTitle;

      // If this is the current video, select it
      if (
        video
          .closest('[data-e2e="video-container"]')
          ?.contains(document.activeElement)
      ) {
        option.selected = true;
        currentTranscriptInfo.textContent = `Current: ${videoTitle}`;
      }

      transcriptSelect.appendChild(option);
    });
  }

  // Handle transcript selection change
  transcriptSelect.addEventListener('change', (e) => {
    const selectedIndex = e.target.value;
    const selectedOption = e.target.options[selectedIndex];
    currentTranscriptInfo.textContent = `Current: ${selectedOption.textContent}`;

    // TODO: Add logic to switch active transcript for chat context
    console.log(`Selected transcript: ${selectedOption.textContent}`);
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
