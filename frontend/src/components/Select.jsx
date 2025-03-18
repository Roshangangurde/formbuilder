import React from "react";

export default function Select({ value, onChange, options = [], className }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`p-2 border border-gray-700 rounded bg-gray-900 text-white ${className}`}
    >
      {options.length > 0 ? (
        options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))
      ) : (
        <option value="">No options available</option>
      )}
    </select>
  );
}
