import React from 'react';
import styles from './Rating.module.css';

const Rating = ({ value = 0, onChange = () => {}, max = 5, disabled = false }) => {
  return (
    <div className={styles.ratingContainer}>
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;
        
        return (
          <button
            key={ratingValue}
            type="button"
            className={`${styles.ratingCircle} ${
              ratingValue <= Number(value) ? styles.active : ''
            }`}
            onClick={() => !disabled && onChange(ratingValue)}
            disabled={disabled}
            aria-label={`Rate ${ratingValue} out of ${max}`}
          >
            <div className={styles.innerCircle}>
              {ratingValue}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default Rating;