import MistralClient from '@mistralai/mistralai';

const MISTRAL_API_KEY = import.meta.env.VITE_MISTRAL_API_KEY?.trim();
const MODEL = "ft:open-mistral-7b:4f867432:20241216:1305f8dc";




const SYSTEM_PROMPT = `You are an empathetic AI therapist. Your responses should be:
- Compassionate and understanding
- Professional but warm
- Focused on helping the user explore their thoughts and feelings
- Non-judgmental and supportive
Always maintain appropriate therapeutic boundaries and confidentiality.`;

class MistralService {
  constructor() {
    if (!MISTRAL_API_KEY) {
      throw new Error('Mistral API key is not configured');
    }

    // Initialize with basic configuration
    this.client = new MistralClient(MISTRAL_API_KEY);
    this.chatHistory = [{
      role: 'system',
      content: SYSTEM_PROMPT
    }];
    this.sessionSummary = '';
    
    // Verify API key on initialization
    this.verifyApiKey();
  }

  async verifyApiKey() {
    try {
      const response = await fetch('https://api.mistral.ai/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MISTRAL_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API verification failed: ${response.status}`);
      }

      const data = await response.json();
      if (!data.data?.length) {
        throw new Error('No models available');
      }


    } catch (error) {
      console.error('API key verification failed:', error);
      throw new Error('Invalid API key configuration');
    }
  }

  async initializeChat() {
    try {
        const userPrompt = {
        role: 'user',
        content: this.sessionSummary 
          ? 'Please start a new therapy session, considering this context from previous sessions: ' + this.sessionSummary
          : 'Please start a new therapy session with a warm introduction.'
        };

        const messages = [...this.chatHistory, userPrompt];



      const response = await this.client.chat({
        model: MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 0.95
      });

      if (!response?.choices?.[0]?.message?.content) {
        console.error('Invalid API response:', response);
        throw new Error('Invalid response from Mistral API');
      }

      const aiResponse = response.choices[0].message.content;
      
      this.chatHistory = [
        ...this.chatHistory,
        userPrompt,
        {
          role: 'assistant',
          content: aiResponse
        }
      ];

      return aiResponse;
    } catch (error) {
      console.error('Mistral Chat Error:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.response?.status >= 500) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      
      throw new Error('Failed to initialize chat. Please try again.');
    }
  }

  async sendMessage(message) {
    try {



      if (!message.trim()) {
        throw new Error('Message cannot be empty');
      }

      const userMessage = {
        role: 'user',
        content: message
      };
      
      const messages = [...this.chatHistory, userMessage];


      const response = await this.client.chat({
        model: MODEL,
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000
      });

      if (!response?.choices?.[0]?.message?.content) {
        console.error('Invalid API response:', response);
        throw new Error('Invalid response from Mistral API');
      }

      const aiResponse = response.choices[0].message.content;

      
      this.chatHistory = [
        ...this.chatHistory,
        userMessage,
        {
          role: 'assistant',
          content: aiResponse
        }
      ];

      return aiResponse;
    } catch (error) {
      console.error('Mistral Chat Error:', error);
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.response?.status >= 500) {
        throw new Error('Service temporarily unavailable. Please try again later.');
      }
      throw error;
    }
  }

  async summarizeSession() {
    try {
      const summaryPrompt = {
        role: 'user',
        content: 'Please provide a brief summary of our conversation that can be used for context in future sessions.'
      };

      const response = await this.client.chat({
        model: MODEL,
        messages: [...this.chatHistory, summaryPrompt],
        temperature: 0.7,
        max_tokens: 500
      });

      if (!response || !response.choices || !response.choices[0]) {
        throw new Error('Invalid response from Mistral API');
      }

      const summary = response.choices[0].message.content;
      this.sessionSummary = summary;
      return summary;
    } catch (error) {
      console.error('Error summarizing session:', error);
      throw new Error('Failed to summarize session. Please try again later.');
    }
  }

  clearHistory() {
    this.chatHistory = [{
      role: 'system',
      content: SYSTEM_PROMPT
    }];
  }

  async endChat() {
    try {
      await this.summarizeSession();
      localStorage.setItem('chatSummary', this.sessionSummary);
      this.clearHistory();
    } catch (error) {
      console.error('Error ending chat:', error);
      throw error;
    }
  }

  loadPreviousSummary() {
    const savedSummary = localStorage.getItem('chatSummary');
    if (savedSummary) {
      this.sessionSummary = savedSummary;
    }
  }
}

// Add global error handler
window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
});

const service = new MistralService();
service.loadPreviousSummary();
export default service;
