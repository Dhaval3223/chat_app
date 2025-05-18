import React, { useState, useEffect, useRef } from "react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
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

interface ChatMessage {
  id: string;
  message: string;
  sender: string;
  direction: "incoming" | "outgoing";
  position: "single" | "first" | "normal" | "last";
  sentTime: string;
  date: string;
  status: "sent" | "delivered" | "read";
  reactions?: { [key: string]: string[] }; // emoji: [userId1, userId2, ...]
  replyTo?: {
    id: string;
    message: string;
    sender: string;
  };
}

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  type: "private" | "group";
  unread: number;
  isOnline: boolean;
  lastSeen?: string;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
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
    },
    {
      id: "3",
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
      id: "4",
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
      id: "5",
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
      id: "6",
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
        id: "5",
        message:
          "That sounds interesting! What features are you planning to add?",
        sender: "Assistant",
      },
    },
    {
      id: "7",
      message:
        "Great choice! Reply functionality makes conversations more organized and easier to follow.",
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
        id: "6",
        message: "I want to add reply functionality",
        sender: "You",
      },
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeChat, setActiveChat] = useState<string>("1");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(
    null
  );
  const [showReplyModal, setShowReplyModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(
    null
  );
  const [showMoreOptions, setShowMoreOptions] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = (message: string) => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const currentDate = new Date().toLocaleDateString();

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      sender: "You",
      direction: "outgoing",
      position: "single",
      sentTime: currentTime,
      date: currentDate,
      status: "sent",
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            message: replyingTo.message,
            sender: replyingTo.sender,
          }
        : undefined,
    };

    setMessages([...messages, newMessage]);
    setReplyingTo(null);
    setIsTyping(true);

    // Simulate message delivery and read status
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "delivered" } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: "read" } : msg
        )
      );
    }, 2000);

    // Simulate response after 3 seconds
    setTimeout(() => {
      const response: ChatMessage = {
        id: Date.now().toString(),
        message:
          "This is a sample response. In a real application, this would be connected to a backend service.",
        sender: "Assistant",
        direction: "incoming",
        position: "single",
        sentTime: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: currentDate,
        status: "read",
      };
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 3000);
  };

  const handleReplyClick = (message: ChatMessage) => {
    setReplyingTo(message);
    setShowReplyModal(true);
  };

  const handleReplySubmit = (replyMessage: string) => {
    if (replyingTo) {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const currentDate = new Date().toLocaleDateString();

      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        message: replyMessage,
        sender: "You",
        direction: "outgoing",
        position: "single",
        sentTime: currentTime,
        date: currentDate,
        status: "sent",
        replyTo: {
          id: replyingTo.id,
          message: replyingTo.message,
          sender: replyingTo.sender,
        },
      };

      setMessages([...messages, newMessage]);
      setReplyingTo(null);
      setShowReplyModal(false);
    }
  };

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

  const getStatusColor = (status: "sent" | "delivered" | "read") => {
    switch (status) {
      case "sent":
        return "#666666";
      case "delivered":
        return "#666666";
      case "read":
        return "#2196F3";
      default:
        return "#666666";
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== messageId) return msg;

        const reactions = msg.reactions || {};
        const userId = "You";

        // Initialize array if emoji doesn't exist
        if (!reactions[emoji]) {
          reactions[emoji] = [];
        }

        // Check if user has already reacted with this emoji
        const hasReacted = reactions[emoji].includes(userId);

        if (hasReacted) {
          // Remove the user's reaction for this emoji
          reactions[emoji] = reactions[emoji].filter((id) => id !== userId);
          if (reactions[emoji].length === 0) delete reactions[emoji];
        } else {
          // Add the user's reaction
          reactions[emoji] = [...reactions[emoji], userId];
        }

        return { ...msg, reactions };
      })
    );

    setShowReactionPicker(null);
  };

  const handleEditMessage = (message: ChatMessage) => {
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

  const handleForwardMessage = (message: ChatMessage) => {
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
    <div style={{ height: "100vh" }}>
      <MainContainer responsive>
        <Sidebar position="left" scrollable={false}>
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid #e0e0e0",
              backgroundColor: "#f5f5f5",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "8px",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "background-color 0.2s",
                backgroundColor: "transparent",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#e0e0e0")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <Avatar
                src="https://ui-avatars.com/api/?name=Your+Name&background=random"
                name="Your Name"
                size="lg"
                status="available"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.1em",
                    fontWeight: "600",
                    color: "#333",
                  }}
                >
                  Your Name
                </div>
                <div
                  style={{
                    fontSize: "0.85em",
                    color: "#2196F3",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#2196F3",
                    }}
                  />
                  Online
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#666",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 20h9"></path>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                  </svg>
                </button>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                }}
              >
                <div
                  style={{
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    lineHeight: "1.2",
                  }}
                >
                  {getActiveChatName()}
                </div>
                {chats.find((c) => c.id === activeChat)?.isOnline && (
                  <div
                    style={{
                      fontSize: "0.85em",
                      color: "#2196F3",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        backgroundColor: "#2196F3",
                      }}
                    />
                    Online
                  </div>
                )}
              </div>
            </ConversationHeader.Content>
            <ConversationHeader.Actions>
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#666",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                </button>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    color: "#666",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="1"></circle>
                    <circle cx="19" cy="12" r="1"></circle>
                    <circle cx="5" cy="12" r="1"></circle>
                  </svg>
                </button>
              </div>
            </ConversationHeader.Actions>
          </ConversationHeader>
          <MessageList
            typingIndicator={
              isTyping ? (
                <TypingIndicator content="Assistant is typing" />
              ) : null
            }
          >
            {messages.map((msg, index) => {
              const showDateSeparator =
                index === 0 || messages[index - 1].date !== msg.date;

              return (
                <React.Fragment key={msg.id}>
                  {showDateSeparator && (
                    <MessageSeparator>{msg.date}</MessageSeparator>
                  )}
                  <Message
                    model={{
                      message: msg.message,
                      sentTime: msg.sentTime,
                      sender: msg.sender,
                      direction: msg.direction,
                      position: msg.position,
                    }}
                  >
                    <Message.CustomContent>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          position: "relative",
                          paddingTop: "28px",
                          marginBottom: "4px",
                        }}
                        onMouseOver={(e) => {
                          const actions = e.currentTarget.querySelector(
                            ".message-actions"
                          ) as HTMLElement;
                          if (actions) {
                            actions.style.opacity = "1";
                            actions.style.transform = "translateY(0)";
                            actions.style.visibility = "visible";
                          }
                        }}
                        onMouseOut={(e) => {
                          const actions = e.currentTarget.querySelector(
                            ".message-actions"
                          ) as HTMLElement;
                          if (actions) {
                            actions.style.opacity = "0";
                            actions.style.transform = "translateY(4px)";
                            actions.style.visibility = "hidden";
                          }
                        }}
                      >
                        <div
                          className="message-actions"
                          style={{
                            position: "absolute",
                            top: "0",
                            right: msg.direction === "outgoing" ? "0" : "auto",
                            left: msg.direction === "incoming" ? "0" : "auto",
                            display: "flex",
                            gap: "4px",
                            opacity: 0,
                            transition: "all 0.2s ease",
                            backgroundColor: "white",
                            borderRadius: "6px",
                            padding: "4px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                            zIndex: 10,
                            pointerEvents: "auto",
                            transform: "translateY(4px)",
                            visibility: "hidden",
                          }}
                        >
                          <button
                            onClick={() => setShowReactionPicker(msg.id)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: "6px",
                              cursor: "pointer",
                              color: "#666",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                              minWidth: "32px",
                              minHeight: "32px",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#f5f5f5";
                              e.currentTarget.style.color = "#2196F3";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color = "#666";
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M14.828 14.828a4 4 0 1 0-5.656-5.656 4 4 0 0 0 5.656 5.656z"></path>
                              <path d="M9.172 9.172a4 4 0 1 0 5.656 5.656 4 4 0 0 0-5.656-5.656z"></path>
                              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReplyClick(msg)}
                            style={{
                              background: "none",
                              border: "none",
                              padding: "6px",
                              cursor: "pointer",
                              color: "#666",
                              borderRadius: "4px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s ease",
                              minWidth: "32px",
                              minHeight: "32px",
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#f5f5f5";
                              e.currentTarget.style.color = "#2196F3";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "transparent";
                              e.currentTarget.style.color = "#666";
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </button>
                          {msg.direction === "outgoing" && (
                            <button
                              onClick={() => handleEditMessage(msg)}
                              style={{
                                background: "none",
                                border: "none",
                                padding: "6px",
                                cursor: "pointer",
                                color: "#666",
                                borderRadius: "4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s ease",
                                minWidth: "32px",
                                minHeight: "32px",
                              }}
                              onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "#f5f5f5";
                                e.currentTarget.style.color = "#2196F3";
                              }}
                              onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                                e.currentTarget.style.color = "#666";
                              }}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                          )}
                          <div style={{ position: "relative" }}>
                            <div
                              style={{ position: "relative" }}
                              ref={dropdownRef}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowMoreOptions(
                                    showMoreOptions === msg.id ? null : msg.id
                                  );
                                }}
                                style={{
                                  background: "none",
                                  border: "none",
                                  padding: "6px",
                                  cursor: "pointer",
                                  color: "#666",
                                  borderRadius: "4px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  transition: "all 0.2s ease",
                                  minWidth: "32px",
                                  minHeight: "32px",
                                  zIndex: 1001,
                                }}
                                onMouseOver={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#f5f5f5";
                                  e.currentTarget.style.color = "#2196F3";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "transparent";
                                  e.currentTarget.style.color = "#666";
                                }}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <circle cx="12" cy="12" r="1"></circle>
                                  <circle cx="19" cy="12" r="1"></circle>
                                  <circle cx="5" cy="12" r="1"></circle>
                                </svg>
                              </button>

                              {showMoreOptions === msg.id && (
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  style={{
                                    position: "absolute",
                                    top: "100%",
                                    right:
                                      msg.direction === "outgoing"
                                        ? "0"
                                        : "auto",
                                    left:
                                      msg.direction === "incoming"
                                        ? "0"
                                        : "auto",
                                    backgroundColor: "white",
                                    borderRadius: "8px",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                    border: "1px solid #e0e0e0",
                                    padding: "4px",
                                    marginTop: "4px",
                                    minWidth: "180px",
                                    zIndex: 1001,
                                  }}
                                >
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleForwardMessage(msg);
                                    }}
                                    style={{
                                      width: "100%",
                                      padding: "8px 16px",
                                      fontSize: "0.9rem",
                                      color: "#333",
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "8px",
                                      cursor: "pointer",
                                      borderRadius: "4px",
                                      border: "none",
                                      background: "none",
                                      textAlign: "left",
                                      transition: "all 0.2s ease",
                                    }}
                                    onMouseOver={(e) =>
                                      (e.currentTarget.style.backgroundColor =
                                        "#f5f5f5")
                                    }
                                    onMouseOut={(e) =>
                                      (e.currentTarget.style.backgroundColor =
                                        "transparent")
                                    }
                                  >
                                    <svg
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                    >
                                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                      <polyline points="16 6 12 2 8 6"></polyline>
                                      <line
                                        x1="12"
                                        y1="2"
                                        x2="12"
                                        y2="15"
                                      ></line>
                                    </svg>
                                    Forward
                                  </button>
                                  {msg.direction === "outgoing" && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteMessage(msg.id);
                                      }}
                                      style={{
                                        width: "100%",
                                        padding: "8px 16px",
                                        fontSize: "0.9rem",
                                        color: "#dc3545",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px",
                                        cursor: "pointer",
                                        borderRadius: "4px",
                                        border: "none",
                                        background: "none",
                                        textAlign: "left",
                                        transition: "all 0.2s ease",
                                      }}
                                      onMouseOver={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                          "#fff5f5")
                                      }
                                      onMouseOut={(e) =>
                                        (e.currentTarget.style.backgroundColor =
                                          "transparent")
                                      }
                                    >
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                      >
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                      </svg>
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            alignItems: "flex-start",
                            flexDirection:
                              msg.direction === "incoming"
                                ? "row"
                                : "row-reverse",
                          }}
                        >
                          {msg.direction === "incoming" && (
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "50%",
                                overflow: "hidden",
                                flexShrink: 0,
                                border: "2px solid white",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                              }}
                            >
                              <img
                                src={`https://ui-avatars.com/api/?name=${msg.sender}&background=random`}
                                alt={msg.sender}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            </div>
                          )}

                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "4px",
                              maxWidth: "70%",
                            }}
                          >
                            {msg.replyTo && (
                              <div
                                style={{
                                  padding: "8px",
                                  backgroundColor: "#f5f5f5",
                                  borderRadius: "4px",
                                  marginBottom: "4px",
                                  fontSize: "0.9em",
                                  borderLeft: "3px solid #2196F3",
                                }}
                              >
                                <div
                                  style={{
                                    fontWeight: "600",
                                    color: "#2196F3",
                                    marginBottom: "2px",
                                  }}
                                >
                                  {msg.replyTo.sender}
                                </div>
                                <div style={{ color: "#666" }}>
                                  {msg.replyTo.message}
                                </div>
                              </div>
                            )}

                            <div
                              style={{
                                padding: "8px 12px",
                                backgroundColor:
                                  msg.direction === "outgoing"
                                    ? "#2196F3"
                                    : "#f5f5f5",
                                color:
                                  msg.direction === "outgoing"
                                    ? "white"
                                    : "#333",
                                borderRadius: "12px",
                                position: "relative",
                                wordBreak: "break-word",
                                marginBottom:
                                  msg.reactions &&
                                  Object.keys(msg.reactions).length > 0
                                    ? "16px"
                                    : "0",
                              }}
                            >
                              {msg.direction === "incoming" && (
                                <div
                                  style={{
                                    fontSize: "0.85em",
                                    fontWeight: "600",
                                    color: "#666",
                                    marginBottom: "4px",
                                    paddingBottom: "4px",
                                  }}
                                >
                                  {msg.sender}
                                </div>
                              )}
                              {msg.message}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                  gap: "4px",
                                  marginTop: "4px",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "0.75em",
                                    color:
                                      msg.direction === "outgoing"
                                        ? "rgba(255,255,255,0.8)"
                                        : "#999999",
                                    fontWeight:
                                      msg.direction === "outgoing"
                                        ? "500"
                                        : "400",
                                  }}
                                >
                                  {msg.sentTime}
                                </span>
                                {msg.direction === "outgoing" && (
                                  <span
                                    style={{
                                      fontSize: "0.75em",
                                      color:
                                        msg.status === "read"
                                          ? "rgba(255,255,255,0.9)"
                                          : "rgba(255,255,255,0.7)",
                                      fontWeight: "500",
                                    }}
                                  >
                                    {getStatusIcon(msg.status)}
                                  </span>
                                )}
                              </div>
                            </div>
                            {msg.reactions &&
                              Object.keys(msg.reactions).length > 0 && (
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: "-12px",
                                    right: "auto",
                                    left: "auto",
                                    display: "flex",
                                    gap: "4px",
                                    flexWrap: "nowrap",
                                    zIndex: 15,
                                    backgroundColor:
                                      "rgba(255, 255, 255, 0.95)",
                                    borderRadius: "12px",
                                    padding: "2px 6px",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                    border: "1px solid rgba(0,0,0,0.1)",
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    transform: "translateY(0)",
                                    transition: "transform 0.2s ease",
                                  }}
                                >
                                  {Object.entries(msg.reactions)
                                    .slice(0, 2)
                                    .map(([emoji, users]) => (
                                      <div
                                        key={emoji}
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: "2px",
                                          cursor: "pointer",
                                          transition: "all 0.2s ease",
                                          //padding: '1px 2px',
                                          borderRadius: "8px",
                                          //backgroundColor: users.includes("You") ? 'rgba(33, 150, 243, 0.1)' : 'transparent'
                                        }}
                                        onClick={() =>
                                          handleReaction(msg.id, emoji)
                                        }
                                        onMouseOver={(e) =>
                                          (e.currentTarget.style.backgroundColor =
                                            "rgba(0,0,0,0.05)")
                                        }
                                        onMouseOut={(e) =>
                                          (e.currentTarget.style.backgroundColor =
                                            users.includes("You")
                                              ? "rgba(33, 150, 243, 0.1)"
                                              : "transparent")
                                        }
                                      >
                                        <span style={{ fontSize: "1.1em" }}>
                                          {emoji}
                                        </span>
                                      </div>
                                    ))}
                                  {Object.keys(msg.reactions).length > 2 && (
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                        //padding: '1px 4px',
                                        borderRadius: "8px",
                                        //backgroundColor: 'rgba(0,0,0,0.05)',
                                        cursor: "pointer",
                                      }}
                                      onClick={() => {
                                        // Show all reactions in a tooltip or modal
                                        if (msg.reactions) {
                                          const allReactions = Object.entries(
                                            msg.reactions
                                          )
                                            .map(
                                              ([emoji, users]) =>
                                                `${emoji} (${users.length})`
                                            )
                                            .join(", ");
                                          alert(
                                            `All reactions: ${allReactions}`
                                          );
                                        }
                                      }}
                                    >
                                      <span
                                        style={{
                                          color: "#666",
                                          fontSize: "0.75em",
                                          fontWeight: "500",
                                        }}
                                      >
                                        +{Object.keys(msg.reactions).length - 2}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </Message.CustomContent>
                  </Message>
                  {showReactionPicker === msg.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        right: msg.direction === "outgoing" ? "0" : "auto",
                        left: msg.direction === "incoming" ? "0" : "auto",
                        zIndex: 1000,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        borderRadius: "8px",
                        overflow: "hidden",
                        marginTop: "4px",
                      }}
                    >
                      <EmojiPicker
                        onEmojiClick={(emojiData) =>
                          handleReaction(msg.id, emojiData.emoji)
                        }
                        lazyLoadEmojis
                        allowExpandReactions={false}
                        theme={Theme.LIGHT}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </MessageList>

          <MessageInput
            placeholder={replyingTo ? "Write a reply..." : "Type message here"}
            onSend={handleSendMessage}
            attachButton={false}
          />
        </ChatContainer>
      </MainContainer>
      {showReplyModal && (
        <Modal
          show={showReplyModal}
          onHide={() => setShowReplyModal(false)}
          centered
          backdrop="static"
          dialogClassName="custom-modal"
        >
          <Modal.Header
            closeButton
            style={{
              borderBottom: "1px solid #e0e0e0",
              padding: "16px 24px",
            }}
          >
            <Modal.Title
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Reply to Message
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ padding: "24px" }}>
            {replyingTo && (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px",
                  borderLeft: "4px solid #2196F3",
                  marginBottom: "20px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#2196F3",
                    fontWeight: "600",
                    marginBottom: "6px",
                  }}
                >
                  Replying to {replyingTo.sender}
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#444",
                    lineHeight: "1.4",
                  }}
                >
                  {replyingTo.message}
                </div>
              </div>
            )}
            <Form>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Type your reply..."
                  autoFocus
                  className="form-control"
                  onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        handleReplySubmit(value);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer
            style={{
              borderTop: "1px solid #e0e0e0",
              padding: "16px 24px",
            }}
          >
            <Button
              variant="light"
              onClick={() => setShowReplyModal(false)}
              className="btn-light"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                const input = document.querySelector(
                  "textarea"
                ) as HTMLTextAreaElement;
                if (input && input.value.trim()) {
                  handleReplySubmit(input.value.trim());
                  input.value = "";
                }
              }}
              className="btn-primary"
            >
              Send Reply
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        backdrop="static"
        dialogClassName="custom-modal"
      >
        <Modal.Header
          closeButton
          style={{
            borderBottom: "1px solid #e0e0e0",
            padding: "16px 24px",
          }}
        >
          <Modal.Title
            style={{
              fontSize: "1.2rem",
              fontWeight: "600",
              color: "#333",
            }}
          >
            Edit Message
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "24px" }}>
          {editingMessage && (
            <Form>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  defaultValue={editingMessage.message}
                  autoFocus
                  className="form-control"
                  onKeyPress={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      const value = e.currentTarget.value.trim();
                      if (value) {
                        handleEditSubmit(value);
                      }
                    }
                  }}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            borderTop: "1px solid #e0e0e0",
            padding: "16px 24px",
          }}
        >
          <Button
            variant="light"
            onClick={() => setShowEditModal(false)}
            className="btn-light"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const input = document.querySelector(
                "textarea"
              ) as HTMLTextAreaElement;
              if (input && input.value.trim()) {
                handleEditSubmit(input.value.trim());
              }
            }}
            className="btn-primary"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <style>
        {`
          .custom-modal .modal-content {
            border-radius: 16px;
            border: none;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          
          .custom-modal .modal-header .btn-close {
            padding: 0.5rem;
            margin: -0.5rem -0.5rem -0.5rem auto;
            border-radius: 8px;
            transition: all 0.2s ease;
          }
          
          .custom-modal .modal-header .btn-close:hover {
            background-color: #f5f5f5;
          }
          
          .custom-modal .form-control {
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            padding: 12px;
            font-size: 1rem;
            resize: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: all 0.2s ease;
          }
          
          .custom-modal .form-control:focus {
            border-color: #2196F3;
            box-shadow: 0 0 0 3px rgba(33,150,243,0.1);
          }
          
          .custom-modal .btn-primary {
            background-color: #2196F3;
            border-color: #2196F3;
            padding: 8px 20px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          
          .custom-modal .btn-primary:hover {
            background-color: #1976D2;
            border-color: #1976D2;
          }
          
          .custom-modal .btn-light {
            background-color: #fff;
            border-color: #e0e0e0;
            padding: 8px 20px;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
          }
          
          .custom-modal .btn-light:hover {
            background-color: #f5f5f5;
          }
        `}
      </style>
    </div>
  );
}

export default App;
