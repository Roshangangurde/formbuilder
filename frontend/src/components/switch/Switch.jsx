import PropTypes from "prop-types";
import styles from "./Switch.module.css";
import { useDarkMode } from "../../context/DarkModeContext";

const Switch = ({ label = false }) => {
  const { darkMode, toggleDarkMode } =
    useDarkMode();

  return (
    <label className={styles.switchWrapper}>
      {label && (
        <span className={styles.label}>
          {darkMode ? "Dark" : "Light"}
        </span>
      )}

      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={toggleDarkMode}
          aria-label="Toggle dark mode"
        />
        <span className={styles.slider}></span>
      </label>
    </label>
  );
};

Switch.propTypes = {
  label: PropTypes.bool,
};

export default Switch;