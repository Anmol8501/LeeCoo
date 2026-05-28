import React, { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-300 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-3.5 py-2 bg-white/60 dark:bg-[#1a2332]/60 border ${
          error ? 'border-red-500/80 focus:ring-red-500/20' : 'border-slate-200 dark:border-[#10b981]/20 focus:border-emerald-500/60 focus:ring-emerald-500/20'
        } rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-4 transition duration-200 backdrop-blur-sm ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-400 font-medium animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
};
export default FormField;
