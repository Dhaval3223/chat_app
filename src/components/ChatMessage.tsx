import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from './types';
import { AttachmentPreview } from './AttachmentPreview';
import EmojiPicker, { Theme } from 'emoji-picker-react';

interface ChatMessageProps {
  message: ChatMessageType;
  onReply?: (message: ChatMessageType) => void;
  onEdit?: (message: ChatMessageType) => void;
  onDelete?: (messageId: string) => void;
  onForward?: (message: ChatMessageType) => void;
  onReaction?: (messageId: string, emoji: string) => void;
  showReactionPicker?: string | null;
  setShowReactionPicker?: (messageId: string | null) => void;
  showMoreOptions?: string | null;
  setShowMoreOptions?: (messageId: string | null) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onReply,
  onEdit,
  onDelete,
  onForward,
  onReaction,
  showReactionPicker,
  setShowReactionPicker,
  showMoreOptions,
  setShowMoreOptions
}) => {
  const isOutgoing = message.direction === 'outgoing';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node) &&
        showReactionPicker === message.id
      ) {
        setShowReactionPicker?.(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showReactionPicker, message.id, setShowReactionPicker]);

  const getStatusIcon = (status: 'sent' | 'delivered' | 'read') => {
    switch (status) {
      case 'sent':
        return '✓';
      case 'delivered':
        return '✓✓';
      case 'read':
        return '✓✓';
      default:
        return '';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isOutgoing ? 'flex-end' : 'flex-start',
      marginBottom: '8px',
      alignSelf: isOutgoing ? 'flex-end' : 'flex-start',
      width: '100%'
    }}>
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
            right: message.direction === "outgoing" ? "0" : "auto",
            left: message.direction === "incoming" ? "0" : "auto",
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
            onClick={() => setShowReactionPicker?.(message.id)}
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
              e.currentTarget.style.backgroundColor = "transparent";
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
            onClick={() => onReply?.(message)}
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
              e.currentTarget.style.backgroundColor = "transparent";
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
          {message.direction === "outgoing" && (
            <button
              onClick={() => onEdit?.(message)}
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
                e.currentTarget.style.backgroundColor = "transparent";
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
            <div style={{ position: "relative" }} ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoreOptions?.(showMoreOptions === message.id ? null : message.id);
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
                  e.currentTarget.style.backgroundColor = "#f5f5f5";
                  e.currentTarget.style.color = "#2196F3";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
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

              {showMoreOptions === message.id && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: message.direction === "outgoing" ? "0" : "auto",
                    left: message.direction === "incoming" ? "0" : "auto",
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
                      onForward?.(message);
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
                      (e.currentTarget.style.backgroundColor = "#f5f5f5")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
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
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Forward
                  </button>
                  {message.direction === "outgoing" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(message.id);
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
                        (e.currentTarget.style.backgroundColor = "#fff5f5")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.backgroundColor = "transparent")
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
        {showReactionPicker === message.id && (
          <div
            ref={emojiPickerRef}
            style={{
              position: "absolute",
              //bottom: "220px", // renders emoji picker above the message actions
              right: message.direction === "outgoing" ? "0" : "auto",
              left: message.direction === "incoming" ? "0" : "auto",
              zIndex: 1000,
              //boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <EmojiPicker
              onReactionClick={(emojiData) => {
                onReaction?.(message.id, emojiData.emoji);
                setShowReactionPicker?.(null);
              }}
              onEmojiClick={(emojiData) => {
                onReaction?.(message.id, emojiData.emoji );
                setShowReactionPicker?.(null);
              }}
              reactionsDefaultOpen={true}
              allowExpandReactions={true}
              theme={Theme.LIGHT}
            />
          </div>
        )}


        <div
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "flex-start",
            flexDirection: message.direction === "incoming" ? "row" : "row-reverse",
          }}
        >
          {message.direction === "incoming" && (
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
                src={`https://ui-avatars.com/api/?name=${message.sender}&background=random`}
                alt={message.sender}
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
              maxWidth: "100%",
            }}
          >
            {message.replyTo && (
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
                  {message.replyTo.sender}
                </div>
                <div style={{ color: "#666" }}>
                  {message.replyTo.message}
                </div>
              </div>
            )}

            <div
              style={{
                padding: "8px 12px",
                backgroundColor: message.direction === "outgoing" ? "#2196F3" : "#f5f5f5",
                color: message.direction === "outgoing" ? "white" : "#333",
                borderRadius: "12px",
                position: "relative",
                wordBreak: "break-word",
                marginBottom: message.reactions && message.reactions.length > 0 ? "16px" : "0",
              }}
            >
              {message.direction === "incoming" && (
                <div
                  style={{
                    fontSize: "0.85em",
                    fontWeight: "600",
                    color: "#666",
                    marginBottom: "4px",
                    paddingBottom: "4px",
                  }}
                >
                  {message.sender}
                </div>
              )}
              {message.message}
              {message.attachments && message.attachments.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '8px',
                  marginTop: '8px',
                  width: '100%',
                  maxWidth: '400px',
                  backgroundColor: message.direction === 'outgoing' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  padding: '8px',
                  borderRadius: '8px'
                }}>
                  {message.attachments.map(attachment => (
                    <div key={attachment.id} style={{
                      position: 'relative',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: message.direction === 'outgoing' ? 'rgba(255, 255, 255, 0.1)' : '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      transition: 'transform 0.2s ease',
                      cursor: 'pointer'
                    }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                      }}>
                      <AttachmentPreview
                        attachment={attachment}
                      />
                    </div>
                  ))}
                </div>
              )}
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
                    color: message.direction === "outgoing" ? "rgba(255,255,255,0.8)" : "#999999",
                    fontWeight: message.direction === "outgoing" ? "500" : "400",
                  }}
                >
                  {message.sentTime}
                </span>
                {message.direction === "outgoing" && (
                  <span
                    style={{
                      fontSize: "0.75em",
                      color: message.status === "read" ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
                      fontWeight: "500",
                    }}
                  >
                    {getStatusIcon(message.status)}
                  </span>
                )}
              </div>
            </div>
            {message.reactions && message.reactions.length > 0 && (
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
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
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
                {message.reactions.slice(0, 2).map((reaction, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "2px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      borderRadius: "8px",
                    }}
                    onClick={() => onReaction?.(message.id, reaction)}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <span style={{ fontSize: "1.1em" }}>{reaction}</span>
                  </div>
                ))}
                {message.reactions.length > 2 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "8px",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      alert(`All reactions: ${message.reactions?.join(", ")}`);
                    }}
                  >
                    <span
                      style={{
                        color: "#666",
                        fontSize: "0.75em",
                        fontWeight: "500",
                      }}
                    >
                      +{message.reactions.length - 2}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 