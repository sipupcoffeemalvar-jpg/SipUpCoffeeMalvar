import React, { createContext, useContext, useState, useCallback } from 'react';
import AlertMessage from './../../components/common/AlertMessage';
import ConfirmModal from '../../components/common/ConfirmModal';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [alert, setAlert] = useState({ type: 'info', message: '' });
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Oo, Ituloy',
    cancelText: 'Kanselahin',
    theme: 'danger',
    resolve: null
  });

  // Function para magpakita ng Alert Toast
  const showAlert = useCallback((message, type = 'info') => {
    setAlert({ message, type });
  }, []);

  // Promise-based Confirm Dialog
  const confirm = useCallback(
    ({
      title = 'Kumpirmahin ang Aksyon',
      message,
      confirmText = 'Oo, Ituloy',
      cancelText = 'Kanselahin',
      theme = 'danger'
    }) => {
      return new Promise((resolve) => {
        setConfirmState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          theme,
          resolve
        });
      });
    },
    []
  );

  const handleConfirm = () => {
    confirmState.resolve?.(true);
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    confirmState.resolve?.(false);
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <FeedbackContext.Provider value={{ showAlert, confirm }}>
      {children}

      <AlertMessage
        type={alert.type}
        message={alert.message}
        onClose={() => setAlert({ type: 'info', message: '' })}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText={confirmState.confirmText}
        cancelText={confirmState.cancelText}
        theme={confirmState.theme}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => useContext(FeedbackContext);