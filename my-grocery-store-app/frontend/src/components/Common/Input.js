import React from 'react';

const Input = ({ id, name, type, placeholder, value, onChange, label, error, autoComplete }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-1 ${error ? 'border-red-500 ring-red-500' : 'border-slate-300 focus:ring-green-500'}`}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

export default Input;