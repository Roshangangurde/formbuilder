import { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Formbuilder.module.css";
import AuthContext from "../../context/AuthContext";
import Navbar from "../../components/navbar/Navbar";
import Rating from "../../components/rating/Rating";
import Sidebar from "../../components/sidebar/Sidebar"; 
import deleteIcon from "../../assets/delete.png"

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
            url: type === 'image' || type === 'video' || type === 'gif',
            required: false,
            placeholder: "",
            options: type === 'buttons' ? ['Option 1', 'Option 2'] : [],
            validation: {
                min: type === 'number' ? 0 : null,
                max: type === 'number' ? 100 : null,
                pattern: type === 'email' ? '^\\S+@\\S+\\.\\S+$' : null
            }
        };
        setFormFields([...formFields, newField]);
    };

    const updateField = (id, value, key = 'value') => {
        setFormFields(prevFields =>
            prevFields.map(field =>
                field.id === id ? { ...field, [key]: value } : field
            )
        );
    };

    const removeField = (id) => {
        setFormFields(formFields.filter(field => field.id !== id));
    };
     
    const shareForm = async () => {
        try {
            
            if (!sharedFormId) {
                const savedFormId = await handleSubmit();
                if (!savedFormId) throw new Error("save the form");
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
            const method = isNewForm ? 'POST' : 'PUT';
            const url = isNewForm
                ? 'http://localhost:3000/api/v1/forms'
                : `http://localhost:3000/api/v1/forms/${sharedFormId}`;
    
            
            const normalizedFields = formFields.map(field => {
               
             
                return {
                    ...field,
                    value: (field.type === "image" || field.type === "video" || field.type === "gif")
                        ? field.url || ""
                        : field.value
                };
            });
    
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    form_name: formName,
                    fields: normalizedFields,
                    darkMode,
                    owner: userId
                })
            });
    
            const data = await response.json();
            const newFormId = data._id || data.form?._id;
    
            if (!newFormId) {
                throw new Error("Form ID missing in server response");
            }
    
            setsharedFormId(newFormId);
            setIsFormSaved(true); 
    
      
            if (isNewForm) {
                const submitResponse = await fetch(`http://localhost:3000/api/v1/forms/${newFormId}/sumbit`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        responses: normalizedFields.map(f => ({
                            fieldId: f.id,
                            value: f.type === "image" || f.type === "video" || f.type === "gif" 
                                ? f.url || "" 
                                : f.value || ""
                        }))
                    })
                });
    
                if (!submitResponse.ok) {
                    throw new Error("Failed to submit initial responses");
                }
            }
    
            alert("Form saved successfully!");
            return newFormId;
    
        } catch (error) {
            console.error("Error saving form:", error);
            alert(`Error saving form: ${error.message}`);
            throw error;
        } 
    };

    useEffect(() => {
        const fetchFormData = async () => {
            try {
    
                if (!userId || !token) {
                    throw new Error("User not authenticated");
                }
    
                if (formId) {
                    const response = await fetch(`http://localhost:3000/api/v1/forms/${formId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    });
                    
                    if (!response.ok) throw new Error(`Failed to fetch form: ${response.status}`);
                    
                    const data = await response.json();
                    
                  
                    console.log("Fetched form data:", data);
    
                 
                    const formData = data.form || data;
                    
                    if (!formData) throw new Error("No form data received");
    
                    setFormName(formData.form_name || "Untitled Form");
                    setFormFields(formData.fields || []);
                    setsharedFormId(formData._id || formId);
                    setDarkMode(formData.darkMode || false);
                }
            } catch (err) {
                console.error("Error loading form:", err);
                
                
                if (err.message.includes("Failed to fetch form: 404")) {
                    navigate("/forms");
                }
            } 
        };
    
        fetchFormData();
    }, [formId, userId, token, navigate]); 
    
    

    const copyFormLink = () => {
        if (!sharedFormId && !formId) return;
        
        const formLink = `${window.location.origin}/publish/${sharedFormId || formId}`;
        navigator.clipboard.writeText(formLink)
            .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                
                const textArea = document.createElement('textarea');
                textArea.value = formLink;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    setIsCopied(true);
                    setTimeout(() => setIsCopied(false), 2000);
                } catch (err) {
                    console.error('Fallback copy failed: ', err);
                }
                document.body.removeChild(textArea);
            });
    };


    

    return (
        <>
<Navbar
    showFormName={true}
    formName={formName}
    onNameChange={setFormName}
    showFlow={true}
    showResponse={true}
    
    onFlowClick={() => navigate(`/formbuilder/${sharedFormId || formId}`)}
    onResponseClick={() => navigate(`/response/${sharedFormId || formId}`)}
    showShare={isFormSaved}
    onShare={async () => {
        try {
            const formIdToShare = await shareForm();
            navigate(`/invite/${formIdToShare}`);
        } catch (error) {
            console.error("Error preparing form for sharing:", error);
            alert("Please save the form before sharing");
        }
    }}
    showSave={true}
    onSave={handleSubmit}
    darkMode={darkMode}
    onToggleDarkMode={toggleDarkMode}
    showClose={true}
/>

            <div className={styles.mainContent}>
                
                    <div className={styles.formCanvas}>
                    {isFormSaved && (
                        <div className={styles.copyLinkContainer}>
                            <button
                                onClick={copyFormLink}
                                className={styles.copyLinkButton}
                                title="Copy form link"
                            >
                                {isCopied ? 'Link Copied!' : 'Copy Form Link'}
                            </button>
                        </div>
                    )}
                        <h2 className={styles.formStart}>{formName}</h2>
                        <div className={styles.formStart}>Start</div>
                        {formFields.length > 0 ? (
                            formFields.map((field) => (
                                <div key={field.id} className={styles.formField}>
                                    <label>{field.label || 'Untitle Form'}</label>
                                    {renderFieldInput(field)}
                                    <button
                                        className={styles.removeButton}
                                        onClick={() => removeField(field.id)}
                                    ><img src={deleteIcon} alt="deleteIcon"/></button>
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
                    onChange={(value) => updateField(field.id, value)}
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
                return (
                    <div className={styles.mediaField}>
                        <input
                            type="text"
                            placeholder="Paste image URL here..."
                            value={field.url || ''}
                            onChange={(e) => updateField(field.id, e.target.value, "url")}
                        />
                    </div>
                );
            case 'video':
            case 'gif':
        }
    }
}
