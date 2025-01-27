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
          const phraseElements = iframe.contentDocument.querySelectorAll('.rc-Phrase.css-8q9a0v');
          if (phraseElements.length === 0) {
            resolve({
              title: videoTitle,
              transcript: 'No transcript found.',
            });
            return;
          }

          // Extract text from each phrase element
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
            resolve({
              title: videoTitle,
              transcript: 'No transcript found.',
            });
            return;
          }

          resolve({
            title: videoTitle,
            transcript: transcriptText,
          });
        } catch (error) {
          resolve({
            title: videoTitle,
            transcript: 'Error extracting transcript.',
          });
        } finally {
          if (iframe.parentNode === document.body) {
            document.body.removeChild(iframe);
          }
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
