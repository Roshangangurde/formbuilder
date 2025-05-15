import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";
import styles from "./PublishForm.module.css";
import Rating from "../../components/rating/Rating";
import { useRef } from "react";

const PublishForm = () => {
  const { formId } = useParams();
  const [form, setForm] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [inputValue, setInputValue] = useState(null);
  const [hasAutoAdvanced, setHasAutoAdvanced] = useState(false);
  const hasStarted = useRef(false);

  // Fetch the form
  useEffect(() => {
    const fetchForm = async () => {
      try {
        const res = await API.get(`/forms/${formId}`);
        setForm(res.data);
      } catch (error) {
        console.error("Failed to fetch form:", error);
      }
    };
    fetchForm();
  }, [formId]);

  // Handle new field logic
  useEffect(() => {
    if (!form || !form.fields[currentIndex]) return;

    const currentField = form.fields[currentIndex];
    setHasAutoAdvanced(false); // reset flag

    // Reset inputValue based on field type
    if (currentField.type === "rating") {
      setInputValue(0); // Default to 0
    } else {
      setInputValue(""); // For text-based inputs
    }

    // Auto-advance for bubble fields
    if (currentField.category === "bubble") {
      const timer = setTimeout(() => {
        if (!responses[currentField.id] && !hasAutoAdvanced) {
          setResponses((prev) => ({
            ...prev,
            [currentField.id]: currentField.value || currentField.label
          }));
          setHasAutoAdvanced(true);
          setCurrentIndex((prev) => prev + 1);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [form, currentIndex]);

  const handleNext = () => {
    const field = form?.fields[currentIndex];
    if (!field) return;

    if (!hasStarted.current) {
      API.post(`/forms/${formId}/increment-start`);
      hasStarted.current = true;
    }

    // Input fields
    if (field.category === "input") {
      if (field.required && !inputValue?.toString().trim()) {
        alert("Please fill out this field");
        return;
      }
      setResponses((prev) => ({
        ...prev,
        [field.id]: inputValue
      }));
    }

    // Rating field
    if (field.type === "rating") {
      setResponses((prev) => ({
        ...prev,
        [field.id]: inputValue
      }));
    }

    // Move to next field or submit
    if (currentIndex < form.fields.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const formattedResponses = Object.entries(responses).map(
        ([fieldId, value]) => ({
          fieldId,
          value
        })
      );
      await API.post(`/forms/${formId}/submit`, { responses: formattedResponses });
      alert("Form submitted successfully!");
      setResponses({});
      setCurrentIndex(0);
    } catch (err) {
      console.error("Error submitting form", err);
      alert("Failed to submit form. Please try again.");
    }
  };

  if (!form) return <div>Loading form...</div>;

  const currentField = form.fields[currentIndex];

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {form.fields.slice(0, currentIndex + 1).map((field, index) => {
          if (field.category === "bubble") {
            return (
              <div key={field.id} className={styles.bot}>
                {field.type === "image" ? (
                  <img
                    src={field.value}
                    alt={field.label || "Image"}
                    className={styles.imagePreview}
                  />
                ) : (
                  field.value
                )}
              </div>
            );
          } else {
            return index < currentIndex ? (
              <div key={field.id}>
                <div className={styles.user}>{responses[field.id]}</div>
              </div>
            ) : null;
          }
        })}
      </div>

      {/* Input Field */}
      {currentField?.category === "input" && (
        <div className={styles.inputBox}>
          <input
            type={
              currentField.type === "phone"
                ? "tel"
                : currentField.type === "email"
                ? "email"
                : currentField.type === "number"
                ? "number"
                : currentField.type === "date"
                ? "date"
                : "text"
            }
            placeholder={
              currentField.type === "phone"
                ? "Enter phone number"
                : currentField.placeholder || "Type here..."
            }
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleNext()}
            autoFocus
          />
          <button onClick={handleNext}>Submit</button>
        </div>
      )}

      {/* Rating Field */}
      {currentField?.type === "rating" && (
        <div className={styles.inputBox}>
          <Rating
            value={Number(inputValue)}
            onChange={(val) => {
              setInputValue(Number(val));
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PublishForm;
