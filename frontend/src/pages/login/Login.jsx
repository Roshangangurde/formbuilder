import { useState } from 'react';
import Forms from '../../components/Forms';
import { login } from '../../services/auth';  
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

   

    const [formData, setformData] = useState({
       
        email: "",
        password: "",
        
    });

    const [error, setError] = useState({
       
        email: false,
        password: false,
    });

    const formField = [
       
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
            name: "password",
            type: "password",
            placeholder: "Enter your password",
            value: formData.password,
            onChange: (e) => {
                setformData({ ...formData, password: e.target.value });
            }
        },
    ];

    const errorMessage = {
       
        email: {
            message: "Email is required",
            isValid: formData.email.length > 0,
            onError: () => setError((prev) => ({ ...prev, email: true })),
        },
       
        password: {
            message: "Password is required",
            isValid: formData.password.length > 0,
            onError: () => setError((prev) => ({ ...prev, password: true })),
        }
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
                const res = await login(formData);
                console.log("Submitting formData:", formData); 
                console.log("Response received:", res);

                const token = res?.token; 
         if (token) {
             localStorage.setItem("token", token);
             alert("Login successful");
             navigate("/form");
         } else {
             console.error("Token not found in response:", res);
             alert("Login failed. Token not received.");
         }
                
             //    const token = res.data.token;
             //    localStorage.setItem("token",token);
             //    alert(` ${res.message}`);
             //    navigate('/form');
                // if (res.status === 200) {
                //     alert(res.message || 'Registered successfully');
                //  }  else {
                   // }
                   
            } catch (error) {
                console.error("Login error:", error);
                if (error.response && error.response.data?.message) {
                    alert(`Login failed: ${error.response.data.message}`);
                } else {
                    alert("Login failed. Please try again.");
                }
            }
        }
    };

    return (
        <div>
            <p>Login</p>
            <Forms
                formField={formField}
                onSubmit={onSubmit}
                error={error}
                errorMessage={errorMessage}
            />
        </div>
    );
}
