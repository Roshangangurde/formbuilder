import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import API from "../../services/api";
import styles from "../view/counter.module.css";

const StartCount = ({ formId }) => {
  const [starts, setStarts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchStarts = async () => {
      try {
        setLoading(true);

        const { data } = await API.get(
          `/forms/${formId}`
        );

        const form = data.form || data;

        if (isMounted) {
          setStarts(form.starts || 0);
        }
      } catch (error) {
        console.error(
          "Fetch starts error:",
          error
        );

        if (isMounted) {
          setStarts(0);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStarts();

    return () => {
      isMounted = false;
    };
  }, [formId]);

  return (
    <div className={styles.statBox}>
      <p className={styles.label}>Starts</p>
      <p className={styles.value}>
        {loading ? "..." : starts}
      </p>
    </div>
  );
};

StartCount.propTypes = {
  formId: PropTypes.string,
};

export default StartCount;