/**
 * @file This file is the entry point for the Coursera Helper extension's content script.
 * It initializes the extension's features and handles communication with the background script.
 */
import { printLine } from './modules/print';
import { showOverlay } from './modules/overlay';
import { createSidebar } from './modules/sidebar';
import { injectQuickExtractButton } from './modules/quickExtract';
import { initBatchExtract } from './modules/batchExtract';
import { getStoredTranscripts } from './modules/courseIndexer';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

// Configuration constants for the extension
const CONFIG = {
  MAX_RECONNECT_ATTEMPTS: 5, // Maximum number of times to attempt reconnection
  CACHE_DURATION: 3600000, // Duration to cache navigation data (1 hour in milliseconds)
  RETRY_DELAY: 100, // Delay before retrying a failed operation (in milliseconds)
};

// State variables for the extension
let state = {
  isConnected: false, // Flag indicating if the content script is connected to the background script
  reconnectAttempts: 0, // Number of reconnection attempts made
  lastUrl: window.location.href, // Last recorded URL
  navigationCache: { url: null, data: null }, // Cache for navigation data
};

// Utility functions for logging
const logger = {
  log: (msg, ...args) => console.log(`Content Script: ${msg}`, ...args),
  error: (msg, ...args) => console.error(`Content Script: ${msg}`, ...args),
  warn: (msg, ...args) => console.warn(`Content Script: ${msg}`, ...args),
};

/**
 * Checks if the DOM is fully loaded and ready.
 * @returns {boolean} True if the DOM is ready, false otherwise.
 */
function isDOMReady() {
  return (
    document.readyState === 'complete' || document.readyState === 'interactive'
  );
}

/**
 * Safely calls a Chrome API function and handles potential context invalidation.
 * @param {function} callback - The Chrome API function to call.
 * @returns {*} The result of the API call, or null if an error occurred.
 */
function safeChromeApiCall(callback) {
  try {
    return callback();
  } catch (error) {
    if (error.message.includes('Extension context invalidated')) {
      handleExtensionReload();
    }
    logger.error('Chrome API call failed:', error);
    return null;
  }
}

/**
 * Sets up the connection to the background script and handles reconnection logic.
 */
function setupConnection() {
  logger.log('Setting up connection...');

  /**
   * Attempts to connect to the background script.
   */
  function connect() {
    logger.log('Attempting to connect, attempts:', state.reconnectAttempts);

    if (state.reconnectAttempts >= CONFIG.MAX_RECONNECT_ATTEMPTS) {
      logger.error('Max reconnection attempts reached');
      return;
    }

    safeChromeApiCall(() => {
      chrome.runtime.sendMessage(
        { action: 'contentScriptReady' },
        (response) => {
          if (chrome.runtime.lastError) {
            logger.warn('Connection failed:', chrome.runtime.lastError);
            state.reconnectAttempts++;
            setTimeout(connect, 1000 * Math.pow(2, state.reconnectAttempts));
            return;
          }
          state.isConnected = true;
          state.reconnectAttempts = 0;
          logger.log('Connected successfully');
        }
      );
    });
  }

  connect();
}

/**
 * Extracts the text content of the transcript from the current page.
 * @returns {string} The extracted transcript text, or 'No transcript found.' if not found.
 */
function getTranscriptText() {
  const phraseElements = document.querySelectorAll('.rc-Phrase.css-8q9a0v');
  console.log('Found transcript phrase elements:', phraseElements.length);

  if (phraseElements.length === 0) {
    console.log('No transcript elements found with selector .rc-Phrase.css-8q9a0v');
    return 'No transcript found.';
  }

  // Extract text from each phrase element, looking for the inner span with css-4s48ix
  const transcriptText = Array.from(phraseElements)
    .map(element => {
      const textSpans = element.querySelectorAll('.css-4s48ix');
      return Array.from(textSpans)
        .map(span => span.textContent.trim())
        .join(' ');
    })
    .filter(text => text.length > 0)
    .join(' ');

  if (!transcriptText) {
    console.log('No text content found in transcript elements');
    return 'No transcript found.';
  }

  return transcriptText;
}

/**
 * Retrieves the navigation links for the current course.
 * @returns {Promise<object|null>} An object containing navigation data, or null if not found.
 */
async function getVideoLinks() {
  const currentUrl = window.location.href;

  // Check cache
  const cache = await chrome.storage.local.get('navigationCache');
  const navigationCache = cache.navigationCache;

  if (
    navigationCache?.url === currentUrl &&
    navigationCache?.data &&
    Date.now() - navigationCache.timestamp < CONFIG.CACHE_DURATION
  ) {
    return navigationCache.data;
  }

  const sidebar = document.querySelector('.rc-LessonItems');
  if (!sidebar) return null;

  const links = Array.from(sidebar.querySelectorAll('a')).map((link) => ({
    title: link.querySelector('.rc-NavItemName')?.innerText.trim(),
    url: link.href,
    isCurrent: link.href === currentUrl,
  }));

  const currentIndex = links.findIndex((link) => link.isCurrent);
  const navigationData = {
    links,
    currentIndex,
    hasNext: currentIndex < links.length - 1,
    hasPrevious: currentIndex > 0,
  };

  // Update cache
  await chrome.storage.local.set({
    navigationCache: {
      url: currentUrl,
      data: navigationData,
      timestamp: Date.now(),
    },
  });

  return navigationData;
}

/**
 * Handles the extension reload event, cleaning up and reinitializing the extension.
 */
function handleExtensionReload() {
  logger.log('Extension context invalidated, cleaning up...');

  const elementsToRemove = ['#coursera-helper-button', '#extension-sidebar'];
  elementsToRemove.forEach((selector) => {
    document.querySelector(selector)?.remove();
  });

  state = {
    isConnected: false,
    reconnectAttempts: 0,
    lastUrl: window.location.href,
    navigationCache: { url: null, data: null },
  };

  setTimeout(initialize, 1000);
}

/**
 * Handles messages received from the background script.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  logger.log('Received message:', request.action);

  if (request.action === 'ping') {
    sendResponse({ status: 'ok' });
    return true;
  }

  if (!state.isConnected) {
    logger.warn('Not ready for message:', request.action);
    sendResponse({ error: 'Content script not ready' });
    return true;
  }

  // Map of message actions to their corresponding handlers
  const messageHandlers = {
    extractTranscript: () => ({ transcript: getTranscriptText() }),
    getVideoLinks: async () => await getVideoLinks(),
    nextPage: async () => {
      const navigationData = await getVideoLinks();
      if (navigationData?.hasNext) {
        window.location.href =
          navigationData.links[navigationData.currentIndex + 1].url;
        return { success: true };
      }
      return { error: 'No next page available' };
    },
  };

  const handler = messageHandlers[request.action];
  if (!handler) {
    logger.warn('Unknown action:', request.action);
    sendResponse({ error: 'Unknown action' });
    return true;
  }

  // Execute the handler and send the response
  Promise.resolve(handler())
    .then(sendResponse)
    .catch((error) => sendResponse({ error: error.message }));

  return true; // Indicates that sendResponse will be called asynchronously
});

/**
 * Initializes the extension, setting up the connection, UI elements, and event listeners.
 */
function initialize() {
  logger.log('Starting initialization...', new Date().toISOString());

  const url = new URL(window.location.href);
  if (
    !url.hostname.includes('coursera.org') ||
    !url.pathname.includes('/learn/')
  ) {
    logger.log('Not on a Coursera learn page, skipping initialization');
    return;
  }

  setupConnection();

  if (isDOMReady()) {
    createSidebar();
    injectQuickExtractButton();
    initBatchExtract();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      createSidebar();
      injectQuickExtractButton();
      initBatchExtract();
    });
  }

  // Add a MutationObserver to handle dynamic content loading
  const observer = new MutationObserver((mutations) => {
    if (!document.querySelector('[data-testid="quick-extract-button"]')) {
      injectQuickExtractButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

// Observe URL changes and update the lastUrl state
new MutationObserver(() => {
  const currentUrl = window.location.href;
  if (currentUrl !== state.lastUrl) {
    state.lastUrl = currentUrl;
    state.navigationCache = { url: null, data: null };
  }
}).observe(document, { subtree: true, childList: true });

// Make these functions available to the sidebar and other parts of the extension
window.getTranscriptText = getTranscriptText;
window.getVideoLinks = getVideoLinks;
window.showOverlay = showOverlay;

// Make it available to the window object if needed
window.getStoredTranscripts = getStoredTranscripts;

// Start the extension
initialize();
logger.log('Content script loaded');
