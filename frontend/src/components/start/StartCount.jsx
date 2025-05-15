import { useEffect, useState } from 'react';
import API from '../../services/api';
import styles from '../view/counter.module.css';

const StartCount = ({ formId }) => {
  const [starts, setStarts] = useState(0);

  useEffect(() => {
    if (!formId) return;

    API.get(`/forms/${formId}`)
      .then(res => setStarts(res.data.starts || 0))
      .catch(err => console.error('Fetch starts error:', err));
  }, [formId]);

  return (
    <div className={styles.statBox}>
      <p>Starts</p>
      <p>{starts}</p>
    </div>
  );
};

export default StartCount;
