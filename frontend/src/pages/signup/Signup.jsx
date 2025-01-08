import { useState } from 'react';
import Forms from '../../components/Forms';
import { signup } from '../../services/auth';  
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setformData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        checkBox: false,
    });

    const [error, setError] = useState({
        name: false,
        email: false,
        mobile: false,
        password: false,
        confirmPassword: false,
        checkBox: false
    });

    const formField = [
        {
            name: "name",
            type: "text",
            placeholder: "Enter your Name",
            value: formData.name,
            onChange: (e) => {
                setformData({ ...formData, name: e.target.value });
            }
        },
        {
            name: "email",
            type: "email",
            placeholder: "Enter your email",
            value: formData.email,
            onChange: (e) => {
                setformData({ ...formData, email: e.target.value });
            }
        },
        {
            name: "mobile",
            type: "text",
            placeholder: "Enter your Mobile number",
            value: formData.mobile,
            onChange: (e) => {
                setformData({ ...formData, mobile: e.target.value });
            }
        },
        {
            name: "password",
            type: "password",
            placeholder: "Enter your password",
            value: formData.password,
            onChange: (e) => {
                setformData({ ...formData, password: e.target.value });
            }
        },
        {
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm your password",
            value: formData.confirmPassword,
            onChange: (e) => {
                setformData({ ...formData, confirmPassword: e.target.value });
            }
        },
        {
            name: "checkBox",
            type: "checkBox",
            label: "Agree to the terms and conditions",
            value: formData.checkBox,
            onChange: (e) => {
                setformData({ ...formData, checkBox: e.target.checked });
            }
        },
    ];

    const errorMessage = {
        name: {
            message: "Name is required",
            isValid: formData.name.length > 0,
            onError: () => setError((prev) => ({ ...prev, name: true })),
        },
        email: {
            message: "Email is required",
            isValid: formData.email.length > 0,
            onError: () => setError((prev) => ({ ...prev, email: true })),
        },
        mobile: {
            message: "Mobile number is required",
            isValid: formData.mobile.length > 0,
            onError: () => setError((prev) => ({ ...prev, mobile: true })),
        },
        password: {
            message: "Password is required",
            isValid: formData.password.length > 0,
            onError: () => setError((prev) => ({ ...prev, password: true })),
        },
        confirmPassword: {
            message: "Confirm Password is required",
            isValid: formData.confirmPassword.length > 0,
            onError: () => setError((prev) => ({ ...prev, confirmPassword: true })),
        },
        checkBox: {
            message: "You must agree to the terms and conditions",
            isValid: formData.checkBox,
            onError: () => setError((prev) => ({ ...prev, checkBox: true })),
        },
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        let hasError = false;
        const updatedErrors = { ...error };

        Object.keys(errorMessage).forEach((key) => {
            if (!errorMessage[key].isValid) {
                updatedErrors[key] = true;
                hasError = true;
            } else {
                updatedErrors[key] = false;
            }
        });

        setError(updatedErrors);

        if (!hasError) {
            try {
                const res = await signup(formData);
                console.log("Submitting formData:", formData); 
                console.log("Response received:", res);
                const token = res?.token;
                if (res.status === 200 || token) {
                    localStorage.setItem("token", token);
                    alert( 'Registered successfully');
                        navigate('/form');
                
                 }  else {
                  alert(` ${res.message}`);
                  
                }
            } catch (error) {
                console.error("Signup error:", error);
                if (error.response && error.response.data?.message) {
                    alert(`Signup failed: ${error.response.data.message}`);
                } else {
                    alert("Signup failed. Please try again.");
                }
            }
        }
    };

    
    return (
        <div>
            <Forms
                formField={formField}
                onSubmit={onSubmit}
                error={error}
                errorMessage={errorMessage}
            />
        </div>
    );
}
