import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";
import styles from "../components/AuthForm.module.css";

const FIELDS = [
  { name: "username", label: "Benutzername", type: "text", autoFocus: true },
  { name: "password", label: "Passwort", type: "password" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(values.username, values.password);
      navigate("/games");
    } catch (err) {
      setError(err.message || "Login fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Anmelden"
      fields={FIELDS}
      values={values}
      onChange={handleChange}
      onSubmit={handleSubmit}
      submitLabel="Anmelden"
      loadingLabel="Wird angemeldet…"
      loading={loading}
      error={error}
      footer={
        <>
          Noch kein Konto?{" "}
          <Link to="/register" className={styles.link}>
            Registrieren
          </Link>
        </>
      }
    />
  );
}
