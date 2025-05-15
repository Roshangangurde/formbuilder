import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import styles from "./Register.module.css";
import backIcon from "../../assets/arrow_back.png";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/user/register", { name: username, email, password, confirmPassword });
      alert("Registered successfully!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <div className={styles.backSection}>
        <button className={styles.backButton} onClick={() => { navigate("/") }}>
          <img src={backIcon} alt="Back" width="25" height="25" />
        </button>
      </div>

      <div className={styles.registerContainer}>
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.registerButton}>
            Register
          </button>

          <div className={styles.divider}>or</div>

          <button type="button" className={styles.googleButton}>
            Sign in with Google
          </button>

          <div className={styles.registerLink}>
            Already have an account?{" "}
            <a href="/login" onClick={(e) => {e.preventDefault(); navigate("/login");}}>
              Login
            </a>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
