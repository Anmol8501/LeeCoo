import React from 'react';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password = '',
}) => {
  const checks = [
    { label: 'At least 8 characters', regex: /.{8,}/ },
    { label: 'At least one uppercase letter', regex: /[A-Z]/ },
    { label: 'At least one number', regex: /[0-9]/ },
    { label: 'At least one special character', regex: /[@$!%*?&#^()_+=\-[\]{}|;:',.<>/?~`]/ },
  ];

  const score = checks.filter((c) => c.regex.test(password)).length;

  const getStrengthLabelAndColor = () => {
    if (!password) return { label: '', colorClass: 'bg-transparent', textClass: 'text-slate-500' };
    switch (score) {
      case 0:
      case 1:
        return { label: 'Very Weak', colorClass: 'bg-red-500', textClass: 'text-red-400' };
      case 2:
        return { label: 'Weak', colorClass: 'bg-orange-500', textClass: 'text-orange-400' };
      case 3:
        return { label: 'Medium', colorClass: 'bg-yellow-500', textClass: 'text-yellow-400' };
      case 4:
        return { label: 'Strong', colorClass: 'bg-green-500', textClass: 'text-green-400' };
      default:
        return { label: '', colorClass: 'bg-transparent', textClass: 'text-slate-500' };
    }
  };

  const { label, colorClass, textClass } = getStrengthLabelAndColor();

  return (
    <div className="mt-3 text-xs">
      {password && (
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-400">Strength:</span>
            <span className={`font-semibold ${textClass}`}>{label}</span>
          </div>
          <div className="grid grid-cols-4 gap-1 h-1 bg-slate-800 rounded overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-full transition duration-300 ${
                  i <= score ? colorClass : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>
      )}
      <ul className="space-y-1 mt-2 text-slate-400">
        {checks.map((check, index) => {
          const isPassed = check.regex.test(password);
          return (
            <li key={index} className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${isPassed ? 'bg-green-500' : 'bg-slate-700'}`} />
              <span className={isPassed ? 'text-slate-300 line-through decoration-slate-600' : 'text-slate-500'}>
                {check.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default PasswordStrengthIndicator;
