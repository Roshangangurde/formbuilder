import { useState } from "react";

export default function InviteForm({ workplaceId }) {
    const [email, setEmail] = useState("");
    const [inviteLink, setInviteLink] = useState(
        `${import.meta.env.VITE_FRONTEND_URL}/workplace/${workplaceId}`
    );

    const token = localStorage.getItem("token");

    // Function to send invitation (store in DB)
    const inviteUser = async () => {
        if (!email) {
            alert("Please enter an email.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/invite`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email, workplaceId }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Failed to invite user");
            }

            alert("User invited successfully!");
            setEmail("");
        } catch (error) {
            console.error("Error inviting user:", error.message);
            alert(error.message);
        }
    };

    // Function to copy invite link
    const copyInviteLink = () => {
        navigator.clipboard.writeText(inviteLink);
        alert("Invite link copied to clipboard!");
    };

    return (
        <div>
            {/* Invite by Email */}
            <div>
                <h2>Invite by Email</h2>
                <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={inviteUser}>Invite</button>
            </div>

            {/* Invite by Link */}
            <div>
                <h2>Invite by Link</h2>
                <input type="text" value={inviteLink} readOnly />
                <button onClick={copyInviteLink}>Copy Link</button>
            </div>
        </div>
    );
}
