import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import API from "../../services/api";
import styles from "./ShareModal.module.css";

const ShareModal = ({ formId, formName, onClose }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("View");
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [copied, setCopied] = useState(false);

  const overlayRef = useRef(null);
  const publishLink = `${window.location.origin}/publish/${formId}`;

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const sendInvite = async () => {
    if (!email.trim()) {
      setMessage({ text: "Please enter an email address", type: "error" });
      return;
    }
    setSending(true);
    setMessage({ text: "", type: "" });
    try {
      await API.post("/forms/invite", { email: email.trim(), formId, role });
      setMessage({ text: "Invite sent successfully!", type: "success" });
      setEmail("");
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to send invite",
        type: "error",
      });
    } finally {
      setSending(false);
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(publishLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage({ text: "Failed to copy link", type: "error" });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      className={styles.overlay}
      ref={overlayRef}
      onClick={handleOverlayClick}
    >
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Share Form</h2>
            <p className={styles.subtitle}>{formName}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {message.text && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}

        {/* Invite by email */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Invite by Email</h3>
          <p className={styles.sectionDesc}>
            Give someone access to view or edit this form.
          </p>
          <div className={styles.emailRow}>
            <input
              type="email"
              className={styles.emailInput}
              placeholder="colleague@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendInvite()}
              autoFocus
            />
            <select
              className={styles.roleSelect}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="View">View</option>
              <option value="Edit">Edit</option>
            </select>
          </div>
          <button
            className={styles.sendButton}
            onClick={sendInvite}
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Invite"}
          </button>
        </section>

        {/* Invite by link */}
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Share Public Link</h3>
          <p className={styles.sectionDesc}>
            Anyone with this link can fill out the form.
          </p>
          <div className={styles.linkRow}>
            <input
              type="text"
              className={styles.linkInput}
              value={publishLink}
              readOnly
            />
            <button
              className={`${styles.copyButton} ${copied ? styles.copiedButton : ""}`}
              onClick={copyLink}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

ShareModal.propTypes = {
  formId: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ShareModal;
