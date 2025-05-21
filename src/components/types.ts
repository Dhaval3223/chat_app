export interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  direction: 'incoming' | 'outgoing';
  position: 'single' | 'first' | 'normal' | 'last';
  sentTime: string;
  date: string;
  status: 'sent' | 'delivered' | 'read';
  reactions?: string[];
  replyTo?: {
    sender: string;
    message: string;
  };
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  thumbnail?: string;
}

export interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  type: 'private' | 'group';
  unread: number;
  isOnline: boolean;
  lastSeen?: string;
} 