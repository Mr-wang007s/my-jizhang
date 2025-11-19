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
    <View className={`fixed inset-0 z-50 flex ${positionClasses} animate-fade-in`}>
      {/* Overlay */}
      <View
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={handleOverlayClick}
      />

      {/* Content */}
      <View className={`relative glass-card w-full max-w-2xl animate-slide-up ${
        position === 'bottom' ? 'rounded-t-3xl' : 'rounded-3xl m-6'
      }`}>
        {/* Drag Indicator (for bottom sheets) */}
        {position === 'bottom' && (
          <View className="pt-2 pb-4 flex justify-center">
            <View className="w-10 h-1 bg-gray-300 rounded-full" />
          </View>
        )}

        {showHeader && (
          <View className="px-6 pb-4 flex items-center justify-between border-b border-gray-100">
            {title && (
              <Text className="text-xl font-bold text-gray-900">{title}</Text>
            )}
            {onClose && (
              <View
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
                onClick={onClose}
              >
                <Text className="text-xl text-gray-500">×</Text>
              </View>
            )}
          </View>
        )}
        <View className="p-6">{children}</View>
      </View>
    </View>
  );
};

export default Modal;
