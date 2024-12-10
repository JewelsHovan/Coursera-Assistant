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
    z-index: 9998;
    display: flex;
    flex-direction: column;
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
    padding: 16px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sidebar-content {
    padding: 16px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow-y: hidden;
  }

  .chat-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: hidden;
  }

  .chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 8px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .chat-input-container {
    display: flex;
    gap: 8px;
    padding: 8px 0;
  }

  .chat-input {
    flex-grow: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    resize: none;
    min-height: 44px;
    max-height: 120px;
  }

  .chat-submit {
    padding: 8px 16px;
    background: #527885;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .chat-submit:hover {
    background: #3f5c66;
  }

  .sidebar-footer {
    border-top: 1px solid #eee;
    padding: 16px;
  }

  .footer-buttons {
    display: flex;
    gap: 8px;
  }

  .footer-button {
    flex: 1;
    padding: 8px;
    background: #f5f5f5;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .footer-button:hover {
    background: #e5e5e5;
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
      <h2 style="margin: 0; font-size: 18px;">Coursera AI Chat</h2>
    </div>
    <div class="sidebar-content">
      <div class="chat-container">
        <div class="chat-messages">
          <!-- Messages will be inserted here -->
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

    resizeHandle.classList.add('active');
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);

    // Prevent text selection while resizing
    document.body.style.userSelect = 'none';
  }

  function handleResize(e) {
    if (!isResizing) return;

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
  }

  function stopResize() {
    isResizing = false;
    resizeHandle.classList.remove('active');
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);

    // Re-enable text selection
    document.body.style.userSelect = '';

    // Save width preference
    localStorage.setItem('courseraHelperSidebarWidth', sidebar.style.width);
  }

  resizeHandle.addEventListener('mousedown', startResize);

  // Update toggle functionality to handle custom widths
  let isOpen = false;
  const toggleSidebar = () => {
    isOpen = !isOpen;
    const currentWidth = parseInt(sidebar.style.width || '300', 10);

    if (isOpen) {
      sidebar.classList.add('open');
      toggle.classList.add('open');
      toggle.style.right = `${currentWidth}px`;
      sidebar.style.right = '0px';
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

  // Append elements to DOM
  document.body.appendChild(toggle);
  document.body.appendChild(sidebar);

  return {
    sidebar,
    toggle,
    toggleSidebar,
  };
}
