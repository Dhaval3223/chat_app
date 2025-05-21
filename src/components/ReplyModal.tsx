import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { ChatMessage } from './types';

interface ReplyModalProps {
  show: boolean;
  onHide: () => void;
  replyingTo: ChatMessage | null;
  onSubmit: (message: string) => void;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  show,
  onHide,
  replyingTo,
  onSubmit
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        onSubmit(value);
        e.currentTarget.value = "";
      }
    }
  };

  const handleSubmit = () => {
    const input = document.querySelector("textarea") as HTMLTextAreaElement;
    if (input && input.value.trim()) {
      onSubmit(input.value.trim());
      input.value = "";
    }
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
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
                onKeyPress={handleKeyPress}
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
            onClick={onHide}
            className="btn-light"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="btn-primary"
          >
            Send Reply
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
    </>
  );
}; 