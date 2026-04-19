import PropTypes from "prop-types";
import styles from "./Sidebar.module.css";
import { useLang } from "../../context/LanguageContext";

export default function Sidebar({ addField }) {
  const { t } = useLang();

  const bubbleFields = [
    { type: "text",  label: t.textField  },
    { type: "image", label: t.imageField },
    { type: "video", label: t.videoField },
    { type: "gif",   label: t.gifField   },
  ];

  const inputFields = [
    { type: "text",    label: t.textField    },
    { type: "email",   label: t.emailLabel   },
    { type: "number",  label: t.numberField  },
    { type: "phone",   label: t.phoneField   },
    { type: "date",    label: t.dateField    },
    { type: "rating",  label: t.ratingField  },
    { type: "buttons", label: t.buttonsField },
  ];

  const renderFieldButtons = (fields, category) =>
    fields.map((field) => (
      <button
        key={`${category}-${field.type}`}
        type="button"
        className={styles.fieldButton}
        onClick={() => addField(field.type, category)}
      >
        {field.label}
      </button>
    ));

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarScrollable}>
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t.bubblesSection}</h3>
          <div className={styles.buttonGroup}>
            {renderFieldButtons(bubbleFields, "bubble")}
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>{t.inputsSection}</h3>
          <div className={styles.buttonGroup}>
            {renderFieldButtons(inputFields, "input")}
          </div>
        </section>
      </div>
    </aside>
  );
}

Sidebar.propTypes = {
  addField: PropTypes.func.isRequired,
};