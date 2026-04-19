import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import API from "../../services/api";
import styles from "./counter.module.css";

const ViewCount = ({ formId }) => {
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formId) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const viewedKey = `form_${formId}_viewed`;

    const fetchViews = async () => {
      try {
        const { data } = await API.get(
          `/forms/${formId}`
        );

        const form = data.form || data;

        if (isMounted) {
          setViews(form.views || 0);
        }
      } catch (error) {
        console.error(
          "Fetch views error:",
          error
        );
      }
    };

    const incrementView = async () => {
      try {
        const { data } = await API.post(
          `/forms/${formId}/increment-view`
        );

        if (isMounted) {
          setViews(data.views || 0);
        }

        localStorage.setItem(viewedKey, "true");
      } catch (error) {
        console.error(
          "Error incrementing view:",
          error
        );

        fetchViews();
      }
    };

    const alreadyViewed =
      localStorage.getItem(viewedKey);

    const loadViews = async () => {
      setLoading(true);

      if (!alreadyViewed) {
        await incrementView();
      } else {
        await fetchViews();
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    loadViews();

    return () => {
      isMounted = false;
    };
  }, [formId]);

  return (
    <div className={styles.statBox}>
      <p className={styles.label}>Views</p>
      <p className={styles.value}>
        {loading ? "..." : views}
      </p>
    </div>
  );
};

ViewCount.propTypes = {
  formId: PropTypes.string,
};

export default ViewCount;