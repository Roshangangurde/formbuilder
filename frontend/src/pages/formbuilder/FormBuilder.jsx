import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Formbuilder.module.css";
import AuthContext from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Rating from "../../components/rating/Rating";
import Sidebar from "../../components/sidebar/Sidebar";
import deleteIcon from "../../assets/delete.png";
import API from "../../services/api"; // 

export default function FormBuilder() {
    const [formName, setFormName] = useState("Untitled Form");
    const [darkMode, setDarkMode] = useState(false);
    const [formFields, setFormFields] = useState([]);
    const [sharedFormId, setsharedFormId] = useState(null);
    const [isFormSaved, setIsFormSaved] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const navigate = useNavigate();
    const { user, token } = useContext(AuthContext);
    const userId = user?.userId;
    const { formId } = useParams();

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    const addField = (type, category) => {
        const newField = {
            id: Date.now(),
            type,
            category,
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
            value: type === 'rating' ? 0 : "",
            url: type === 'image' || type === 'video' || type === 'gif' ? "" : undefined,
            required: false,
            placeholder: "",
            options: type === 'buttons' ? ['Option 1', 'Option 2'] : [],
            validation: {
                min: type === 'number' ? 0 : null,
                max: type === 'number' ? 100 : null,
                pattern: type === 'email' ? '^\\S+@\\S+\\.\\S+$' : null
            }
        };
        setFormFields(prev => [...prev, newField]);
    };

    const updateField = (id, value, key = 'value') => {
        setFormFields(prev =>
            prev.map(field =>
                field.id === id ? { ...field, [key]: value } : field
            )
        );
    };

    const removeField = (id) => {
        setFormFields(prev => prev.filter(field => field.id !== id));
    };

    const shareForm = async () => {
        try {
            if (!sharedFormId) {
                const savedFormId = await handleSubmit();
                if (!savedFormId) throw new Error("Please save the form first");
                setsharedFormId(savedFormId);
                return savedFormId;
            }
            return sharedFormId;
        } catch (error) {
            console.error("Error in shareForm:", error);
            throw error;
        }
    };

    const handleSubmit = async () => {
        try {
            const isNewForm = !sharedFormId;
            const normalizedFields = formFields.map(field => ({
                ...field,
                value: ["image", "video", "gif"].includes(field.type)
                    ? field.url || ""
                    : field.value
            }));

            const payload = {
                form_name: formName,
                fields: normalizedFields,
                darkMode,
                owner: userId
            };

            const { data } = isNewForm
                ? await API.post("/forms", payload)
                : await API.put(`/forms/${sharedFormId}`, payload);

            const newFormId = data._id || data.form?._id;
            if (!newFormId) throw new Error("Missing form ID from server");

            setsharedFormId(newFormId);
            setIsFormSaved(true);

            if (isNewForm) {
                await API.post(`/forms/${newFormId}/sumbit`, {
                    responses: normalizedFields.map(f => ({
                        fieldId: f.id,
                        value: ["image", "video", "gif"].includes(f.type) ? f.url || "" : f.value || ""
                    }))
                });
            }

            alert("Form saved successfully!");
            return newFormId;
        } catch (error) {
            console.error("Error saving form:", error);
            alert(`Error saving form: ${error.message}`);
            throw error;
        }
    };

    const copyFormLink = () => {
        const formLink = `${window.location.origin}/publish/${sharedFormId || formId}`;
        navigator.clipboard.writeText(formLink)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => {
                console.error("Clipboard copy failed, using fallback", err);
                const textarea = document.createElement("textarea");
                textarea.value = formLink;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand("copy");
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                } catch (err) {
                    console.error("Fallback copy failed", err);
                }
                document.body.removeChild(textarea);
            });
    };

    useEffect(() => {
        const fetchFormData = async () => {
            try {
                if (!userId || !token) return;

                if (formId) {
                    const { data } = await API.get(`/forms/${formId}`);
                    const formData = data.form || data;

                    setFormName(formData.form_name || "Untitled Form");
                    setFormFields(formData.fields || []);
                    setsharedFormId(formData._id || formId);
                    setDarkMode(formData.darkMode || false);
                }
            } catch (err) {
                console.error("Error loading form:", err);
                if (err?.response?.status === 404) {
                    navigate("/forms");
                }
            }
        };

        fetchFormData();
    }, [formId, userId, token, navigate]);

    return (
        <>
            <Navbar
                showFormName
                formName={formName}
                onNameChange={setFormName}
                showFlow
                showResponse
                onFlowClick={() => navigate(`/formbuilder/${sharedFormId || formId}`)}
                onResponseClick={() => navigate(`/response/${sharedFormId || formId}`)}
                showShare={isFormSaved}
                onShare={async () => {
                    try {
                        const formIdToShare = await shareForm();
                        navigate(`/invite/${formIdToShare}`);
                    } catch (error) {
                        alert("Please save the form before sharing");
                    }
                }}
                showSave
                onSave={handleSubmit}
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
                showClose
            />

            <div className={styles.mainContent}>
                <div className={styles.formCanvas}>
                    {isFormSaved && (
                        <div className={styles.copyLinkContainer}>
                            <button onClick={copyFormLink} className={styles.copyLinkButton}>
                                {isCopied ? 'Link Copied!' : 'Copy Form Link'}
                            </button>
                        </div>
                    )}

                    <h2 className={styles.formStart}>{formName}</h2>
                    <div className={styles.formStart}>Start</div>

                    {formFields.length > 0 ? (
                        formFields.map(field => (
                            <div key={field.id} className={styles.formField}>
                                <label>{field.label || 'Untitled Field'}</label>
                                {renderFieldInput(field)}
                                <button
                                    className={styles.removeButton}
                                    onClick={() => removeField(field.id)}
                                >
                                    <img src={deleteIcon} alt="deleteIcon" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <p>No fields added yet. Use the sidebar to add fields.</p>
                        </div>
                    )}
                </div>
            </div>

            <Sidebar addField={addField} darkMode={darkMode} />
        </>
    );

    function renderFieldInput(field) {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'number':
            case 'phone':
            case 'date':
                return (
                    <input
                        type={field.type}
                        value={field.value || ''}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        placeholder={field.placeholder || `Enter ${field.type}`}
                    />
                );
            case 'rating':
                return (
                    <Rating
                        value={parseInt(field.value) || 0}
                        onChange={(val) => updateField(field.id, val)}
                        max={field.validation?.max || 5}
                    />
                );
            case 'buttons':
                return (
                    <div className={styles.buttonOptions}>
                        {(field.options || []).map((opt, i) => (
                            <button
                                key={i}
                                className={styles.formButton}
                                onClick={() => updateField(field.id, opt)}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                );
            case 'image':
            case 'video':
            case 'gif':
                return (
                    <div className={styles.mediaField}>
                        <input
                            type="text"
                            placeholder={`Paste ${field.type} URL here...`}
                            value={field.url || ''}
                            onChange={(e) => updateField(field.id, e.target.value, "url")}
                        />
                    </div>
                );
            default:
                return null;
        }
    }
}
