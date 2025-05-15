import { useEffect, useState } from 'react';
import API from '../../services/api';
import styles from './response.module.css';
import { useParams } from 'react-router-dom';
import ViewCount from '../../components/view/ViewCount';
import StartCount from '../../components/start/StartCount';
import CompletionRate from '../../components/completion/CompletionRate';

const ResponsePage = () => {
  const { formId } = useParams();
  const [starts, setStarts] = useState(0);
  const [responses, setResponses] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formId) return;

    const fetchData = async () => {
      try {
        const formRes = await API.get(`/forms/${formId}`);
        const form = formRes.data;
        const fields = form.fields || [];

        setStarts(form.starts || 0);

        const res = await API.get(`/forms/${formId}/responses`);
        const completedResponses = res.data.filter(r => r.status === 'completed');

        const processedResponses = completedResponses.map(response => {
          const responseObj = {
            id: response._id,
            timestamp: response.timestamp,
          };

          if (Array.isArray(response.responses)) {
            response.responses.forEach((resp, index) => {
              let value;
              if (resp && typeof resp === 'object') {
                value = resp.value ?? resp.url ?? resp.text ?? JSON.stringify(resp);
              } else {
                value = resp;
              }

              const fieldId = resp?.fieldId || (fields[index]?.id || `field_${index}`);
              responseObj[fieldId] = value;
            });
          }

          return responseObj;
        });

        const responseHeaders = fields.map(field => ({
          id: field.id,
          label: field.label || `${field.type} Field`,
        }));

        setHeaders(responseHeaders);
        setResponses(processedResponses);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load response data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  const completedCount = responses.length;

  if (loading) return <div className={styles.loading}>Loading responses...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (completedCount === 0) return <div className={styles.empty}>No completed responses found</div>;

  return (
    <>
      <div className={styles.mainDisplay}>
        <ViewCount formId={formId} />
        <StartCount formId={formId} />
      </div>

      <div className={styles.container}>
        <div className={styles.tableWrapper}>
          <table className={styles.responseTable}>
            <thead>
              <tr>
                <th>Timestamp</th>
                {headers.map((header, index) => (
                  <th key={index}>{header.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((response, rowIndex) => (
                <tr key={rowIndex}>
                  <td>{new Date(response.timestamp).toLocaleString()}</td>
                  {headers.map((header, colIndex) => {
                    const value = response[header.id];
                    const displayValue = value === undefined || value === null
                      ? '(empty)'
                      : typeof value === 'object'
                        ? JSON.stringify(value)
                        : String(value);
                    return <td key={colIndex}>{displayValue}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CompletionRate starts={starts} completedCount={completedCount} />
    </>
  );
};

export default ResponsePage;
