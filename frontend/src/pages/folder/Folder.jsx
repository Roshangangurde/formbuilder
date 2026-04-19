import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import Navbar from "../../components/navbar/Navbar";
import styles from "./Folder.module.css";

const Folder = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();

  const [folder, setFolder] = useState(null);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFolder = async () => {
      setLoading(true);

      try {
        const response = await API.get(`/folders/${folderId}`);

        setFolder(response.data);
        setForms(Array.isArray(response.data.forms) ? response.data.forms : []);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load folder");
      } finally {
        setLoading(false);
      }
    };

    fetchFolder();
  }, [folderId]);

  const openForm = (formId) => {
    navigate(`/formbuilder/${formId}`);
  };

  if (loading) {
    return (
      <>
        <Navbar showWorkspaceDropdown={true} showClose={true} />
        <div className={styles.loadingState}>Loading folder...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar showWorkspaceDropdown={true} showClose={true} />
        <div className={styles.errorState}>{error}</div>
      </>
    );
  }

  return (
    <>
      <Navbar showWorkspaceDropdown={true} showClose={true} />

      <div className={styles.folderContainer}>
        <div className={styles.header}>
          <h1>{folder?.name}</h1>
          <button
            className={styles.backButton}
            onClick={() => navigate("/forms")}
          >
            ← Back to Forms
          </button>
        </div>

        {forms.length > 0 ? (
          <div className={styles.flexContainer}>
            {forms.map((form) => (
              <div
                key={form._id}
                className={styles.formCard}
                onClick={() => openForm(form._id)}
              >
                <p className={styles.formName}>{form.form_name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No forms inside this folder yet.</p>
            <button
              className={styles.createButton}
              onClick={() => navigate("/formbuilder")}
            >
              + Create New Form
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Folder;