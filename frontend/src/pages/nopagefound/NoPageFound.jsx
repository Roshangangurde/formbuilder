import { Link } from "react-router-dom";
import styles from "./NoPageFound.module.css";

const NoPageFound = () => {
  return (
    <main className={styles.container}>
      <div className={styles.content}>
        <p className={styles.badge}>🚫 Route Error</p>

        <h1 className={styles.title}>404</h1>

        <h2 className={styles.subtitle}>
          Oops! This page doesn&apos;t exist
        </h2>

        <p className={styles.description}>
          The page you are looking for may have been moved,
          deleted, or the URL may be incorrect.
        </p>

        <Link
          to="/"
          className={styles.homeLink}
          aria-label="Go back to homepage"
        >
          ← Go Back Home
        </Link>
      </div>
    </main>
  );
};

export default NoPageFound;