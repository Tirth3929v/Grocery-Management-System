import React from 'react';

const AuthLayout = ({ title, children, footerLinkText, footerText, onFooterLinkClick }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-6">{title}</h2>
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        {children}
      </div>
      <p className="text-center text-sm text-slate-600 mt-6">
        {footerText} <button onClick={onFooterLinkClick} className="font-medium text-green-600 hover:text-green-500">{footerLinkText}</button>
      </p>
    </div>
  </div>
);

export default AuthLayout;