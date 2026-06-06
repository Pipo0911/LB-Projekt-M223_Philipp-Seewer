import { useEffect } from "react";
import PropTypes from "prop-types";
import styles from "./Modal.module.css";
import controls from "../styles/controls.module.css";

/**
 * Wiederverwendbares Modal-Dialogfenster.
 * - Klick auf den Hintergrund schliesst den Dialog.
 * - Escape-Taste schliesst den Dialog (Accessibility).
 * - Inhalt bleibt klickbar (stopPropagation).
 */
export default function Modal({ open, title, hint, children, onClose }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onMouseDown={onClose} role="presentation">
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={styles.header}>
          <div>
            <div className={styles.title}>{title}</div>
            {hint ? <div className={styles.hint}>{hint}</div> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`${controls.btn} ${controls.btnGhost}`}
          >
            Schliessen
          </button>
        </div>

        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  hint: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
