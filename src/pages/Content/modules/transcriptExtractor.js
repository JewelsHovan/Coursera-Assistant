/**
 * Extracts transcript from a Coursera video page
 * @param {string} url - The URL of the video page
 * @param {string} videoTitle - The title of the video
 * @returns {Promise<{title: string, transcript: string}>}
 */
export async function extractTranscriptFromUrl(url, videoTitle) {
  try {
    // Create a hidden iframe to load the video page
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Load the page and wait for it
    return new Promise((resolve, reject) => {
      iframe.onload = async () => {
        try {
          // Wait for transcript elements to load
          await new Promise((r) => setTimeout(r, 2000));

          // Extract transcript from iframe
          const phraseElements =
            iframe.contentDocument.querySelectorAll('.rc-Phrase');
          if (phraseElements.length === 0) {
            resolve({
              title: videoTitle,
              transcript: 'No transcript available.',
            });
            return;
          }

          const transcript = Array.from(phraseElements)
            .map((element) => element.textContent.trim())
            .join(' ');

          resolve({ title: videoTitle, transcript });
        } catch (error) {
          resolve({
            title: videoTitle,
            transcript: 'Error extracting transcript.',
          });
        } finally {
          document.body.removeChild(iframe);
        }
      };

      iframe.src = url;

      // Timeout after 10 seconds
      setTimeout(() => {
        document.body.removeChild(iframe);
        resolve({
          title: videoTitle,
          transcript: 'Timeout while loading transcript.',
        });
      }, 10000);
    });
  } catch (error) {
    return { title: videoTitle, transcript: 'Error loading page.' };
  }
}
