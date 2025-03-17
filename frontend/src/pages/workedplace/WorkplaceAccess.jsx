import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function WorkplaceAccess() {
    const { workplaceId } = useParams();
    const navigate = useNavigate();
    const [hasAccess, setHasAccess] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/invite/access/${workplaceId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Access denied");
                }

                setHasAccess(true);
            } catch (error) {
                console.error("Access denied:", error.message);
                setHasAccess(false);
                navigate("/"); // Redirect if access denied
            }
        };

        checkAccess();
    }, [workplaceId, navigate, token]);

    if (hasAccess === null) return <p>Checking access...</p>;
    if (!hasAccess) return <p>Access Denied</p>;

    return <h1>Welcome to the Workplace!</h1>;
}
