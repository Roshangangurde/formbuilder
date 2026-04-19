import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../services/api";
import { useLang } from "../../context/LanguageContext";
import styles from "./Register.module.css";
import backIcon from "../../assets/arrow_back.png";

const getPasswordStrength = (pwd) => {
  if (!pwd) return null;

  const strong =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
      pwd
    );

  const medium =
    /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(pwd);

  if (strong) return "strong";
  if (medium) return "medium";
  return "weak";
};

const Register = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(
    formData.password
  );

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const username = formData.username.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword =
      formData.confirmPassword;

    if (!username) {
      setError("Username is required");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await API.post("/user/register", {
        name: username,
        email,
        password,
        confirmPassword,
      });

      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    setError("Google signup coming soon 🚀");
  };

  const strengthClass = strength
    ? styles[
        `strength${
          strength.charAt(0).toUpperCase() +
          strength.slice(1)
        }`
      ]
    : "";

  return (
    <>
      <div className={styles.backSection}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/")}
          aria-label="Go back to home"
        >
          <img
            src={backIcon}
            alt="Back"
            width="25"
            height="25"
          />
        </button>
      </div>

      <div className={styles.registerContainer}>
        <form
          onSubmit={handleSubmit}
          className={styles.registerForm}
        >
          <h1 className={styles.title}>{t.createYourAccount}</h1>
          <p className={styles.subtitle}>{t.startBuilding}</p>

          {error && (
            <p className={styles.errorMessage}>
              {error}
            </p>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="username">{t.usernameLabel}</label>
            <input
              type="text"
              id="username"
              placeholder={t.enterUsername}
              value={formData.username}
              onChange={(e) =>
                updateField(
                  "username",
                  e.target.value
                )
              }
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">{t.emailLabel}</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
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
                updateField(
                  "password",
                  e.target.value
                )
              }
              autoComplete="new-password"
              required
            />

            {strength && (
              <div
                className={styles.passwordStrength}
              >
                <div
                  className={`${styles.strengthBar} ${strengthClass}`}
                />
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">{t.confirmPasswordLabel}</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) =>
                updateField(
                  "confirmPassword",
                  e.target.value
                )
              }
              autoComplete="new-password"
              required
            />
          </div>

          <button
            type="submit"
            className={styles.registerButton}
            disabled={loading}
          >
            {loading ? t.registering : t.register}
          </button>

          <div className={styles.divider}>{t.orDivider}</div>

          <button
            type="button"
            className={styles.googleButton}
            onClick={handleGoogleSignup}
          >
            {t.continueWithGoogle}
          </button>

          <div className={styles.registerLink}>
            {t.alreadyHaveAccount}{" "}
            <Link to="/login">{t.loginLink}</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;