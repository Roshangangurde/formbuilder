import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function InviteForm() {
    const [email, setEmail] = useState("");
    const [invite, setInvite] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    // ✅ Auto-check invite when email is entered
    useEffect(() => {
        if (email) {
            checkInvite();
        } else {
            setInvite(null);
            setError(null);
        }
    }, [email]);

    // 🔍 Check if email exists in the database
    const checkInvite = async () => {
        setChecking(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/invite/check?email=${email}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "No invite found");
            }

            setInvite(data.invite);
        } catch (error) {
            setInvite(null);
            setError(error.message);
        } finally {
            setChecking(false);
        }
    };

    // ✉️ Send an invitation
    const inviteUser = async () => {
        if (!email) {
            alert("Please enter an email.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/invite`, {
                method: "POST", // Create new invite
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to invite user");

            alert("User invited successfully!");
            setInvite(data.invite);
        } catch (error) {
            console.error("Error inviting user:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
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
                <h2 className="modal-title">Invite User</h2>

                {/* Enter Email */}
                <div className="form-group">
                    <label>Enter Your Email</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                    />
                    {checking && <p className="loading-message">Checking...</p>}
                </div>

                {/* Show Invite Details if Found */}
                {invite && (
                    <div className="invite-details">
                        <p><strong>Invited Email:</strong> {invite.email}</p>
                        <p><strong>Invited At:</strong> {new Date(invite.invitedAt).toLocaleString()}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="error-message">{error}</p>}

                {/* Send Invite Button */}
                <button onClick={inviteUser} className="invite-btn" disabled={loading}>
                    {loading ? "Sending..." : "Send Invite"}
                </button>
            </div>
        </div>
    );
}
