import { forms } from '../../services/form';
import { useState, useEffect } from 'react';

export default function Forms() {
    const [formData, setFormData] = useState([]);
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
    console.log("Token:", token);
    
        forms()
            .then(res => {
                setFormData(res.forms || []); // Ensure it’s an array
                setisLoading(false);
            })
            .catch(err => {
                console.error("Error loading forms:", err);
                setisLoading(false);
            });
    }, []);

    return (
        <>
            <h1>Forms</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                formData.length > 0 ? (
                    formData.map((form, idx) => <p key={idx}>{form.form_name}</p>)
                ) : (
                    <p>No forms found.</p>
                )
            )}
        </>
    );
}
