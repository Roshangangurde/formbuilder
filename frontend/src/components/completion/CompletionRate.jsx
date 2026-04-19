import PropTypes from "prop-types";
import { PieChart } from "react-minimal-pie-chart";
import styles from "./ccounter.module.css";

const CompletionRate = ({ starts = 0, completedCount = 0 }) => {
  const safeCompleted = Math.max(completedCount, 0);
  // If starts tracking wasn't active for older forms, fall back to completedCount
  const effectiveStarts = Math.max(starts, safeCompleted);

  const uncompletedCount = Math.max(effectiveStarts - safeCompleted, 0);

  const completionRate =
    effectiveStarts > 0
      ? Math.min(100, Math.round((safeCompleted / effectiveStarts) * 100))
      : 0;

  const hasData = effectiveStarts > 0;

  const chartData = hasData
    ? [
        {
          title: "Completed",
          value: safeCompleted || 0.001,
          color: "#3b82f6",
        },
        ...(uncompletedCount > 0
          ? [{ title: "Remaining", value: uncompletedCount, color: "#374151" }]
          : []),
      ]
    : [{ title: "No Data", value: 1, color: "#374151" }];

  return (
    <div className={styles.container}>
      <div className={styles.chartWrapper}>
        <PieChart
          data={chartData}
          lineWidth={28}
          rounded
          animate
          label={({ dataEntry }) =>
            dataEntry.percentage > 10
              ? `${Math.round(dataEntry.percentage)}%`
              : ""
          }
          labelStyle={{
            fontSize: "6px",
            fill: "#fff",
            fontWeight: 600,
          }}
          radius={42}
          style={{ height: "200px", width: "200px" }}
        />
      </div>

      <div className={styles.statBox}>
        <p className={styles.title}>Completion Rate</p>

        <p className={styles.rate}>
          {hasData ? `${completionRate}%` : "—"}
        </p>

        <div className={styles.legend}>
          <span className={styles.completed}>
            ● Completed: {safeCompleted}
          </span>
          {hasData && (
            <span className={styles.remaining}>
              ● Started: {effectiveStarts}
            </span>
          )}
          {!hasData && (
            <span className={styles.remaining}>
              No start data yet
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

CompletionRate.propTypes = {
  starts: PropTypes.number,
  completedCount: PropTypes.number,
};

export default CompletionRate;
