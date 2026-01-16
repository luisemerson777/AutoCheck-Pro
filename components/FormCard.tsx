
import React from 'react';

interface Props {
  title: string;
  icon: string;
  children: React.ReactNode;
}

const FormCard: React.FC<Props> = ({ title, icon, children }) => {
  return (
    <div className="bg-white border border-slate-50 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-100/50 hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500">
      <div className="px-8 py-6 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1D63BD]">
            <i className={`fas ${icon} text-lg`}></i>
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
        </div>
        <div className="h-1.5 w-12 bg-slate-100 rounded-full"></div>
      </div>
      <div className="p-8">
        {children}
      </div>
    </div>
  );
};

export default FormCard;
