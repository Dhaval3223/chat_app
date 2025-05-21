import React, { useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Attachment } from './types';
import { AttachmentPreview } from './AttachmentPreview';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: Attachment[];
  onRemoveAttachment: (id: string) => void;
  onFileSelect: (files: FileList) => void;
}

export const AttachmentModal: React.FC<AttachmentModalProps> = ({
  isOpen,
  onClose,
  attachments,
  onRemoveAttachment,
  onFileSelect
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
      // Reset the input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Attachments</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {attachments.map(attachment => (
            <div key={attachment.id} style={{
              position: 'relative',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <AttachmentPreview attachment={attachment} />
              <button
                onClick={() => onRemoveAttachment(attachment.id)}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0, 0, 0, 0.5)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  padding: 0
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          multiple
        />
        <Button
          variant="outline-primary"
          onClick={handleAddFiles}
          style={{
            width: '100%',
            padding: '12px',
            border: '2px dashed #2196F3',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            color: '#2196F3',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(33, 150, 243, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Add Files
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
  );
}; 