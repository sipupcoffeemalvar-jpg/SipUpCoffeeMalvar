import React from 'react';
 
interface ConfirmMessageProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  theme?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmMessage: React.FC<ConfirmMessageProps> = ({
  isOpen,
  title = 'Kumpirmahin ang Aksyon',
  message,
  confirmText = 'Oo, Ituloy',
  cancelText = 'Kanselahin',
  theme = 'danger',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const themes: Record<string, { iconBg: string; btn: string; symbol: string }> = {
    danger: {
      iconBg: 'bg-rose-100 text-rose-600',
      btn: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500',
      symbol: '!'
    },
    warning: {
      iconBg: 'bg-amber-100 text-amber-600',
      btn: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      symbol: '!'
    },
    primary: {
      iconBg: 'bg-indigo-100 text-indigo-600',
      btn: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
      symbol: '?'
    }
  };

  const currentTheme = themes[theme] || themes.danger;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md transition-opacity">
      <div className="w-full max-w-md bg-white rounded-xl p-6 shadow-2xl border border-slate-100">
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${currentTheme.iconBg}`}
          >
            {currentTheme.symbol}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors cursor-pointer ${currentTheme.btn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmMessage;