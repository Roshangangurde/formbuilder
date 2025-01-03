import { useState } from 'react';
import Forms from '../../components/Forms';

export default function Signup() {
    const [formData,setformData]= useState({
        name:"",
        email:"",
        mobile:"",
        password:"",
        confirmPassword:"",
        checkBox:false,
    });
    
    const [error, setError] = useState({
        name: false,
        email: false,
        mobile:false,
        password: false,
        confirmPassword: false,
        checkBox:false
    });
    const formField = [
        {
            name: "name",
            type: "text",
            placeholder: "Enter your Name",
            value: formData.name,
            onChange:(e)=>{
                setformData({...formData,name: e.target.value})
            }
        },
        {
            name: "email",
            type: "email",
            placeholder: "Enter your email",
            value: formData.email,
            onChange:(e)=>{
                setformData({...formData,email: e.target.value})
            }
        },
        {
            name: "mobile",
            type: "text",
            placeholder: "Enter your Mobile number",
            value: formData.mobile,
            onChange:(e)=>{
                setformData({...formData,mobile: e.target.value})
            }
        },
        {
            name: "password",
            type: "password",
            placeholder: "Enter your password",
            value: formData.password,
            onChange:(e)=>{
                setformData({...formData,password: e.target.value})
            }
        },
        {
            name: "confirmPassword",
            type: "password",
            placeholder: "Confirm your password",
            value: formData.confirmPassword,
            onChange:(e)=>{
                setformData({...formData,confirmPassword: e.target.value})
            }
        },
        {
            name: "checkBox",
            type: "checkBox",
            label: "Agree the terms and conditions",
            value: formData.checkBox,
            onChange:(e)=>{
                setformData({...formData,checkBox: e.target.checked})
            }
        },
    ];

    const onSubmit = (e) => {
        e.preventDefault();
        let hasError = false;
    
        Object.keys(errorMessage).forEach((key) => {
          if (!errorMessage[key].isValid) {
            errorMessage[key].onError();
            hasError = true;
          }
        });
    
        if (!hasError) {
          console.log("Form submitted successfully!", formData);
        }
      };
    
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
