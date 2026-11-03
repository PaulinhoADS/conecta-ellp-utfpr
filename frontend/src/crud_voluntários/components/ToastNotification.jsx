import React from 'react';

export default function ToastNotification({ toast }) {
  if (!toast) return null;

  return (
    <div className="toast-container">
      <div className={`toast ${toast.tipo}`}>
        {toast.mensagem}
      </div>
    </div>
  );
}