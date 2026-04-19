import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./Navbar.module.css";
import { useDarkMode } from "../../context/DarkModeContext";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";

const Navbar = ({
  showFormName = false,
  formName = "",
  onNameChange = () => {},
  showFlow = false,
  showResponse = false,
  activeTab = "",
  onFlowClick = () => {},
  onResponseClick = () => {},
  showWorkspaceDropdown = false,
  showShare = false,
  onShare = () => {},
  shareLabel = "Share",
  showSave = false,
  onSave = () => {},
  saveDisabled = false,
  showClose = true,
}) => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const { lang, setLang, t, translating, INDIAN_LANGUAGES } = useLang();

  const handleWorkspaceAction = (value) => {
    if (value === "settings") {
      navigate("/settings");
      return;
    }

    if (value === "logout") {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header
      className={styles.navbar}
    >
      <div className={styles.leftSide}>
        {showFormName && (
          <input
            type="text"
            value={formName}
            onChange={(e) =>
              onNameChange(e.target.value)
            }
            className={styles.formNameInput}
            placeholder={t.formNamePlaceholder}
            aria-label="Form name"
          />
        )}

        {showFlow && (
          <button
            type="button"
            className={`${styles.navButton} ${activeTab === "flow" ? styles.active : ""}`}
            onClick={onFlowClick}
          >
            {t.flow}
          </button>
        )}

        {showResponse && (
          <button
            type="button"
            className={`${styles.navButton} ${activeTab === "response" ? styles.active : ""}`}
            onClick={onResponseClick}
          >
            {t.responses}
          </button>
        )}
      </div>

      {showWorkspaceDropdown && (
        <div className={styles.dropdown}>
          <select
            value=""
            onChange={(e) => handleWorkspaceAction(e.target.value)}
            aria-label="Workspace menu"
          >
            <option value="" disabled>
              {user?.name || "Workspace"}
            </option>
            <option value="settings">{t.settingsMenu}</option>
            <option value="logout">{t.logout}</option>
          </select>
        </div>
      )}

      <div className={styles.rightSide}>
        {/* Language selector */}
        <div className={styles.langWrap}>
          <span className={styles.globeIcon}>🌐</span>
          <select
            className={styles.langSelect}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            aria-label="Select language"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.native}</option>
            ))}
          </select>
          {translating && <span className={styles.translatingDot} title="Translating..." />}
        </div>

        <span className={styles.themeLabel}>{t.light}</span>
        <label className={styles.switch}>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            aria-label="Toggle dark mode"
          />
          <span className={styles.slider}></span>
        </label>
        <span className={styles.themeLabel}>{t.dark}</span>

        {showShare && (
          <button type="button" onClick={onShare} className={styles.shareButton}>
            {shareLabel}
          </button>
        )}

        {showSave && (
          <button
            type="button"
            onClick={onSave}
            className={styles.saveButton}
            disabled={saveDisabled}
          >
            {saveDisabled ? t.saving : t.save}
          </button>
        )}

        {showClose && (
          <button
            type="button"
            onClick={() => navigate("/forms")}
            className={styles.closeButton}
            aria-label="Close"
          >
            ✖
          </button>
        )}
      </div>
    </header>
  );
};

Navbar.propTypes = {
  showFormName: PropTypes.bool,
  formName: PropTypes.string,
  onNameChange: PropTypes.func,
  showFlow: PropTypes.bool,
  showResponse: PropTypes.bool,
  activeTab: PropTypes.string,
  onFlowClick: PropTypes.func,
  onResponseClick: PropTypes.func,
  showWorkspaceDropdown: PropTypes.bool,
  showShare: PropTypes.bool,
  onShare: PropTypes.func,
  shareLabel: PropTypes.string,
  showSave: PropTypes.bool,
  onSave: PropTypes.func,
  saveDisabled: PropTypes.bool,
  showClose: PropTypes.bool,
};

export default Navbar;