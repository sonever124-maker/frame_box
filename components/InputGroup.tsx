
import React from 'react';

interface InputGroupProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, value, onChange, unit = "mm" }) => {
  return (
    // Fix: Using className instead of class for React elements
    <div className="flex flex-col gap-1 w-full">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value === 0 ? "" : value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900"
          placeholder="0"
        />
        <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{unit}</span>
      </div>
    </div>
  );
};

export default InputGroup;
