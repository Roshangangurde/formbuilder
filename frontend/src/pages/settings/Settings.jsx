import { useState , useContext  } from 'react';
import  AuthContext  from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom'; 
import styles from './Settings.module.css';
import API from '../../services/api';
import userIcon from '../../assets/user.png';
import lockIcon from '../../assets/lock.png'; 
import eyeIcon from '../../assets/eye.png';
import logoutIcon from '../../assets/logout.png';


const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { logout } = useContext(AuthContext);
const navigate = useNavigate();

  const handleUpdateProfile = async () => {
    try {
      const change = {};
  
      if (name) change.name = name;
      if (email) change.email = email;
      if (oldPassword && newPassword) {
        change.oldPassword = oldPassword;
        change.newPassword = newPassword;
      }
  
      const res = await API.put('/user/profile', change);
  
      alert('Profile updated successfully!');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error updating profile');
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.settings}>
      <div className={styles.settingsContainer}>
        <h1 className={styles.title}>Settings</h1>

        <div className={styles.formGroup}>
       
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <img src={userIcon} alt="User icon" width="20" height="20" />
              </span>
              <input
                type="text"
                className={styles.inputField}
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>


          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <img src={lockIcon} alt="Email icon" width="20" height="20" />
              </span>
              <input
                type="email"
                className={styles.inputField}
                placeholder="Update Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <img src={lockIcon} alt="Password icon" width="18" height="18" />
              </span>
              <input
                type={showOldPassword ? 'text' : 'password'}
                className={styles.inputField}
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                <img
                  src={eyeIcon}
                  alt="Toggle password visibility"
                  width="20"
                  height="20"
                />
              </button>
            </div>
          </div>

          
          <div className={styles.inputGroup}>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>
                <img src={lockIcon} alt="Password icon" width="20" height="20" />
              </span>
              <input
                type={showNewPassword ? 'text' : 'password'}
                className={styles.inputField}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <img
                  src={eyeIcon}
                  alt="Toggle password visibility"
                  width="18"
                  height="18"
                />
              </button>
            </div>
          </div>
        </div>

        
        <button className={styles.updateButton} onClick={handleUpdateProfile}>
          Update
        </button>

        
        <div className={styles.logoutSection}>
          <button className={styles.logoutButton} onClick={handleLogout}>
            <img src={logoutIcon} alt="Logout icon" width="18" height="18" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
