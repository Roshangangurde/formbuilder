import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import AuthContext from "../../context/AuthContext";
import styles from "./Forms.module.css";
import Navbar from "../../components/navbar/Navbar";
import deleteIcon from "../../assets/delete.png";

const Forms = () => {
    const [forms, setForms] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
    const [folders, setFolders] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const userId = user?.userId;
  
    useEffect(() => {
        const fetchFormsAndFolders = async () => {
            try {
                const formsResponse = await API.get(`/forms?owner=${userId}`);
                if (Array.isArray(formsResponse.data)) {
                    setForms(formsResponse.data);
                } else {
                    throw new Error("Invalid data");
                }

                const foldersResponse = await API.get(`/folders?userId=${userId}`);
                setFolders(foldersResponse.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchFormsAndFolders();
    }, [userId]);

    const createForm = () => {
        navigate("/formbuilder");
    };

    const createFolder = async () => {
        const folderName = prompt("Enter folder name:");
        if (!folderName) return;
    
        try {
            const response = await API.post('/folders', { name: folderName });
            if (response.status === 201) {
                alert(`Folder "${folderName}" created successfully!`);
               
                const foldersResponse = await API.get(`/folders?userId=${userId}`);
                setFolders(foldersResponse.data);
            } else {
                alert('Failed to create folder.');
            }
        } catch (error) {
            console.error(error);
            alert('Error creating folder.');
        }
    };

   
    const deleteFolder = async (folderId) => {
        try {
            await API.delete(`/folders/${folderId}`);
            setFolders(folders.filter(folder => folder._id !== folderId));
            alert("Folder deleted successfully");
        } catch (error) {
            console.error(error);
            alert("Error deleting folder");
        }
    };

    const handleFormClick = (formId) => {
        navigate(`/formbuilder/${formId}`);
    };

    const deleteForm = async (formId) => {
        try {
            await API.delete(`/forms/${formId}`);
            setForms(forms.filter(form => form._id !== formId));
            alert("Form deleted successfully");
        } catch (error) {
            console.error(error);
            alert("Error deleting form");
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(prev => !prev);
    };

    return (
        <>        
            <Navbar
                showWorkspaceDropdown={true}
                darkMode={darkMode}
                onToggleDarkMode={toggleDarkMode}
                showClose={true}
            />

<div className={styles.formsContainer}>
  <div className={styles.actions}>
    <button onClick={createFolder} className={styles.createFolderButton}>
      + Create New Folder
    </button>
    <button onClick={createForm} className={styles.createFormButton}>
      + Create New Typebot
    </button>
  </div>


  {folders.length > 0 && (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Your Folders</h3>
      <div className={styles.flexContainer}>
        {folders.map((folder) => (
          <div key={folder._id} className={styles.folderCard}>
            <button
              className={styles.folderNameButton}
              onClick={() => handleFolderClick(folder._id)} 
            >
              {folder.name}
            </button>
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                deleteFolder(folder._id);
              }}
            >
              <img src={deleteIcon} alt="Delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

 
  {forms.length > 0 && (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Your forms</h3>
      <div className={styles.flexContainer}>
        {forms.map((form) => (
          <div key={form._id} className={styles.formCard}>
            <p
              className={styles.formName}
              onClick={() => handleFormClick(form._id)}
            >
              {form.form_name}
            </p>
            <button
              className={styles.deleteButton}
              onClick={(e) => {
                e.stopPropagation();
                deleteForm(form._id);
              }}
            >
              <img src={deleteIcon} alt="Delete" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )}

</div>
        </>
    );
};

export default Forms;