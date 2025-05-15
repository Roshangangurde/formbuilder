import { useState } from "react";
import { useParams,useNavigate } from "react-router-dom"; 
import API from "../../services/api";
import styles from "./InviteForm.module.css";

const InviteForm = () => {
    const { formId } = useParams(); 
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("View");
    const [inviteLink, setInviteLink] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    if (!formId) {
        console.error("Form ID is missing from URL.");
        return <p>Error: Form ID is missing. Please try again.</p>;
    }

    const sendInvite = async () => {
        setLoading(true);
        try {
            await API.post("/forms/invite", { email, formId, role });
            alert("Invite sent!");
        } catch (error) {
            alert("No user found ");
        }
        setLoading(false);
    };

    const generateInviteLink = async () => {
        setLoading(true);
        try {
            const { data } = await API.get(`/forms/invite/${formId}`);
            setInviteLink(data.inviteLink);
        } catch (error) {
            alert("Error generating invite link");
        }
        setLoading(false);
    };

    const handleCloseClick = () => {
        navigate(`/formbuilder`);
    };
    return (
        <div className={styles.container}>
    <button className={styles.closeBtn} onClick={handleCloseClick}>✖</button>
    <h3>Invite by Email</h3>
    <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={styles.input}
    />
    <select value={role} onChange={(e) => setRole(e.target.value)} className={styles.select}>
        <option value="Edit">Edit</option>
        <option value="View">View</option>
    </select>
    <button onClick={sendInvite} disabled={loading} className={styles.button}>
        {loading ? "Sending..." : "Send Invite"}
    </button>

    <h3>Invite by Link</h3>
    <button onClick={generateInviteLink} disabled={loading} className={styles.button}>
        {loading ? "Generating..." : "Generate Link"}
    </button>

    {inviteLink && (
        <div className={styles.copyContainer}>
            <input type="text" value={inviteLink} readOnly />
            <button onClick={() => navigator.clipboard.writeText(inviteLink)}>
                Copy Link
            </button>
        </div>
    )}
</div>

    );
};

export default InviteForm;
