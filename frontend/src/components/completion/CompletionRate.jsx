import styles from './ccounter.module.css';
import { PieChart } from 'react-minimal-pie-chart';

const CompletionRate = ({ starts, completedCount, views }) => {
  
  const uncompletedCount = Math.max(starts - completedCount, 0);
  
  
  const completionRate = starts > 0 ? (completedCount / starts) * 100 : 0;

  return (
    <div className={styles.container}>
      <PieChart
        data={[
          { title: 'Completed', value: completedCount, color: '#3498db' },
          { title: 'Uncompleted', value: uncompletedCount, color: '#374151' },
        ]}
        lineWidth={30}
        label={({ dataEntry }) => ` ${Math.round(dataEntry.percentage)}`}
        labelStyle={{ fontSize: '5px', fill: '#fff' }}
        radius={40}
        style={{ height: '200px', width: '200px' }}
      />
      <div className={styles.statBox}>
        <p>Completion Rate</p>
        <p>{Math.round(completionRate)}%</p>
      </div>
    </div>
  );
};

export default CompletionRate;
