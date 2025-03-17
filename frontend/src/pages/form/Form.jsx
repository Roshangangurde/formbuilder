import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Form() {
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const API_BASE_URL = `${import.meta.env.VITE_BASE_URL}/api/v1`;

    useEffect(() => {
        console.log("Token:", token);
    }, []);

    // Function to make API requests
    const apiRequest = async (url, method, body = null) => {
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: body ? JSON.stringify(body) : null,
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return response.json().catch(() => null); // Prevent JSON parsing error
        } catch (error) {
            console.error(`API Request Failed: ${error.message}`);
            alert(`API Request Failed: ${error.message}`);
        }
    };

    // Function to create a folder
    const createFolder = async () => {
        const data = await apiRequest(`${API_BASE_URL}/folders`, "POST", { folder_name: "New Folder" });
        if (data) {
            alert("Folder Created Successfully!");
        }
    };

    // Function to create a Typebot form
    const createTypebot = async () => {
        const data = await apiRequest(`${API_BASE_URL}/typebot`, "POST", { form_name: "New Typebot Form" });
        if (data) {
            alert("Typebot Form Created Successfully!");
            navigate("/invite"); // Navigate to Invite Page instead
        }
    };

    return (
        <>
            <h1>Form</h1>
            <button onClick={createFolder}>Create Folder</button>
            <button onClick={createTypebot}>Create Typebot</button>
        </>
    );
}
