import React from 'react';

interface ErrorAlertProps {
  message?: string;
  errors?: string[];
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, errors = [] }) => {
  if (!message && errors.length === 0) return null;

  return (
    <div className="p-3.5 bg-red-950/40 border border-red-500/30 rounded-lg text-sm text-red-300 backdrop-blur-sm mb-4 animate-slideDown">
      <div className="flex gap-2">
        <svg
          className="h-5 w-5 text-red-400 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <div className="flex-1">
          {message && <p className="font-semibold">{message}</p>}
          {errors.length > 0 && (
            <ul className="list-disc pl-4 mt-1.5 space-y-1 text-red-400/90 text-xs">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
export default ErrorAlert;
