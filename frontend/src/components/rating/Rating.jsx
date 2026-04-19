import PropTypes from "prop-types";
import styles from "./Rating.module.css";

const Rating = ({
  value = 0,
  onChange = () => {},
  max = 5,
  disabled = false,
  activeColor = null,
}) => {
  const safeValue = Number(value) || 0;
  const safeMax = Math.max(Number(max) || 5, 1);

  return (
    <div
      className={styles.ratingContainer}
      role="radiogroup"
      aria-label="Rating selector"
    >
      {Array.from({ length: safeMax }, (_, index) => {
        const ratingValue = index + 1;
        const isActive = ratingValue <= safeValue;
        const activeStyle = isActive && activeColor
          ? { background: activeColor, borderColor: activeColor }
          : {};

        return (
          <button
            key={ratingValue}
            type="button"
            className={`${styles.ratingCircle} ${isActive ? styles.active : ""}`}
            style={activeStyle}
            onClick={() => !disabled && onChange(ratingValue)}
            disabled={disabled}
            aria-label={`Rate ${ratingValue} out of ${safeMax}`}
            aria-checked={isActive}
            role="radio"
          >
            <span className={styles.innerCircle}>{ratingValue}</span>
          </button>
        );
      })}
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number,
  onChange: PropTypes.func,
  max: PropTypes.number,
  disabled: PropTypes.bool,
  activeColor: PropTypes.string,
};

export default Rating;