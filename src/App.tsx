import React, { useState, useEffect, useRef } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
  ConversationHeader,
  Sidebar,
  Search,
  ConversationList,
  Conversation,
  Avatar,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { ChatMessage as ChatMessageType, Attachment, Chat } from './components/types';
import { ChatMessage } from './components/ChatMessage';
import { AttachmentModal } from './components/AttachmentModal';
import { AttachmentPreview } from './components/AttachmentPreview';
import { ReplyModal } from './components/ReplyModal';

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "1",
      message: "Hello! How can I help you today?",
      sender: "Assistant",
      direction: "incoming",
      position: "single",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
      status: "read",
    },
    {
      id: "2",
      message: "I need help with my project",
      sender: "You",
      direction: "outgoing",
      position: "single",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
      status: "read",
      attachments: [{
        id: "att1",
        name: "project-screenshot.png",
        type: "image",
        url: "https://picsum.photos/400/300",
        size: 1024 * 1024 // 1MB
      },{
        id: "att1",
        name: "project-screenshot.png",
        type: "image",
        url: "https://picsum.photos/400/300",
        size: 1024 * 1024 // 1MB
      },{
        id: "att1",
        name: "project-screenshot.png",
        type: "image",
        url: "https://picsum.photos/400/300",
        size: 1024 * 1024 // 1MB
      },{
        id: "att1",
        name: "project-screenshot.png",
        type: "image",
        url: "https://picsum.photos/400/300",
        size: 1024 * 1024 // 1MB
      }]
    },
    {
      id: "3",
      message: "Here are the project documents",
      sender: "Assistant",
      direction: "incoming",
      position: "single",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
      status: "read",
      attachments: [{
        id: "att2",
        name: "project-requirements.pdf",
        type: "document",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        size: 2.5 * 1024 * 1024 // 2.5MB
      }, {
        id: "att3",
        name: "project-proposal.docx",
        type: "document",
        url: "https://file-examples.com/storage/fef1706276640fa0dd1979c/2017/02/file-sample_100kB.docx",
        size: 1.8 * 1024 * 1024 // 1.8MB
      },{
        id: "att2",
        name: "project-requirements.pdf",
        type: "document",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        size: 2.5 * 1024 * 1024 // 2.5MB
      },{
        id: "att2",
        name: "project-requirements.pdf",
        type: "document",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        size: 2.5 * 1024 * 1024 // 2.5MB
      },]
    },
    {
      id: "4",
      message: "Sure! What kind of project are you working on?",
      sender: "Assistant",
      direction: "incoming",
      position: "single",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
      status: "read",
    },
    {
      id: "5",
      message: "It's a React chat application",
      sender: "You",
      direction: "outgoing",
      position: "single",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
      status: "read",
    },
    {
      id: "6",
      message:
        "That sounds interesting! What features are you planning to add?",
      sender: "Assistant",
      direction: "incoming",
      position: "single",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
      status: "read",
    },
    {
      id: "7",
      message: "I want to add reply functionality",
      sender: "You",
      direction: "outgoing",
      position: "single",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
      status: "read",
      replyTo: {
        sender: "Assistant",
        message: "That sounds interesting! What features are you planning to add?"
      },
    },
    {
      id: "8",
      message: "Great choice! Reply functionality makes conversations more organized and easier to follow.",
      sender: "Assistant",
      direction: "incoming",
      position: "single",
      sentTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toLocaleDateString(),
      status: "read",
      replyTo: {
        sender: "You",
        message: "I want to add reply functionality"
      },
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [replyingTo, setReplyTo] = useState<ChatMessageType | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(
    null
  );
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessageType | null>(
    null
  );
  const [showMoreOptions, setShowMoreOptions] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<Attachment[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chats: Chat[] = [
    {
      id: "1",
      name: "John Doe",
      lastMessage: "Hey, how are you?",
      type: "private",
      unread: 2,
      isOnline: true,
    },
    {
      id: "2",
      name: "Team Meeting",
      lastMessage: "Meeting at 3 PM",
      type: "group",
      unread: 0,
      isOnline: true,
    },
    {
      id: "3",
      name: "Alice Smith",
      lastMessage: "Thanks for the help!",
      type: "private",
      unread: 0,
      isOnline: false,
      lastSeen: "2 hours ago",
    },
    {
      id: "4",
      name: "Project Group",
      lastMessage: "New updates available",
      type: "group",
      unread: 5,
      isOnline: true,
    },
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim() === '' && attachments.length === 0) return;

    const newMessage: ChatMessageType = {
      id: Math.random().toString(36).substr(2, 9),
      message: inputMessage,
      sender: 'You',
      direction: 'outgoing',
      position: 'single',
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      status: 'sent',
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      replyTo: replyingTo ? {
        sender: replyingTo.sender,
        message: replyingTo.message
      } : undefined
    };

    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      return updatedMessages.map((msg, index) => {
        if (index === 0) return { ...msg, position: 'first' };
        if (index === updatedMessages.length - 1) return { ...msg, position: 'last' };
        return { ...msg, position: 'normal' };
      });
    });

    setInputMessage('');
    setAttachments([]);
    setSelectedFiles([]);
    setAttachmentPreviews([]);
    setShowAttachmentModal(false);
    if (replyingTo) {
      setReplyTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReply = (message: ChatMessageType) => {
    setReplyTo(message);
    setShowReplyModal(true);
  };

  const handleReplySubmit = (message: string) => {
    if (!replyingTo) return;

    const newMessage: ChatMessageType = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      sender: 'You',
      direction: 'outgoing',
      position: 'single',
      sentTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString(),
      status: 'sent',
      replyTo: {
        sender: replyingTo.sender,
        message: replyingTo.message
      }
    };

    setMessages(prev => {
      const updatedMessages = [...prev, newMessage];
      return updatedMessages.map((msg, index) => {
        if (index === 0) return { ...msg, position: 'first' };
        if (index === updatedMessages.length - 1) return { ...msg, position: 'last' };
        return { ...msg, position: 'normal' };
      });
    });

    setShowReplyModal(false);
    setReplyTo(null);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        return {
          ...msg,
          reactions: [...(msg.reactions || []), reaction]
        };
      }
      return msg;
    }));
  };

  const handleFileSelect = (files: FileList) => {
    Array.from(files).forEach(file => {
      const fileType = file.type.split('/')[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      let type: Attachment['type'] = 'document';
      if (fileType === 'image') type = 'image';
      else if (fileType === 'video') type = 'video';
      else if (fileType === 'audio') type = 'audio';
      else if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'].includes(fileExtension || '')) type = 'document';

      // Create a FileReader to read the file
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAttachment: Attachment = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type,
          url: e.target?.result as string,
          size: file.size
        };

        setAttachments(prev => [...prev, newAttachment]);
        setSelectedFiles(prev => [...prev, file]);
        setAttachmentPreviews(prev => [...prev, newAttachment]);
      };

      // Read the file as Data URL
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveAttachment = (id: string) => {
    const attachmentToRemove = attachments.find(att => att.id === id);
    if (attachmentToRemove) {
      URL.revokeObjectURL(attachmentToRemove.url);
    }
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
    setSelectedFiles(prev => prev.filter((_, index) => attachments[index]?.id !== id));
  };

  useEffect(() => {
    return () => {
      // No need to revoke URLs since we're using Data URLs
      setAttachments([]);
      setSelectedFiles([]);
      setAttachmentPreviews([]);
    };
  }, []);

  const getActiveChatName = () => {
    const chat = chats.find((c) => c.id === activeChat);
    return chat ? chat.name : "Chat Application";
  };

  const getStatusIcon = (status: "sent" | "delivered" | "read") => {
    switch (status) {
      case "sent":
        return "✓";
      case "delivered":
        return "✓✓";
      case "read":
        return "✓✓";
      default:
        return "";
    }
  };

  const handleEditMessage = (message: ChatMessageType) => {
    setEditingMessage(message);
    setShowEditModal(true);
  };

  const handleEditSubmit = (editedText: string) => {
    if (editingMessage) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingMessage.id ? { ...msg, message: editedText } : msg
        )
      );
      setEditingMessage(null);
      setShowEditModal(false);
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    setShowMoreOptions(null);
  };

  const handleForwardMessage = (message: ChatMessageType) => {
    // TODO: Implement forward functionality
    alert("Forward functionality will be implemented here");
    setShowMoreOptions(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowMoreOptions(null);
      }
    };

    if (showMoreOptions) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreOptions]);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <MainContainer>
        <Sidebar position="left" scrollable={false}>
          <div style={{ padding: "16px", borderBottom: "1px solid #e0e0e0" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}>
              <Avatar
                src="https://ui-avatars.com/api/?name=Your+Name&background=random"
                name="Your Name"
                size="lg"
                status="available"
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "1.1em", fontWeight: "600" }}>
                  Your Name
                </div>
                <div style={{ fontSize: "0.85em", color: "#2196F3" }}>
                  Online
                </div>
              </div>
            </div>
          </div>
          <Search placeholder="Search..." />
          <ConversationList>
            {chats.map((chat) => (
              <Conversation
                key={chat.id}
                name={chat.name}
                lastSenderName={chat.type === "group" ? "Group" : chat.name}
                info={chat.isOnline ? "Online" : chat.lastSeen || "Offline"}
                unreadCnt={chat.unread}
                active={activeChat === chat.id}
                onClick={() => setActiveChat(chat.id)}
              >
                <Avatar
                  src={`https://ui-avatars.com/api/?name=${chat.name}&background=random`}
                  name={chat.name}
                  size="md"
                  status={chat.isOnline ? "available" : "unavailable"}
                />
              </Conversation>
            ))}
          </ConversationList>
        </Sidebar>

        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Back />
            <ConversationHeader.Content>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: "1.2em", fontWeight: "bold" }}>
                  {getActiveChatName()}
                </div>
                {chats.find((c) => c.id === activeChat)?.isOnline && (
                  <div style={{ fontSize: "0.85em", color: "#2196F3" }}>
                    Online
                  </div>
                )}
              </div>
            </ConversationHeader.Content>
            <ConversationHeader.Actions>
              <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </button>
            </ConversationHeader.Actions>
          </ConversationHeader>

          <MessageList>
            {messages.map((msg, index) => {
              const showDateSeparator = index === 0 || messages[index - 1].date !== msg.date;
              return (
                <React.Fragment key={msg.id}>
                  {showDateSeparator && (
                    <MessageSeparator>{msg.date}</MessageSeparator>
                  )}
                  <ChatMessage
                    message={msg}
                    onReply={handleReply}
                    onEdit={handleEditMessage}
                    onDelete={handleDeleteMessage}
                    onForward={handleForwardMessage}
                    onReaction={handleReaction}
                    showReactionPicker={showReactionPicker}
                    setShowReactionPicker={setShowReactionPicker}
                    showMoreOptions={showMoreOptions}
                    setShowMoreOptions={setShowMoreOptions}
                  />
                </React.Fragment>
              );
            })}
          </MessageList>

          <MessageInput
            placeholder={replyingTo ? "Write a reply..." : "Type message here"}
            onSend={handleSendMessage}
            attachButton={true}
            onAttachClick={() => {
              setShowAttachmentModal(true);
              setSelectedFiles([]);
              setAttachmentPreviews([]);
            }}
            value={inputMessage}
            onChange={(text) => setInputMessage(text)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
        </ChatContainer>
      </MainContainer>

      <AttachmentModal
        isOpen={showAttachmentModal}
        onClose={() => {
          setShowAttachmentModal(false);
          setSelectedFiles([]);
          setAttachmentPreviews([]);
        }}
        attachments={attachments}
        onRemoveAttachment={handleRemoveAttachment}
        onFileSelect={handleFileSelect}
      />

      <ReplyModal
        show={showReplyModal}
        onHide={() => {
          setShowReplyModal(false);
          setReplyTo(null);
        }}
        replyingTo={replyingTo}
        onSubmit={handleReplySubmit}
      />

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        backdrop="static"
        dialogClassName="custom-modal"
      >
        {/* ... existing edit modal code ... */}
      </Modal>
    </div>
  );
}

export default App;
