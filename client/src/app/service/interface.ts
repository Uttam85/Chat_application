export interface ChatMessage {
    id: string;
    content: string;
    sender: string;
    timestamp: Date;
    reactions?: Reaction[];
    replyTo?: ChatMessage; // Reference to the message being replied to
  }
  
  export interface Reaction {
    emoji: string;
    user: string;
  }
  