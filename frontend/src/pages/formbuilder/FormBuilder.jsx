import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import styles from "./Formbuilder.module.css";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LanguageContext";
import Navbar from "../../components/navbar/Navbar";
import Rating from "../../components/rating/Rating";
import Sidebar from "../../components/sidebar/Sidebar";
import deleteIcon from "../../assets/delete.png";
import API from "../../services/api";

export default function FormBuilder() {
  const [formName, setFormName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState("classic");
  const [formFields, setFormFields] = useState([]);
  const [sharedFormId, setSharedFormId] = useState(null);
  const [isFormSaved, setIsFormSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const { t } = useLang();
  const userId = user?.userId;
  const { formId } = useParams();

  const activeTab = location.pathname.startsWith("/response") ? "response" : "flow";

  const addField = (type, category) => {
    const newField = {
      id: Date.now(),
      type,
      category,
      label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      value: type === "rating" ? 0 : "",
      url: ["image", "video", "gif"].includes(type) ? "" : undefined,
      required: false,
      placeholder: "",
      options: type === "buttons" ? ["Option 1", "Option 2"] : [],
      validation: {
        min: type === "number" ? 0 : null,
        max: type === "number" ? 100 : null,
      },
    };

    setFormFields((prev) => [...prev, newField]);
  };

  const updateField = (id, value, key = "value") => {
    setFormFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const removeField = (id) => {
    setFormFields((prev) => prev.filter((field) => field.id !== id));
  };

  const updateOption = (fieldId, index, value) => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) return field;
        const options = [...field.options];
        options[index] = value;
        return { ...field, options };
      })
    );
  };

  const addOption = (fieldId) => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) return field;
        return {
          ...field,
          options: [...field.options, `Option ${field.options.length + 1}`],
        };
      })
    );
  };

  const removeOption = (fieldId, index) => {
    setFormFields((prev) =>
      prev.map((field) => {
        if (field.id !== fieldId) return field;
        const options = field.options.filter((_, i) => i !== index);
        return { ...field, options };
      })
    );
  };

  const handleSubmit = async () => {
    setSaveError("");
    setSaving(true);

    try {
      const payload = {
        form_name: formName || t.untitledForm,
        fields: formFields,
        darkMode,
        theme,
      };

      const { data } = sharedFormId
        ? await API.put(`/forms/${sharedFormId}`, payload)
        : await API.post("/forms", payload);

      const savedId = data._id || data.form?._id;

      setSharedFormId(savedId);
      setIsFormSaved(true);

      return savedId;
    } catch (error) {
      setSaveError(
        error.response?.data?.message ||
          error.message ||
          t.errorSavingForm
      );
    } finally {
      setSaving(false);
    }
  };

  const copyFormLink = async () => {
    const formLink = `${window.location.origin}/publish/${
      sharedFormId || formId
    }`;

    try {
      await navigator.clipboard.writeText(formLink);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      setSaveError(t.errorCopyingLink);
    }
  };

  useEffect(() => {
    const fetchFormData = async () => {
      if (!userId || !token || !formId) return;

      try {
        const { data } = await API.get(`/forms/${formId}`);
        const formData = data.form || data;

        setFormName(formData.form_name || "");
        setFormFields(formData.fields || []);
        setSharedFormId(formData._id || formId);
        setDarkMode(formData.darkMode || false);
        setTheme(formData.theme || "classic");
      } catch {
        navigate("/forms");
      }
    };

    fetchFormData();
  }, [formId, userId, token]);

  const THEMES = [
    { id: "classic", name: t.classicTheme, color: "#3b82f6" },
    { id: "warm",    name: t.warmTheme,    color: "#f97316" },
    { id: "minimal", name: t.minimalTheme, color: "#10b981" },
  ];

  const renderThemePreview = (field, accentColor) => {
    const max = field.validation?.max || 5;

    if (field.type === "rating") {
      return (
        <div className={styles.ratingStateWrap}>
          <Rating value={3} max={max} disabled activeColor={accentColor} />
          <div className={styles.sendBtn} style={{ background: accentColor }}>▶</div>
        </div>
      );
    }

    if (field.type === "buttons") {
      return (
        <div className={styles.stateCellBtns}>
          {(field.options || []).slice(0, 2).map((opt, i) => (
            <div
              key={i}
              className={styles.stateOptionBtn}
              style={i === 0 ? { background: accentColor, borderColor: accentColor, color: "white" } : {}}
            >
              {opt}
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={styles.stateCell}>
        <input
          readOnly
          placeholder={field.placeholder || `Enter ${field.type}`}
          className={styles.previewInput}
          style={{ "--preview-focus": accentColor }}
        />
        <div className={styles.sendBtn} style={{ background: accentColor }}>▶</div>
      </div>
    );
  };

  const renderBubbleEdit = (field) => {
    if (["image", "video", "gif"].includes(field.type)) {
      return (
        <>
          <input
            type="text"
            className={styles.bubbleEditInput}
            value={field.url || ""}
            placeholder={`Paste ${field.type} URL...`}
            onChange={(e) => updateField(field.id, e.target.value, "url")}
          />
          {field.url && (
            field.type === "video"
              ? <video src={field.url} className={styles.mediaThumbnail} />
              : <img src={field.url} alt="preview" className={styles.mediaThumbnail} />
          )}
        </>
      );
    }
    return (
      <input
        type="text"
        className={styles.bubbleEditInput}
        value={field.value || ""}
        placeholder={t.typeBubbleMessage}
        onChange={(e) => updateField(field.id, e.target.value)}
      />
    );
  };

  const renderLabelSettings = (field) => {
    if (field.type === "buttons") {
      return (
        <div className={styles.buttonEditor}>
          {(field.options || []).map((opt, i) => (
            <div key={`${field.id}-opt-${i}`} className={styles.buttonEditorRow}>
              <input
                type="text"
                className={styles.buttonOptionInput}
                value={opt}
                placeholder={`Option ${i + 1}`}
                onChange={(e) => updateOption(field.id, i, e.target.value)}
              />
              <button
                type="button"
                className={styles.removeOptionButton}
                onClick={() => removeOption(field.id, i)}
                disabled={field.options.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addOptionButton}
            onClick={() => addOption(field.id)}
          >
            {t.addOption}
          </button>
        </div>
      );
    }
    if (field.type === "rating") {
      return (
        <input
          type="number"
          className={styles.settingInput}
          min={2}
          max={10}
          value={field.validation?.max || 5}
          placeholder={t.maxStars}
          onChange={(e) =>
            updateField(field.id, { ...field.validation, max: Number(e.target.value) }, "validation")
          }
        />
      );
    }
    if (field.category === "input") {
      return (
        <input
          className={styles.settingInput}
          value={field.placeholder || ""}
          placeholder={t.placeholderText}
          onChange={(e) => updateField(field.id, e.target.value, "placeholder")}
        />
      );
    }
    return null;
  };

  return (
    <div className={styles.formBuilder}>
      <Navbar
        showFormName
        formName={formName}
        onNameChange={setFormName}
        showFlow
        showResponse={!!formId}
        activeTab={activeTab}
        onFlowClick={() => navigate(`/formbuilder/${formId || ""}`)}
        onResponseClick={() => formId && navigate(`/response/${formId}`)}
        showShare={!!(sharedFormId || formId)}
        onShare={copyFormLink}
        shareLabel={isCopied ? t.copied : t.share}
        showSave
        onSave={handleSubmit}
        saveDisabled={saving}
        showClose
      />

      <div className={styles.mainContent}>
        <div className={styles.formCanvas}>
          {saveError && <p className={styles.saveError}>{saveError}</p>}
          {saving && <p className={styles.savingMsg}>{t.saving}</p>}

          <h2 className={styles.formStart}>{formName || t.untitledForm}</h2>

          {formFields.length ? (
            <div className={styles.statesWrapper}>
              {/* Title */}
              <div className={styles.statesTitleRow}>
                <div />
                <div className={styles.statesTitleCell}>{t.statesTitle}</div>
                <div />
              </div>

              {/* Theme column headers — click to select */}
              <div className={styles.statesHeader}>
                <div />
                {THEMES.map((t) => (
                  <div
                    key={t.id}
                    className={`${styles.themeHeaderCell} ${theme === t.id ? styles.themeHeaderSelected : ""}`}
                    style={theme === t.id ? { borderBottomColor: t.color, color: t.color } : {}}
                    onClick={() => setTheme(t.id)}
                  >
                    <span className={styles.themeColorDot} style={{ background: t.color }} />
                    {t.name}
                    {theme === t.id && <span className={styles.themeCheck}>✓</span>}
                  </div>
                ))}
                <div />
              </div>

              {/* Field rows */}
              {formFields.map((field) => (
                <div key={field.id} className={styles.fieldStateRow}>
                  {/* Label + settings */}
                  <div className={styles.fieldLabelCol}>
                    <input
                      className={styles.labelInput}
                      value={field.label || ""}
                      placeholder={t.fieldLabelPlaceholder}
                      onChange={(e) => updateField(field.id, e.target.value, "label")}
                    />
                    <span className={styles.fieldTypeBadge}>
                      {field.category === "bubble" && field.type === "text" ? "message" : field.type}
                    </span>
                    {renderLabelSettings(field)}
                  </div>

                  {/* Theme preview columns or bubble edit */}
                  {field.category === "bubble" ? (
                    <div className={styles.bubbleEditCell}>
                      {renderBubbleEdit(field)}
                    </div>
                  ) : (
                    THEMES.map((t) => (
                      <div
                        key={t.id}
                        className={`${styles.themePreviewCell} ${theme === t.id ? styles.themePreviewSelected : ""}`}
                        style={theme === t.id ? { "--sel-color": t.color } : {}}
                        onClick={() => setTheme(t.id)}
                      >
                        {renderThemePreview(field, t.color)}
                      </div>
                    ))
                  )}

                  {/* Delete */}
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeField(field.id)}
                    aria-label="Remove field"
                  >
                    <img src={deleteIcon} alt="delete" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              {t.noFieldsAdded}
            </div>
          )}
        </div>
      </div>

      <Sidebar addField={addField} />
    </div>
  );
}