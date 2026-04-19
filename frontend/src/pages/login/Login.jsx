import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";
import styles from "./Login.module.css";
import backIcon from "../../assets/arrow_back.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLang();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    if (!email || !password) {
      setError(t.fillInAllFields);
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post("/user/login", {
        email,
        password,
      });

      login({ userId: data.userId, name: data.name, email: data.email }, data.token);
      navigate("/forms");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t.loginFailed
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("Google login integration coming soon 🚀");
  };

  return (
    <>
      <div className={styles.backSection}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/")}
          aria-label="Go back to home"
        >
          <img src={backIcon} alt="Back" width="25" height="25" />
        </button>
      </div>

      <div className={styles.loginContainer}>
        <form
          onSubmit={handleSubmit}
          className={styles.loginForm}
        >
          <h1 className={styles.title}>{t.welcomeBack}</h1>
          <p className={styles.subtitle}>{t.signInToContinue}</p>

          {error && (
            <p className={styles.errorMessage}>{error}</p>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="email">{t.emailLabel}</label>
            <input
              type="email"
              id="email"
              placeholder={t.enterEmail}
              value={formData.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">{t.passwordLabel}</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                updateField("password", e.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.loginButton}
            disabled={loading}
          >
            {loading ? t.loggingIn : t.logIn}
          </button>

          <div className={styles.divider}>{t.orDivider}</div>

          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleLogin}
          >
            {t.continueWithGoogle}
          </button>

          <div className={styles.loginLink}>
            {t.noAccount}{" "}
            <Link to="/register">{t.registerNow}</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;