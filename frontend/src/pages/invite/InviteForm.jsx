import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";
import styles from "./InviteForm.module.css";

const InviteForm = () => {
  const { formId } = useParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("View");
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  if (!formId) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>Form ID is missing.</p>
      </div>
    );
  }

  const sendInvite = async () => {
    if (!email.trim()) {
      setMessage("Please enter an email address");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await API.post("/forms/invite", {
        email: email.trim(),
        formId,
        role,
      });

      setMessage("Invite sent successfully ✅");
      setEmail("");
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to send invite"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateInviteLink = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { data } = await API.get(`/forms/invite/${formId}`);
      setInviteLink(data.inviteLink);
    } catch {
      setMessage("Error generating invite link");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage("Failed to copy link");
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.closeBtn}
        onClick={() => navigate(`/formbuilder/${formId}`)}
      >
        ✖
      </button>

      <h2 className={styles.heading}>Invite Collaborators</h2>

      {message && (
        <p className={styles.message}>{message}</p>
      )}

      <div className={styles.section}>
        <h3>Invite by Email</h3>

        <input
          type="email"
          placeholder="Enter collaborator email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={styles.select}
        >
          <option value="Edit">Edit</option>
          <option value="View">View</option>
        </select>

        <button
          onClick={sendInvite}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Sending..." : "Send Invite"}
        </button>
      </div>

      <div className={styles.section}>
        <h3>Invite by Link</h3>

        <button
          onClick={generateInviteLink}
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Generating..." : "Generate Link"}
        </button>

        {inviteLink && (
          <div className={styles.copyContainer}>
            <input
              type="text"
              value={inviteLink}
              readOnly
              className={styles.input}
            />

            <button
              onClick={copyInviteLink}
              className={styles.copyButton}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteForm;