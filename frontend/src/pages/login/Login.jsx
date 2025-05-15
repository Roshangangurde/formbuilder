import { useState, useContext } from "react";
import API from "../../services/api";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import backIcon from "../../assets/arrow_back.png"

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post("/user/login", { email, password });
            login(data, data.token);
            navigate("/forms");
        } catch (error) {
            alert(error.response?.data?.message || "Login failed");
        }
    };

    const handleGoogleLogin = () => {
        // Add your Google login logic here
        console.log("Google login clicked");
    };

    const handleloginClick = (e) => {
        e.preventDefault();
        navigate("/login");
    };

    return (
      <>
             <div className={styles.backSection}>
             <button className={styles.backButton} onClick={() =>{navigate("/")}}>
               <img src={backIcon} alt="back" width="25" height="25" />
             </button>
           </div>
        <div className={styles.loginContainer}>
               <form onSubmit={handleSubmit} className={styles.loginForm}>
               <div className={styles.formGroup}></div>
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
     
                
                 <button type="submit" className={styles.loginButton}>
                     Log in
                 </button>
                 
                 <div className={styles.divider}>or</div>
                 
                 <button 
                     type="button" 
                     className={styles.googleButton}
                     
                 >
                     Sign in with Google
                 </button>
                 
                 <div className={styles.loginLink}>
                     ALreay have an account?{" "}
                     <a href="/register" onClick={()=>{navigate("/register")}}>
                         Register now
                     </a>
                 </div>
             </form>
         </div>
         </>
    );
};

export default Login;