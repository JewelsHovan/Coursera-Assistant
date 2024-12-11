import secrets from 'secrets';

export class ChatService {
  constructor() {
    this.conversationHistory = [];
  }

  async sendMessage(message, transcript = '') {
    try {
      // Add context about the transcript if available
      const contextMessage = transcript
        ? `Context from video transcript: ${transcript}\n\nUser question: ${message}`
        : message;

      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: contextMessage,
      });

      const response = await fetch(secrets.apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secrets.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'cloud-sambanova-llama-3-70b-instruct',
          messages: this.conversationHistory,
        }),
      });

      const data = await response.json();
      const assistantMessage = data.choices[0].message.content;

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return assistantMessage;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}
