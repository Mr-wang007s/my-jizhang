import { View } from '@tarojs/components';
import { ReactNode } from 'react';
import './index.scss';

interface ModalProps {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  closeOnOverlay?: boolean;
  showHeader?: boolean;
  position?: 'center' | 'bottom';
}

const Modal = ({
  visible,
  onClose,
  title,
  children,
  closeOnOverlay = true,
  showHeader = true,
  position = 'bottom'
}: ModalProps) => {
  if (!visible) return null;

  const handleOverlayClick = () => {
    if (closeOnOverlay && onClose) {
      onClose();
    }
  };

  return (
    <View className="modal-container">
      <View className="modal-overlay" onClick={handleOverlayClick} />
      <View className={`modal-content modal-${position}`}>
        {showHeader && (
          <View className="modal-header">
            {title && <View className="modal-title">{title}</View>}
            {onClose && (
              <View className="modal-close" onClick={onClose}>
                ×
              </View>
            )}
          </View>
        )}
        <View className="modal-body">{children}</View>
      </View>
    </View>
  );
};

export default Modal;
