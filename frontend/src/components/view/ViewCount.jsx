import { useEffect, useState } from 'react';
import API from '../../services/api';
import styles from './counter.module.css';

const ViewCount = ({ formId }) => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (!formId) return;

    const viewedKey = `form_${formId}_viewed`;
    const alreadyViewed = localStorage.getItem(viewedKey);

    const incrementView = async () => {
      try {
        const res = await API.post(`/forms/${formId}/increment-view`);
        setViews(res.data.views || 0);
        localStorage.setItem(viewedKey, 'true');
      } catch (err) {
        console.error('Error incrementing view:', err);
      }
    };

    if (!alreadyViewed) {
      incrementView();
    } else {
      
      API.get(`/forms/${formId}`)
        .then(res => setViews(res.data.views || 0))
        .catch(err => console.error('Fetch views error:', err));
    }
  }, [formId]);

  return (
    <div className={styles.statBox}>
      <p>Views</p>
      <p>{views}</p>
    </div>
  );
};

export default ViewCount;
