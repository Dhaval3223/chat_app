import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { ChatMessage } from './types';

interface EditModalProps {
  show: boolean;
  onHide: () => void;
  editingMessage: ChatMessage | null;
  onEdit: (message: ChatMessage) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  show,
  onHide,
  editingMessage,
  onEdit
}) => {
  const [editedMessage, setEditedMessage] = React.useState<string>('');

  React.useEffect(() => {
    if (editingMessage) {
      setEditedMessage(editingMessage.message);
    }
  }, [editingMessage]);

  const handleSubmit = () => {
    if (editingMessage) {
      onEdit({
        ...editingMessage,
        message: editedMessage
      });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      dialogClassName="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Message</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={3}
              value={editedMessage}
              onChange={(e) => setEditedMessage(e.target.value)}
              placeholder="Edit your message..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; 