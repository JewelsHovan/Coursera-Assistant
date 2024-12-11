import { updateSidebarStatus } from './sidebar';
import { extractTranscriptFromUrl } from './transcriptExtractor';

export async function indexCourse() {
  updateSidebarStatus('Indexing course...', 'info');

  try {
    const sections = document.querySelectorAll('.rc-CollapsibleLesson');
    const courseId = extractCourseId();

    if (!sections.length) {
      throw new Error('No course sections found');
    }

    let allTranscripts = [];

    for (const section of sections) {
      // Get expand button and check if section is collapsed
      const expandButton = section.querySelector('button[aria-expanded]');
      const wasCollapsed =
        expandButton?.getAttribute('aria-expanded') === 'false';

      // If collapsed, expand it and wait for content
      if (wasCollapsed) {
        expandButton.click();
        await new Promise((r) => setTimeout(r, 1000)); // Wait for expansion animation
      }

      try {
        const sectionTitle = section.querySelector('h2').textContent.trim();
        const videoLinks = Array.from(
          section.querySelectorAll('.rc-LessonItems a')
        ).filter((link) => {
          const itemName = link.querySelector('.rc-NavItemName');
          return itemName && itemName.textContent.includes('Video:');
        });

        const sectionTranscripts = await Promise.all(
          videoLinks.map(async (link) => {
            const title = link
              .querySelector('.rc-NavItemName')
              .textContent.replace('Video:', '')
              .trim();
            const transcript = await extractTranscriptFromUrl(link.href, title);
            return {
              sectionTitle,
              ...transcript,
              url: link.href,
            };
          })
        );

        allTranscripts = [...allTranscripts, ...sectionTranscripts];
        updateSidebarStatus(
          `Indexed ${allTranscripts.length} videos...`,
          'info'
        );
      } finally {
        // Restore original collapsed state
        if (wasCollapsed && expandButton) {
          expandButton.click();
        }
      }
    }

    await storeTranscripts(courseId, allTranscripts);
    updateSidebarStatus('Indexing complete!', 'success');
    return allTranscripts;
  } catch (error) {
    console.error('Indexing failed:', error);
    updateSidebarStatus('Indexing failed: ' + error.message, 'error');
    throw error;
  }
}

async function storeTranscripts(courseId, transcripts) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: 'storeTranscripts',
        courseId,
        transcripts,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      }
    );
  });
}

export async function getStoredTranscripts(courseId) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        action: 'getTranscripts',
        courseId,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.data?.transcripts || []);
        }
      }
    );
  });
}

// Helper function to extract course ID from URL (if not already defined elsewhere)
function extractCourseId() {
  const match = window.location.pathname.match(/learn\/(.+?)(\/|$)/);
  return match ? match[1] : null;
}
