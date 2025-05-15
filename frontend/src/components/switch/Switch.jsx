import React, { useEffect, useState } from 'react';
import './Switch.module.css';

const Switch = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : '';
  }, [darkMode]);

  return (
    <label className="styles.switch">
      <input
        type="checkbox"
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <span className="styles.slider"></span>
    </label>
  );
};

export default Switch;
