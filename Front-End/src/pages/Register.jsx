import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const styles = {
  wrapper: {
    maxWidth: 400,
    margin: '0 auto',
    padding: '32px 0',
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 24,
    color: '#0f172a',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '10px 12px',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: 15,
    outline: 'none',
    background: '#fff',
  },
  btn: {
    marginTop: 8,
    padding: '11px 0',
    borderRadius: 10,
    border: 'none',
    background: '#16a34a',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    cursor: 'pointer',
  },
  error: {
    background: '#fee2e2',
    color: '#b91c1c',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
  },
  success: {
    background: '#dcfce7',
    color: '#15803d',
    borderRadius: 8,
    padding: '10px 14px',
    fontSize: 14,
  },
  footer: {
    marginTop: 18,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  link: {
    color: '#1a73e8',
    fontWeight: 600,
    textDecoration: 'none',
  },
}

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await register(name, email, password)
      setSuccess('Registrierung erfolgreich! Du wirst zum Login weitergeleitet…')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setError(err.message || 'Registrierung fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Registrieren</h2>

      {error   && <div style={styles.error}>{error}</div>}
      {success && <div style={styles.success}>{success}</div>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>
          Benutzername
          <input
            style={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </label>

        <label style={styles.label}>
          E-Mail
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label style={styles.label}>
          Passwort
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </label>

        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Wird registriert…' : 'Konto erstellen'}
        </button>
      </form>

      <p style={styles.footer}>
        Bereits ein Konto?{' '}
        <Link to="/login" style={styles.link}>Anmelden</Link>
      </p>
    </div>
  )
}
