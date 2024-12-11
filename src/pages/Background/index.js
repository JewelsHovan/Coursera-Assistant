console.log('This is the background page.');
console.log('Put the background scripts here.');

import { CourseStorage } from './storage';

// Initialize alarms with error handling
function initializeAlarms() {
  try {
    if (chrome.alarms) {
      chrome.alarms.create('cleanupStorage', { periodInMinutes: 60 * 24 }); // Once per day
    } else {
      console.error('Alarms API not available');
    }
  } catch (error) {
    console.error('Failed to create alarm:', error);
  }
}

// Initialize storage cleanup
function initializeStorageCleanup() {
  try {
    if (chrome.alarms) {
      chrome.alarms.onAlarm.addListener((alarm) => {
        if (alarm.name === 'cleanupStorage') {
          CourseStorage.cleanup().catch(console.error);
        }
      });
    }
  } catch (error) {
    console.error('Failed to setup alarm listener:', error);
  }
}

// Initialize message handling
function initializeMessageHandling() {
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
}

// Initialize everything
try {
  initializeAlarms();
  initializeStorageCleanup();
  initializeMessageHandling();
} catch (error) {
  console.error('Background script initialization failed:', error);
}

// Optional: Handle tab creation errors
chrome.runtime.lastError &&
  console.error('Tab creation error:', chrome.runtime.lastError);
