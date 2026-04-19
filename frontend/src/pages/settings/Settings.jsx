import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";
import API from "../../services/api";
import styles from "./Settings.module.css";
import Navbar from "../../components/navbar/Navbar";

import userIcon from "../../assets/user.png";
import lockIcon from "../../assets/lock.png";
import eyeIcon from "../../assets/eye.png";
import logoutIcon from "../../assets/Logout.png";

const Settings = () => {
  const navigate = useNavigate();
  const { logout, updateUser } = useAuth();
  const { t } = useLang();

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/user/profile");
      const user = data.user || data;
      setProfile({ name: user.name || "", email: user.email || "" });
    } catch {
      setErrorMsg("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    const payload = {};
    const name = profile.name.trim();
    const email = profile.email.trim().toLowerCase();

    if (name) payload.name = name;
    if (email) payload.email = email;

    if (passwords.oldPassword && passwords.newPassword) {
      if (passwords.newPassword.length < 6) {
        setErrorMsg("New password must be at least 6 characters");
        return;
      }
      payload.oldPassword = passwords.oldPassword;
      payload.newPassword = passwords.newPassword;
    }

    if (Object.keys(payload).length === 0) {
      setErrorMsg("No changes to save");
      return;
    }

    setLoading(true);
    try {
      const { data } = await API.put("/user/profile", payload);
      const updated = data.user || data;
      if (updated?.name || updated?.email) {
        updateUser({ name: updated.name, email: updated.email });
      }
      setSuccessMsg("Profile updated successfully!");
      setPasswords({ oldPassword: "", newPassword: "" });
      fetchProfile();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className={styles.page}>
      <Navbar showWorkspaceDropdown showClose />

      <div className={styles.centered}>
        <div className={styles.card}>
          <h1 className={styles.title}>{t.settingsTitle}</h1>

          {successMsg && (
            <div className={styles.successMessage}>{successMsg}</div>
          )}
          {errorMsg && (
            <div className={styles.errorMessage}>{errorMsg}</div>
          )}

          {/* Profile section */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>{t.profileSection}</h2>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <img src={userIcon} alt="" width="18" height="18" />
                </span>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, name: e.target.value }))
                  }
                  autoComplete="name"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <img src={userIcon} alt="" width="18" height="18" />
                </span>
                <input
                  type="email"
                  className={styles.inputField}
                  placeholder="Email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, email: e.target.value }))
                  }
                  autoComplete="email"
                />
              </div>
            </div>
          </section>

          {/* Password section */}
          <section className={styles.section}>
            <h2 className={styles.sectionLabel}>{t.changePasswordSection}</h2>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <img src={lockIcon} alt="" width="18" height="18" />
                </span>
                <input
                  type={showPasswords.old ? "text" : "password"}
                  className={styles.inputField}
                  placeholder="Current password"
                  value={passwords.oldPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, oldPassword: e.target.value }))
                  }
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() =>
                    setShowPasswords((p) => ({ ...p, old: !p.old }))
                  }
                  aria-label="Toggle password visibility"
                >
                  <img src={eyeIcon} alt="" width="18" height="18" />
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputWrapper}>
                <span className={styles.inputIcon}>
                  <img src={lockIcon} alt="" width="18" height="18" />
                </span>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  className={styles.inputField}
                  placeholder="New password (min 6 characters)"
                  value={passwords.newPassword}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, newPassword: e.target.value }))
                  }
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() =>
                    setShowPasswords((p) => ({ ...p, new: !p.new }))
                  }
                  aria-label="Toggle password visibility"
                >
                  <img src={eyeIcon} alt="" width="18" height="18" />
                </button>
              </div>
            </div>
          </section>

          <button
            className={styles.saveButton}
            onClick={handleUpdateProfile}
            disabled={loading}
          >
            {loading ? t.saving : t.saveChanges}
          </button>

          <div className={styles.logoutRow}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <img src={logoutIcon} alt="" width="16" height="16" />
              Log out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
