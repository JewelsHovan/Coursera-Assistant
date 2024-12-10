console.log('This is the background page.');
console.log('Put the background scripts here.');

// Message handler for background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request.action);

  if (request.action === 'openPanel') {
    // Open a new tab with our Newtab page
    chrome.tabs.create(
      {
        url: chrome.runtime.getURL('panel.html'),
        active: true,
      },
      (tab) => {
        console.log('Opened new tab with ID:', tab.id);
      }
    );
  }

  // Always return true if you want to use sendResponse asynchronously
  return true;
});

// Optional: Handle tab creation errors
chrome.runtime.lastError &&
  console.error('Tab creation error:', chrome.runtime.lastError);
