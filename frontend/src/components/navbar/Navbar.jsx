import { useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import { useDarkMode } from "../../context/DarkModeContext";

const Navbar = ({
  showFormName = false,
  formName = "",
  onNameChange = () => {},
  showFlow = false,
  showResponse = false,
  activeTab = "",
  onFlowClick,
  onResponseClick,
  showWorkspaceDropdown = false,
  showShare = false,
  onShare = () => {},
  showSave = false,
  onSave = () => {},
  showClose = true,
}) => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode(); // Added parentheses here

  return (
    <div className={`${styles.navbar} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.leftSide}>
        {showFormName && (
          <input
            type="text"
            value={formName}
            onChange={(e) => onNameChange(e.target.value)}
            className={styles.formNameInput}
            placeholder="Form Name"
          />
        )}
        {showFlow && (
          <button
            className={`${styles.navButton} ${activeTab === "flow" ? styles.active : ""}`}
            onClick={onFlowClick}
          >
            Flow
          </button>
        )}
        {showResponse && (
          <button
            className={`${styles.navButton} ${activeTab === "response" ? styles.active : ""}`}
            onClick={onResponseClick}
          >
            Response
          </button>
        )}
      </div>

      {showWorkspaceDropdown && (
        <div className={styles.dropdown}>
          <select onChange={(e) => {
            if (e.target.value === "settings") navigate("/settings");
            if (e.target.value === "logout") {
              localStorage.clear();
              navigate("/login");
            }
          }}>
            <option value="workspace2">Workspace 2</option>
            <option value="settings">Settings</option>
            <option value="logout">Logout</option>
          </select>
        </div>
      )}

      <div className={styles.rightSide}>
        <label>Light</label>
        <label className={styles.switch}>
          <input 
            type="checkbox" 
            checked={darkMode} 
            onChange={toggleDarkMode}
            aria-label="Toggle dark mode"
          />
          <span className={styles.slider}></span>
        </label>
        <label>Dark</label>
        {showShare && (
          <button onClick={onShare} className={styles.shareButton}>
            Share
          </button>
        )}
        {showSave && (
          <button onClick={onSave} className={styles.saveButton}>
            Save
          </button>
        )}
        {showClose && (
          <button onClick={() => navigate("/forms")} className={styles.closeButton}>
            ✖
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
