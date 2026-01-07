import React from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, subtitle, children, className = "" }) => {
  return (
    <div className={`bg-white border border-slate-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-all group ${className}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{title}</h3>
        {subtitle && (
          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded uppercase tracking-tighter">
            {subtitle}
          </span>
        )}
      </div>
      <div className="text-slate-600 leading-relaxed text-sm font-medium">
        {children}
      </div>
    </div>
  );
};

export default Card;