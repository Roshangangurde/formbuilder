import { useParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import API from "../../services/api";
import styles from "./PublishForm.module.css";
import Rating from "../../components/rating/Rating";
import { UI_STRINGS } from "../../config/languages";
import { useLang } from "../../context/LanguageContext";

const CACHE_PREFIX = "formtranslation_";

const PublishForm = () => {
  const { formId } = useParams();
  const { lang: globalLang } = useLang();

  const [form, setForm] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldError, setFieldError] = useState("");

  // Language state — synced with global lang
  const [selectedLang, setSelectedLang] = useState(globalLang);
  const [translatedFields, setTranslatedFields] = useState(null);
  const [translatedUI, setTranslatedUI] = useState(UI_STRINGS);
  const [translating, setTranslating] = useState(false);

  // Keep selectedLang in sync when global lang changes
  useEffect(() => { setSelectedLang(globalLang); }, [globalLang]);

  const hasStarted = useRef(false);
  const messageEndRef = useRef(null);
  const submittingRef = useRef(false);
  const responsesRef = useRef({});

  /* auto scroll */
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentIndex, responses]);

  /* fetch form */
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const { data } = await API.get(`/forms/${formId}/public`);
        setForm(data.form || data);
        API.post(`/forms/${formId}/increment-view`).catch(() => {});
      } catch (error) {
        console.error("Failed to fetch form:", error);
      }
    };
    fetchForm();
  }, [formId]);

  /* translate when language changes */
  useEffect(() => {
    if (!form || selectedLang === "en") {
      setTranslatedFields(null);
      setTranslatedUI(UI_STRINGS);
      return;
    }

    const cacheKey = `${CACHE_PREFIX}${formId}_${selectedLang}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const { fields, ui } = JSON.parse(cached);
        setTranslatedFields(fields);
        setTranslatedUI(ui);
        return;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    let cancelled = false;
    const translate = async () => {
      setTranslating(true);
      try {
        // Collect all unique strings to translate
        const fieldTexts = [];
        const fieldMap = []; // { fieldIndex, key, optionIndex? }

        form.fields.forEach((field, fi) => {
          fieldMap.push({ fi, key: "label" });
          fieldTexts.push(field.label || "");

          if (field.placeholder) {
            fieldMap.push({ fi, key: "placeholder" });
            fieldTexts.push(field.placeholder);
          }

          if (field.type === "text" && field.category === "bubble" && field.value) {
            fieldMap.push({ fi, key: "value" });
            fieldTexts.push(field.value);
          }

          if (field.type === "buttons" && Array.isArray(field.options)) {
            field.options.forEach((opt, oi) => {
              fieldMap.push({ fi, key: "option", oi });
              fieldTexts.push(opt);
            });
          }
        });

        const uiValues = Object.values(UI_STRINGS);
        const allTexts = [...fieldTexts, ...uiValues];

        const { data } = await API.post("/translate", {
          texts: allTexts,
          target: selectedLang,
        });

        const translated = data.translations;
        const fieldTranslations = translated.slice(0, fieldTexts.length);
        const uiTranslations = translated.slice(fieldTexts.length);

        // Rebuild fields with translated strings
        const newFields = form.fields.map((field, fi) => ({ ...field }));
        fieldMap.forEach(({ fi, key, oi }, idx) => {
          if (key === "option") {
            if (!newFields[fi]._translatedOptions)
              newFields[fi]._translatedOptions = [...newFields[fi].options];
            newFields[fi]._translatedOptions[oi] = fieldTranslations[idx];
          } else {
            newFields[fi][`_translated_${key}`] = fieldTranslations[idx];
          }
        });

        // Rebuild UI strings
        const uiKeys = Object.keys(UI_STRINGS);
        const newUI = {};
        uiKeys.forEach((k, i) => {
          newUI[k] = uiTranslations[i] || UI_STRINGS[k];
        });

        if (!cancelled) {
          localStorage.setItem(cacheKey, JSON.stringify({ fields: newFields, ui: newUI }));
          setTranslatedFields(newFields);
          setTranslatedUI(newUI);
        }
      } catch (err) {
        if (!cancelled) console.error("Translation error:", err);
      } finally {
        if (!cancelled) setTranslating(false);
      }
    };

    translate();
    return () => { cancelled = true; };
  }, [form, selectedLang, formId]);

  /* helpers to get display values */
  const displayFields = selectedLang === "en" || !translatedFields
    ? form?.fields
    : translatedFields;

  const getLabel = (field) =>
    field._translated_label || field.label;

  const getPlaceholder = (field) =>
    field._translated_placeholder || field.placeholder || translatedUI.typeAnswer;

  const getBubbleValue = (field) =>
    field._translated_value || field.value;

  const getOptions = (field) =>
    field._translatedOptions || field.options || [];

  /* submit */
  const handleSubmit = useCallback(
    async (finalResponses) => {
      if (submittingRef.current) return;
      submittingRef.current = true;
      setSubmitting(true);
      try {
        const formattedResponses = Object.entries(finalResponses).map(
          ([fieldId, value]) => ({ fieldId, value })
        );
        await API.post(`/forms/${formId}/submit`, { responses: formattedResponses });
        setCompleted(true);
      } catch (err) {
        console.error("Submit failed", err);
        setSubmitError(translatedUI.errorSubmittingForm || "Failed to submit form. Please try again.");
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [formId]
  );

  const moveNext = useCallback(
    (updatedResponses) => {
      if (!form) return;
      if (currentIndex < form.fields.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        handleSubmit(updatedResponses);
      }
    },
    [form, currentIndex, handleSubmit]
  );

  /* keep responsesRef in sync */
  useEffect(() => {
    responsesRef.current = responses;
  }, [responses]);

  /* field init — auto-advance bubbles */
  useEffect(() => {
    if (!form?.fields?.[currentIndex]) return;
    const field = form.fields[currentIndex];
    setInputValue(field.type === "rating" ? 0 : "");

    if (field.category === "bubble") {
      const timer = setTimeout(() => {
        const bubbleValue = field.url || field.value || field.label || "";
        const updated = { ...responsesRef.current, [field.id]: bubbleValue };
        setResponses(updated);
        moveNext(updated);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [form, currentIndex, moveNext]);

  const handleNext = () => {
    const field = form?.fields[currentIndex];
    if (!field) return;

    if (!hasStarted.current) {
      API.post(`/forms/${formId}/increment-start`).catch(() => {});
      hasStarted.current = true;
    }

    let updatedResponses = responses;

    if (field.category === "input") {
      const value = field.type === "rating" ? Number(inputValue) : inputValue;
      if (field.required && (!value || value.toString().trim() === "")) {
        setFieldError(translatedUI.fillOutField || "Please fill out this field");
        return;
      }
      setFieldError("");
      updatedResponses = { ...responses, [field.id]: value };
      setResponses(updatedResponses);
      responsesRef.current = updatedResponses;
    }

    moveNext(updatedResponses);
  };

  if (!form) {
    return <div className={styles.loading}>{translatedUI.loadingForm}</div>;
  }

  if (completed) {
    return (
      <div className={styles.successScreen}>{translatedUI.formSubmitted}</div>
    );
  }

  const currentField = form.fields[currentIndex];
  const currentDisplayField = displayFields?.[currentIndex];

  const renderBubbleContent = (field, displayField) => {
    if (field.type === "image" || field.type === "gif") {
      return (
        <img
          src={field.url || field.value}
          alt={field.label || "Preview"}
          className={styles.imagePreview}
        />
      );
    }
    if (field.type === "video") {
      return (
        <video src={field.url || field.value} controls className={styles.videoPreview} />
      );
    }
    return getBubbleValue(displayField || field) || getLabel(displayField || field);
  };

  const themeClass = form.theme === "warm"
    ? styles.themeWarm
    : form.theme === "minimal"
      ? styles.themeMinimal
      : "";

  return (
    <div className={`${styles.chatContainer} ${themeClass}`}>
      {translating && (
        <div className={styles.langBar}>
          <span className={styles.translatingBadge}>{translatedUI.translating}</span>
        </div>
      )}

      <div className={styles.messages}>
        {form.fields.slice(0, currentIndex + 1).map((field, index) => {
          const dispField = displayFields?.[index] || field;

          if (field.category === "bubble") {
            return (
              <div key={field.id} className={styles.bot}>
                {renderBubbleContent(field, dispField)}
              </div>
            );
          }

          return index < currentIndex ? (
            <div key={field.id} className={styles.user}>
              {String(responses[field.id] ?? "")}
            </div>
          ) : null;
        })}
        <div ref={messageEndRef} />
      </div>

      {(fieldError || submitError) && (
        <div className={styles.errorBanner}>{fieldError || submitError}</div>
      )}

      {currentField?.category === "input" &&
        currentField?.type !== "buttons" &&
        currentField?.type !== "rating" && (
          <div className={styles.inputBox}>
            <input
              className={styles.inputField}
              type={currentField.type === "phone" ? "tel" : currentField.type}
              placeholder={getPlaceholder(currentDisplayField || currentField)}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNext()}
              autoFocus
            />
            <button
              className={styles.sendButton}
              onClick={handleNext}
              disabled={submitting}
            >
              {submitting ? translatedUI.submitting : translatedUI.next}
            </button>
          </div>
        )}

      {currentField?.type === "buttons" && (
        <div className={styles.inputBox}>
          {getOptions(currentDisplayField || currentField).map((opt, i) => (
            <button
              key={`${currentField.id}-${i}`}
              className={styles.sendButton}
              disabled={submitting}
              onClick={() => {
                const updatedResponses = { ...responses, [currentField.id]: opt };
                setInputValue(opt);
                setResponses(updatedResponses);
                moveNext(updatedResponses);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {currentField?.type === "rating" && (
        <div className={styles.ratingBox}>
          <Rating
            value={Number(inputValue)}
            onChange={(val) => setInputValue(Number(val))}
            max={currentField.validation?.max || 5}
          />
          <button
            className={styles.sendButton}
            style={{ width: "100%", maxWidth: 280 }}
            onClick={handleNext}
            disabled={submitting}
          >
            {submitting ? translatedUI.submitting : translatedUI.submitRating}
          </button>
        </div>
      )}
    </div>
  );
};

export default PublishForm;
