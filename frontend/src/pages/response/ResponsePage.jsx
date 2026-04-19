import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useLang } from "../../context/LanguageContext";
import styles from "./Response.module.css";
import Navbar from "../../components/navbar/Navbar";
import CompletionRate from "../../components/completion/CompletionRate";

const ResponsePage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();

  const [formName, setFormName] = useState("");
  const [views, setViews] = useState(0);
  const [starts, setStarts] = useState(0);
  const [responses, setResponses] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!formId) return;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const [formRes, responsesRes] = await Promise.all([
          API.get(`/forms/${formId}`),
          API.get(`/forms/${formId}/responses`),
        ]);

        const form = formRes.data.form || formRes.data;
        const fields = Array.isArray(form.fields) ? form.fields : [];

        setFormName(form.form_name || "Untitled Form");
        setViews(form.views || 0);
        setStarts(form.starts || 0);

        const inputFields = fields.filter((f) => f.category === "input");

        const completedResponses = Array.isArray(responsesRes.data)
          ? responsesRes.data.filter((r) => r.status === "completed")
          : [];

        const processedResponses = completedResponses.map((response) => {
          const row = { id: response._id, timestamp: response.timestamp };

          if (Array.isArray(response.responses)) {
            response.responses.forEach((resp) => {
              if (!resp) return;
              const fieldId =
                typeof resp === "object" ? resp.fieldId : null;
              const value =
                typeof resp === "object"
                  ? resp.value ?? resp.url ?? resp.text ?? ""
                  : resp;
              if (fieldId) row[fieldId] = value;
            });
          }

          return row;
        });

        const responseHeaders = inputFields.map((field, index) => ({
          id: field.id || `field_${index}`,
          label: field.label || `${field.type || "Text"} Field`,
        }));

        setHeaders(responseHeaders);
        setResponses(processedResponses);
      } catch (err) {
        console.error("Error fetching responses:", err);
        setError("Failed to load response data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [formId]);

  const completedCount = useMemo(() => responses.length, [responses]);
  const effectiveStarts = Math.max(starts, completedCount);

  const formatCellValue = (value) => {
    if (value === undefined || value === null || value === "") return "—";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <div className={styles.page}>
      <Navbar
        showFormName
        formName={formName}
        onNameChange={() => {}}
        showFlow
        showResponse={!!formId}
        activeTab="response"
        onFlowClick={() => formId && navigate(`/formbuilder/${formId}`)}
        onResponseClick={() => {}}
        showClose
      />

      <div className={styles.pageContent}>
        {loading ? (
          <div className={styles.loading}>Loading responses...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <>
            <div className={styles.mainDisplay}>
              <div className={styles.statBox}>
                <p className={styles.statLabel}>{t.viewsLabel}</p>
                <p className={styles.statValue}>{views}</p>
              </div>
              <div className={styles.statBox}>
                <p className={styles.statLabel}>{t.startsLabel}</p>
                <p className={styles.statValue}>{effectiveStarts}</p>
              </div>
              <div className={styles.statBox}>
                <p className={styles.statLabel}>{t.responses}</p>
                <p className={styles.statValue}>{completedCount}</p>
              </div>
            </div>

            {completedCount === 0 ? (
              <div className={styles.empty}>{t.noResponsesYet}</div>
            ) : (
              <div className={styles.container}>
                <div className={styles.tableWrapper}>
                  <table className={styles.responseTable}>
                    <thead>
                      <tr>
                        <th>{t.submittedAt}</th>
                        {headers.map((h) => (
                          <th key={h.id}>{h.label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {responses.map((response) => (
                        <tr key={response.id}>
                          <td>
                            {response.timestamp
                              ? new Date(response.timestamp).toLocaleString()
                              : "N/A"}
                          </td>
                          {headers.map((h) => (
                            <td key={h.id}>
                              {formatCellValue(response[h.id])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <CompletionRate
              starts={effectiveStarts}
              completedCount={completedCount}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ResponsePage;
