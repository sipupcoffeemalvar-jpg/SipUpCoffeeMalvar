import React, { useEffect } from 'react';
 
interface AlertMessageProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ 
  type = 'info', 
  message, 
  onClose 
}) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2500); // 2.5 seconds auto-close
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const badgeColors: Record<string, string> = {
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    error: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    info: 'bg-sky-500/20 text-sky-400 border-sky-500/30'
  };

  const icons: Record<string, string> = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'i'
  };

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 min-w-[300px] max-w-md bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white rounded-lg shadow-2xl transition-all duration-300">
      <span
        className={`flex items-center justify-center w-6 h-6 rounded-full border text-xs font-bold shrink-0 ${
          badgeColors[type] || badgeColors.info
        }`}
      >
        {icons[type] || icons.info}
      </span>

      <p className="flex-1 text-sm font-medium text-slate-100">{message}</p>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-white text-lg leading-none cursor-pointer transition-colors"
        aria-label="Close alert"
      >
        &times;
      </button>
    </div>
  );
};

export default AlertMessage;