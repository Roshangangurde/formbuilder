
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

import logo from "../../assets/logo.png";
import app from "../../assets/app.png";
import IMG1 from "../../assets/IMG1.png";
import IMG2 from "../../assets/IMG2.png";

const Home = () => {
  const navigate = useNavigate();

  const goToLogin = () => navigate("/login");
  const goToRegister = () => navigate("/register");

  const footerSections = [
    {
      title: "Product",
      links: ["Status", "Documentation", "Roadmap", "Pricing"],
    },
    {
      title: "Community",
      links: [
        "Discord",
        "GitHub repository",
        "Twitter",
        "LinkedIn",
        "OSS Friends",
      ],
    },
    {
      title: "Company",
      links: ["About", "Contact", "Terms of Service", "Privacy Policy"],
    },
  ];

  return (
    <div className={styles.landing}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo} onClick={goToLogin}>
          <span className={styles.logoIcon}>
            <img src={logo} alt="FormBot logo" />
          </span>
          <span className={styles.logoText}>FormBot</span>
        </div>

        <div className={styles.authButtons}>
          <button
            className={styles.signInButton}
            onClick={goToLogin}
          >
            Sign In
          </button>

          <button
            className={styles.createButton}
            onClick={goToRegister}
          >
            Create a FormBot
          </button>
        </div>
      </header>

      {/* Main */}
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heromain}>
            <img
              src={IMG1}
              className={styles.logoIMG}
              alt="Chatbot preview left"
            />
          </div>

          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Build advanced chatbots
              <br />
              visually
            </h1>

            <p className={styles.heroSubtitle}>
              FormBot gives you powerful blocks to create unique chat
              experiences. Embed them anywhere on your web or mobile
              apps and start collecting responses like magic.
            </p>

            <button
              className={styles.ctaButton}
              onClick={goToRegister}
            >
              Create a FormBot for free
            </button>
          </div>

          <div className={styles.heromain}>
            <img
              src={IMG2}
              className={styles.logoIMG}
              alt="Chatbot preview right"
            />
          </div>
        </section>

        {/* Product Preview */}
        <section className={styles.previewSection}>
          <div className={styles.heroImage}>
            <img
              src={app}
              alt="FormBot Builder Preview"
              className={styles.builderPreview}
            />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <span className={styles.logoIcon}>
              <img src={logo} alt="FormBot logo" />
            </span>
            <span className={styles.footerLogoText}>FormBot</span>
          </div>

          <p className={styles.footerTagline}>
            Made with ❤️ by Roshan
          </p>

          <div className={styles.footerLinks}>
            {footerSections.map((section) => (
              <div
                key={section.title}
                className={styles.footerLinkSection}
              >
                <h3 className={styles.footerLinkTitle}>
                  {section.title}
                </h3>

                {section.links.map((link) => (
                  <a
                    key={link}
                    href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                    className={styles.footerLink}
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;