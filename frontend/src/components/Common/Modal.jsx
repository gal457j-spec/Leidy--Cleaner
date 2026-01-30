import React from 'react';

export const Modal = ({ isOpen, title, children, onClose, actions = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex gap-3 p-6 border-t">
            {actions.map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                  action.variant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
