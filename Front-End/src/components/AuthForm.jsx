import PropTypes from "prop-types";
import styles from "./AuthForm.module.css";
import controls from "../styles/controls.module.css";

/**
 * Wiederverwendbares Authentifizierungs-Formular für Login und Registrierung.
 * Die konkreten Felder werden über die `fields`-Prop konfiguriert; so teilen
 * sich Login und Register denselben Aufbau (zuvor ~95 % duplizierter Code).
 */
export default function AuthForm({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  submitLabel,
  loadingLabel,
  loading,
  error,
  success,
  footer,
}) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>{title}</h2>

      {error ? <div className={`${controls.alert} ${controls.alertError}`}>{error}</div> : null}
      {success ? (
        <div className={`${controls.alert} ${controls.alertSuccess}`}>{success}</div>
      ) : null}

      <form className={styles.form} onSubmit={onSubmit}>
        {fields.map((field) => (
          <label key={field.name} className={styles.field}>
            {field.label}
            <input
              className={controls.input}
              type={field.type ?? "text"}
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              autoFocus={field.autoFocus}
              minLength={field.minLength}
              required
            />
          </label>
        ))}

        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? loadingLabel : submitLabel}
        </button>
      </form>

      {footer ? <p className={styles.footer}>{footer}</p> : null}
    </div>
  );
}

AuthForm.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      autoFocus: PropTypes.bool,
      minLength: PropTypes.number,
    })
  ).isRequired,
  values: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitLabel: PropTypes.string.isRequired,
  loadingLabel: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  footer: PropTypes.node,
};
