declare module '@mistralai/mistralai' {
  export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
  }

  export interface ChatCompletionOptions {
    model: string;
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
    top_p?: number;
    safe_mode?: boolean;
    random_seed?: number;
  }

  export interface ChatResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: {
      index: number;
      message: ChatMessage;
      finish_reason: string;
    }[];
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }

  export default class MistralClient {
    constructor(config: { apiKey: string; retries?: number; timeout?: number });
    chat(options: ChatCompletionOptions): Promise<ChatResponse>;
  }
} 