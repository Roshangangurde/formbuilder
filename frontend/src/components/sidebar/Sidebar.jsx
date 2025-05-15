import React from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar({ addField }) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarScrollable}>
                <h3>Bubbles</h3>
                <button onClick={() => addField("text", "bubble")}>Text</button>
                <button onClick={() => addField("image", "bubble")}>Image</button>
                <button onClick={() => addField("video", "bubble")}>Video</button>
                <button onClick={() => addField("gif", "bubble")}>GIF</button>

                <h3>Inputs</h3>
                <button onClick={() => addField("text", "input")}>Text</button>
                <button onClick={() => addField("email", "input")}>Email</button>
                <button onClick={() => addField("number", "input")}>Number</button>
                <button onClick={() => addField("phone", "input")}>Phone</button>
                <button onClick={() => addField("date", "input")}>Date</button>
                <button onClick={() => addField("rating", "input")}>Rating</button>
                <button onClick={() => addField("buttons", "input")}>Buttons</button>
            </div>
        </div>
    );
}