import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function InviteForm() {
    const [email, setEmail] = useState("");
    const [permission, setPermission] = useState("view"); // Default: View Only
    const [invite, setInvite] = useState(null);
    const [loadingInvite, setLoadingInvite] = useState(false);
    const [loadingForm, setLoadingForm] = useState(false);
    const [error, setError] = useState(null);
    
    const [link, setLink] = useState(""); // Stores only one link
    const [copyStatus, setCopyStatus] = useState(""); // Copy feedback

    const navigate = useNavigate();

    // ✉️ Send an email invitation with selected permission
    const inviteUser = async () => {
        if (!email.trim()) {
            alert("Please enter an email.");
            return;
        }

        setLoadingInvite(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/invite`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, permission }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to invite user");

            setInvite(data.invite);
            alert(`User invited successfully with ${permission} access!`);
        } catch (error) {
            console.error("Error inviting user:", error.message);
            setError(error.message);
        } finally {
            setLoadingInvite(false);
        }
    };

    // 📄 Generate a form link based on selected permission (No Email Required)
    const createForm = async () => {
        if (loadingForm) return; // Prevents duplicate clicks

        setLoadingForm(true);
        setError(null);
        setCopyStatus(""); // Reset copy status

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/invite/form/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ permission }), // Email removed
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to generate link");

            setLink(data.link); // ✅ Stores only the latest link
        } catch (error) {
            console.error("Error generating link:", error.message);
            setError(error.message);
        } finally {
            setLoadingForm(false);
        }
    };

    // 📋 Copy to Clipboard Function
    const copyToClipboard = () => {
        navigator.clipboard.writeText(link).then(() => {
            setCopyStatus("Copied! ✅");
            setTimeout(() => setCopyStatus(""), 2000); // Reset after 2 seconds
        }).catch(() => {
            setCopyStatus("Failed to copy ❌");
        });
    };

    // ❌ Close modal
    const handleClose = () => {
        navigate("/form");
    };

    return (
        <div className="overlay">
            <div className="modal">
                {/* Close Button */}
                <button className="close-btn" onClick={handleClose}>✖</button>

                 {/* 🔹 Shared Permission Dropdown */}
                 <div className="form-group">
                    
                    <select 
                        value={permission} 
                        onChange={(e) => setPermission(e.target.value)}
                        className="input-field"
                    >
                        <option value="view">View</option>
                        <option value="edit">Edit</option>
                    </select>
                </div>

                {/* Invite User Section */}
                <h2 className="modal-title">Invite User (Email)</h2>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                </div>

               

                {/* Error Message */}
                {error && <p className="error-message">{error}</p>}

                {/* Send Email Invite Button */}
                <button onClick={inviteUser} className="invite-btn" disabled={loadingInvite}>
                    {loadingInvite ? "Sending..." : `Send ${permission.charAt(0).toUpperCase() + permission.slice(1)} Invite`}
                </button>

                {/* Form Link Generation Section */}
                <h2 className="modal-title">Generate Link</h2>
                <button onClick={createForm} className="create-form-btn" disabled={loadingForm}>
                    {loadingForm ? "Generating..." : `Generate ${permission.charAt(0).toUpperCase() + permission.slice(1)} Link`}
                </button>

                {link && (
                    <div className="link-container">
                        <p><strong>{permission === "view" ? "View" : "Edit"} Form:</strong> 
                            <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                        </p>
                        <button onClick={copyToClipboard}>Copy Link</button>
                        {copyStatus && <span className="copy-status">{copyStatus}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
