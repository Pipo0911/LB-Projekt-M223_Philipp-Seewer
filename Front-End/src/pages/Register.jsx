import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";
import styles from "../components/AuthForm.module.css";

const FIELDS = [
  { name: "name", label: "Benutzername", type: "text", autoFocus: true },
  { name: "email", label: "E-Mail", type: "email" },
  { name: "password", label: "Passwort", type: "password", minLength: 6 },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await register(values.name, values.email, values.password);
      setSuccess("Registrierung erfolgreich! Du wirst zum Login weitergeleitet…");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message || "Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Registrieren"
      fields={FIELDS}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Konto erstellen"
      loadingLabel="Wird registriert…"
      loading={loading}
      error={error}
      success={success}
      footer={
        <>
          Bereits ein Konto?{" "}
          <Link to="/login" className={styles.link}>
            Anmelden
          </Link>
        </>
      }
    />
  );
}
