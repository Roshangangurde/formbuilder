import { createContext, useState, useEffect } from "react";


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error(" Error parsing user from localStorage", error);
            return null;
        }
    });

    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user && !user.userId) {
            console.error(" User data found, but userId is missing!");
        }
        setIsLoading(false);
    }, [user]);

    const login = (userData, authToken) => {
        console.log(" Received userData:", userData);
        if (!userData.userId) {
            console.error(" Login error: userId is missing from userData!", userData);
        }
        
        const updatedUser = { ...userData, userId: userData.userId };
        setUser(updatedUser);
        setToken(authToken);
        localStorage.setItem("user", JSON.stringify(updatedUser)); 
        localStorage.setItem("token", authToken);
        
        console.log(" Stored user in localStorage:", updatedUser);
    };
    

    
    const logout = () => {
        setUser(null);
        setToken("");
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {!isLoading ? children : <p>Loading...</p>}
        </AuthContext.Provider>
    );
};

export default AuthContext;
