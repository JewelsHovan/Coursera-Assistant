/**
 * Manages storage operations for Coursera course transcripts.
 * @namespace CourseStorage
 */
export const CourseStorage = {
  /**
   * Generates a storage key for a given course ID.
   * @param {string} courseId - The ID of the course.
   * @returns {string} A unique storage key.
   */
  storageKey: (courseId) => `coursera_transcripts_${courseId}_${Date.now()}`,

  /**
   * Expiration time for stored transcripts (7 days in milliseconds).
   * @type {number}
   */
  EXPIRATION_TIME: 7 * 24 * 60 * 60 * 1000,

  /**
   * Stores transcripts for a given course.
   * @param {string} courseId - The ID of the course.
   * @param {Array} transcripts - The transcripts to store.
   * @async
   */
  async store(courseId, transcripts) {
    const data = {
      timestamp: Date.now(),
      courseId,
      transcripts,
    };
    await chrome.storage.local.set({ [this.storageKey(courseId)]: data });
  },

  /**
   * Retrieves stored transcripts for a given course.
   * @param {string} courseId - The ID of the course.
   * @returns {Promise<object|undefined>} The stored transcripts, or undefined if not found or expired.
   * @async
   */
  async get(courseId) {
    const storage = await chrome.storage.local.get(null);
    return Object.values(storage).find(
      (data) =>
        data.courseId === courseId &&
        Date.now() - data.timestamp < this.EXPIRATION_TIME
    );
  },

  /**
   * Cleans up expired transcripts from storage.
   * @async
   */
  async cleanup() {
    const storage = await chrome.storage.local.get(null);
    const now = Date.now();

    const keysToRemove = Object.entries(storage)
      .filter(
        ([key, value]) =>
          key.startsWith('coursera_transcripts_') &&
          now - value.timestamp > this.EXPIRATION_TIME
      )
      .map(([key]) => key);

    if (keysToRemove.length > 0) {
      await chrome.storage.local.remove(keysToRemove);
    }
  },
};
