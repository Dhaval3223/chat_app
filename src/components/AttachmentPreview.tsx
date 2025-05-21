import React from 'react';
import { Attachment } from './types';
import { Card, Image, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface AttachmentPreviewProps {
  attachment: Attachment;
}

export const AttachmentPreview: React.FC<AttachmentPreviewProps> = ({ attachment }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    const iconStyle = {
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
      transition: 'transform 0.3s ease',
    };

    switch (type) {
      case 'pdf':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF4B4B" strokeWidth="2" style={iconStyle}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <text x="8" y="18" fontSize="8" fill="#FF4B4B" fontWeight="bold">PDF</text>
          </svg>
        );
      case 'docx':
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2196F3" strokeWidth="2" style={iconStyle}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <text x="8" y="18" fontSize="8" fill="#2196F3" fontWeight="bold">DOC</text>
          </svg>
        );
      default:
        return (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" style={iconStyle}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        );
    }
  };

  const renderPreview = () => {
    switch (attachment.type) {
      case 'image':
        return (
          <Card className="border-0 shadow-sm h-100">
            <div className="position-relative" style={{ paddingTop: '75%' }}>
              <Image
                src={attachment.url}
                alt={attachment.name}
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  objectFit: 'cover',
                  //borderRadius: '16px',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white"
                style={{
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  //borderBottomLeftRadius: '16px',
                  //borderBottomRightRadius: '16px',
                  backdropFilter: 'blur(4px)',
                }}>
                <small>{attachment.name}</small>
              </div>
            </div>
          </Card>
        );
      case 'video':
        return (
          <Card className="border-0 shadow-sm h-100">
            <div className="position-relative" style={{ paddingTop: '75%' }}>
              <video
                src={attachment.url}
                controls
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{
                  objectFit: 'cover',
                  borderRadius: '16px',
                  backgroundColor: '#000',
                }}
              />
              <div className="position-absolute bottom-0 start-0 end-0 p-3 text-white"
                style={{
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  borderBottomLeftRadius: '16px',
                  borderBottomRightRadius: '16px',
                  backdropFilter: 'blur(4px)',
                }}>
                <small>{attachment.name}</small>
              </div>
            </div>
          </Card>
        );
      case 'audio':
        return (
          <Card className="border-0 shadow-sm h-100">
            <Card.Body className="d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-3 p-3" style={{
                  background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                </div>
                <div className="flex-grow-1 text-truncate">
                  {attachment.name}
                </div>
              </div>
              <audio
                src={attachment.url}
                controls
                className="w-100"
                style={{ height: '40px' }}
              />
            </Card.Body>
          </Card>
        );
      case 'document':
      default:
        const fileExtension = attachment.name.split('.').pop()?.toLowerCase() || '';
        return (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{attachment.name}</Tooltip>}
          >
            <Card 
              className="border-0 shadow-sm h-100"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
              }}
            >
              <Card.Body className="d-flex flex-column align-items-center justify-content-center gap-3 py-4">
                {getFileIcon(fileExtension)}
                <div className="text-center">
                  <div className="fw-medium mb-2" style={{ lineHeight: '1.4' }}>
                    {attachment.name}
                  </div>
                  <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                    {formatFileSize(attachment.size)}
                  </Badge>
                </div>
              </Card.Body>
            </Card>
          </OverlayTrigger>
        );
    }
  };

  return (
    <div className="w-100 h-100">
      {renderPreview()}
    </div>
  );
}; 