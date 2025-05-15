import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import logo from '../../assets/logo.png';
import app from '../../assets/app.png';
import IMG1 from "../../assets/IMG1.png";
import IMG2 from "../../assets/IMG2.png";




const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.landing}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}><img src={logo} alt="logoIcon"/></span>
          <span className={styles.logoText} onClick={() => navigate('/login')}>FormBot</span>
        </div>
        <div className={styles.authButtons}>
          <button className={styles.signInButton} onClick={() => navigate('/login')}>Sign In</button>
          <button className={styles.createButton} onClick={() => navigate('/login')}>Create a FormBot</button>
        </div>
      </header>

      <main className={styles.main}>
        
        <section className={styles.hero}>  
        <div className={styles.heromain}>
      <img src={IMG1} className={styles.logoIMG} alt="logoIcon"/>
      </div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Build advanced chatbots
              <br />
              visually
            </h1>
            <p className={styles.heroSubtitle}>
              Typebot gives you powerful blocks to create unique chat experiences. Embed them
              anywhere on your web/mobile apps and start collecting results like magic.
            </p>
            <button className={styles.ctaButton} >Create a FormBot for free</button>
          </div>
          <div>
          <img className={styles.logoIMG} src={IMG2} alt="logoIcon"/>
          </div>
           
        </section>
        

        <section>
        <div className={styles.heroImage}>
            <img src={app} alt="FormBot Builder Preview" className={styles.builderPreview} />
          </div>
          
        </section>
      </main>
  
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
          <span className={styles.logoIcon}><img src={logo} alt="logoIcon"/></span>
            <span className={styles.footerLogoText}>FormBot</span>
          </div>
          <p className={styles.footerTagline}>
            Made with ❤️ by @civette
          </p>

          <div className={styles.footerLinks}>
            <div className={styles.footerLinkSection}>
              <h3 className={styles.footerLinkTitle}>Product</h3>
              <a href="#status" className={styles.footerLink}>Status</a>
              <a href="#docs" className={styles.footerLink}>Documentation</a>
              <a href="#roadmap" className={styles.footerLink}>Roadmap</a>
              <a href="#pricing" className={styles.footerLink}>Pricing</a>
            </div>

            <div className={styles.footerLinkSection}>
              <h3 className={styles.footerLinkTitle}>Community</h3>
              <a href="#discord" className={styles.footerLink}>Discord</a>
              <a href="#github" className={styles.footerLink}>GitHub repository</a>
              <a href="#twitter" className={styles.footerLink}>Twitter</a>
              <a href="#linkedin" className={styles.footerLink}>LinkedIn</a>
              <a href="#oss" className={styles.footerLink}>OSS Friends</a>
            </div>

            <div className={styles.footerLinkSection}>
              <h3 className={styles.footerLinkTitle}>Company</h3>
              <a href="#about" className={styles.footerLink}>About</a>
              <a href="#contact" className={styles.footerLink}>Contact</a>
              <a href="#terms" className={styles.footerLink}>Terms of Service</a>
              <a href="#privacy" className={styles.footerLink}>Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;


    