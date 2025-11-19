import { View, Text } from '@tarojs/components';
import { ReactNode } from 'react';

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

  const positionClasses = position === 'center'
    ? 'items-center justify-center'
    : 'items-end justify-end';

  return (
    <View className={`fixed inset-0 z-50 flex ${positionClasses}`}>
      {/* Overlay */}
      <View
        className="absolute inset-0 bg-brutal-black/80 backdrop-blur"
        onClick={handleOverlayClick}
      />

      {/* Content */}
      <View className="relative bg-brutal-white border-brutal-lg m-6 w-full max-w-2xl slide-in-up">
        {showHeader && (
          <View className="border-b-4 border-brutal-black p-4 flex items-center justify-between">
            {title && (
              <Text className="font-mono-brutal text-2xl">{title}</Text>
            )}
            {onClose && (
              <Text
                className="text-3xl font-mono-brutal cursor-pointer active-brutal"
                onClick={onClose}
              >
                ×
              </Text>
            )}
          </View>
        )}
        <View className="p-6">{children}</View>
      </View>
    </View>
  );
};

export default Modal;
