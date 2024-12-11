console.log('This is the background page.');
console.log('Put the background scripts here.');

import { CourseStorage } from './storage';

// Run cleanup periodically
chrome.alarms.create('cleanupStorage', { periodInMinutes: 60 * 24 }); // Once per day

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cleanupStorage') {
    CourseStorage.cleanup();
  }
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'storeTranscripts') {
    CourseStorage.store(request.courseId, request.transcripts)
      .then(() => sendResponse({ success: true }))
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }

  if (request.action === 'getTranscripts') {
    CourseStorage.get(request.courseId)
      .then((data) => sendResponse({ data }))
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }
});

// Optional: Handle tab creation errors
chrome.runtime.lastError &&
  console.error('Tab creation error:', chrome.runtime.lastError);
