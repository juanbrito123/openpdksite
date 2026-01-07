import React from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all group ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">{title}</h3>
        {subtitle && (
          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded uppercase tracking-tighter border border-slate-200 dark:border-slate-700">
            {subtitle}
          </span>
        )}
      </div>
      <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
        {children}
      </div>
    </div>
  );
};

export default Card;