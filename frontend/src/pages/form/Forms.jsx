import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";
import styles from "./Forms.module.css";
import Navbar from "../../components/navbar/Navbar";
import ShareModal from "../../components/sharemodal/ShareModal";
import deleteIcon from "../../assets/delete.png";

const Forms = () => {
  const { t } = useLang();
  const [forms, setForms] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [folderLoading, setFolderLoading] = useState(false);
  const [dragOverFolderId, setDragOverFolderId] = useState(null);
  const [shareTarget, setShareTarget] = useState(null);

  const dragFormId = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    const fetchFormsAndFolders = async () => {
      setLoading(true);
      try {
        const [formsResult, foldersResult] = await Promise.allSettled([
          API.get("/forms"),
          API.get("/folders"),
        ]);
        if (formsResult.status === "fulfilled") {
          setForms(Array.isArray(formsResult.value.data) ? formsResult.value.data : []);
        }
        if (foldersResult.status === "fulfilled") {
          setFolders(Array.isArray(foldersResult.value.data) ? foldersResult.value.data : []);
        }
        if (formsResult.status === "rejected" && foldersResult.status === "rejected") {
          setError(t.errorLoadingForms);
        }
      } catch {
        setError(t.errorLoadingForms);
      } finally {
        setLoading(false);
      }
    };
    fetchFormsAndFolders();
  }, [user]);

  const createFolder = async (e) => {
    e.preventDefault();
    const folderName = newFolderName.trim();
    if (!folderName) return;
    setFolderLoading(true);
    try {
      const response = await API.post("/folders", { name: folderName });
      setFolders((prev) => [...prev, response.data]);
      setNewFolderName("");
      setShowFolderInput(false);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          t.errorCreatingFolder
      );
    } finally {
      setFolderLoading(false);
    }
  };

  const deleteFolder = async (folderId, folderName) => {
    if (!window.confirm(`Delete folder "${folderName}"? This cannot be undone.`))
      return;
    try {
      await API.delete(`/folders/${folderId}`);
      setFolders((prev) => prev.filter((f) => f._id !== folderId));
      setError("");
    } catch {
      setError(t.errorDeletingFolder);
    }
  };

  const deleteForm = async (formId, formName) => {
    if (!window.confirm(`Delete form "${formName}"? This cannot be undone.`))
      return;
    try {
      await API.delete(`/forms/${formId}`);
      setForms((prev) => prev.filter((f) => f._id !== formId));
      setError("");
    } catch {
      setError(t.errorDeletingForm);
    }
  };

  /* drag-and-drop handlers */
  const handleDragStart = (e, formId) => {
    dragFormId.current = formId;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    dragFormId.current = null;
    setDragOverFolderId(null);
  };

  const handleDragOver = (e, folderId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverFolderId(folderId);
  };

  const handleDragLeave = () => {
    setDragOverFolderId(null);
  };

  const handleDrop = async (e, folderId) => {
    e.preventDefault();
    setDragOverFolderId(null);
    const formId = dragFormId.current;
    if (!formId) return;

    try {
      await API.put(`/forms/${formId}`, { folder: folderId });
      setForms((prev) => prev.filter((f) => f._id !== formId));
    } catch {
      setError(t.errorMovingForm);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar showWorkspaceDropdown showClose={false} />

      {shareTarget && (
        <ShareModal
          formId={shareTarget.id}
          formName={shareTarget.name}
          onClose={() => setShareTarget(null)}
        />
      )}

      <div className={styles.formsContainer}>
        {error && (
          <p className={styles.errorBanner} onClick={() => setError("")}>
            {error} <span>✕</span>
          </p>
        )}

        {loading ? (
          <div className={styles.loadingState}>{t.loadingForms}</div>
        ) : (
          <>
            <div className={styles.actions}>
              {showFolderInput ? (
                <form onSubmit={createFolder} className={styles.folderInputRow}>
                  <input
                    type="text"
                    className={styles.folderInput}
                    placeholder={t.folderNamePlaceholder}
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className={styles.createFolderButton}
                    disabled={folderLoading}
                  >
                    {folderLoading ? t.creating : t.create}
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setShowFolderInput(false);
                      setNewFolderName("");
                    }}
                  >
                    {t.cancel}
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowFolderInput(true)}
                  className={styles.createFolderButton}
                >
                  + {t.newFolder}
                </button>
              )}

              <button
                onClick={() => navigate("/formbuilder")}
                className={styles.createFormButton}
              >
                + {t.createForm}
              </button>
            </div>

            {folders.length > 0 && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>{t.yourFolders}</h3>
                <div className={styles.flexContainer}>
                  {folders.map((folder) => (
                    <div
                      key={folder._id}
                      className={`${styles.folderCard} ${
                        dragOverFolderId === folder._id ? styles.folderDropTarget : ""
                      }`}
                      onDragOver={(e) => handleDragOver(e, folder._id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, folder._id)}
                    >
                      <button
                        className={styles.folderNameButton}
                        onClick={() => navigate(`/folder/${folder._id}`)}
                      >
                        {folder.name}
                      </button>
                      <button
                        className={styles.deleteButton}
                        aria-label={`Delete folder ${folder.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFolder(folder._id, folder.name);
                        }}
                      >
                        <img src={deleteIcon} alt="delete" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {forms.length > 0 ? (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  {t.yourForms}
                  <span className={styles.dragHint}>{t.dragFormHint}</span>
                </h3>
                <div className={styles.flexContainer}>
                  {forms.map((form) => (
                    <div
                      key={form._id}
                      className={styles.formCard}
                      draggable
                      onDragStart={(e) => handleDragStart(e, form._id)}
                      onDragEnd={handleDragEnd}
                    >
                      <p
                        className={styles.formName}
                        onClick={() => navigate(`/formbuilder/${form._id}`)}
                      >
                        {form.form_name}
                      </p>
                      <div className={styles.cardActions}>
                        <button
                          className={styles.responsesButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/response/${form._id}`);
                          }}
                        >
                          {t.viewResponses}
                        </button>
                        <button
                          className={styles.shareCardButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShareTarget({ id: form._id, name: form.form_name });
                          }}
                          aria-label={`Share form ${form.form_name}`}
                        >
                          {t.shareForm}
                        </button>
                        <button
                          className={styles.deleteButton}
                          aria-label={`Delete form ${form.form_name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteForm(form._id, form.form_name);
                          }}
                        >
                          <img src={deleteIcon} alt="delete" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              !error && (
                <div className={styles.emptyState}>
                  <p>{t.noForms}</p>
                  <button
                    onClick={() => navigate("/formbuilder")}
                    className={styles.createFormButton}
                  >
                    + {t.createForm}
                  </button>
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Forms;
