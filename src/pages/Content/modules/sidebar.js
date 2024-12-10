const SIDEBAR_STYLES = `
  #coursera-helper-sidebar {
    position: fixed;
    right: -300px;
    top: 0;
    width: 300px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    transition: right 0.3s ease;
    z-index: 9998;
    display: flex;
    flex-direction: column;
  }

  #coursera-helper-sidebar.open {
    right: 0;
  }

  .sidebar-toggle {
    position: fixed;
    right: 0px;
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
    right: 300px;
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
    overflow-y: auto;
  }

  .sidebar-button {
    display: block;
    width: 100%;
    padding: 12px 16px;
    margin: 8px 0;
    background: #f5f5f5;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: background 0.2s ease;
  }

  .sidebar-button:hover {
    background: #e5e5e5;
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

  // Create sidebar
  const sidebar = document.createElement('div');
  sidebar.id = 'coursera-helper-sidebar';
  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2 style="margin: 0; font-size: 18px;">Coursera Helper</h2>
    </div>
    <div class="sidebar-content">
      <button class="sidebar-button" data-action="extract-notes">
        📝 Extract Notes
      </button>
      <button class="sidebar-button" data-action="show-navigation">
        🗺️ Course Navigation
      </button>
      <button class="sidebar-button" data-action="show-settings">
        ⚙️ Settings
      </button>
      <button class="sidebar-button" data-action="show-help">
        ❓ Help
      </button>
    </div>
  `;

  // Add toggle functionality
  let isOpen = false;
  const toggleSidebar = () => {
    isOpen = !isOpen;
    sidebar.classList.toggle('open');
    toggle.classList.toggle('open');
  };

  toggle.addEventListener('click', toggleSidebar);

  // Add button click handlers
  const buttonHandlers = {
    'extract-notes': () => {
      const transcriptText = window.getTranscriptText();
      window.showOverlay(transcriptText);
    },
    'show-navigation': async () => {
      const links = await window.getVideoLinks();
      console.log('Navigation:', links);
      // Implement navigation view
    },
    'show-settings': () => {
      // Implement settings view
      console.log('Settings clicked');
    },
    'show-help': () => {
      // Implement help view
      console.log('Help clicked');
    },
  };

  sidebar.querySelectorAll('.sidebar-button').forEach((button) => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (buttonHandlers[action]) {
        buttonHandlers[action]();
      }
    });
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
