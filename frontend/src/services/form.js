import axios from "axios";

export const forms = async () => {
    try {
        const token = localStorage.getItem("token"); // Retrieve token

        const response = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/api/v1/form`, // Ensure this is the correct API endpoint
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Pass the token
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Fetched Forms:", response.data);
        return response.data; // Return the list of forms
    } catch (err) {
        console.error("Error fetching forms:", err);

        let errorMessage = "Error fetching forms.";
        if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
        }

        return { success: false, error: errorMessage };
    }
};