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
    background: '#1a73e8',
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

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/games')
    } catch (err) {
      setError(err.message || 'Login fehlgeschlagen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.title}>Anmelden</h2>

      {error && <div style={styles.error}>{error}</div>}

      <form style={styles.form} onSubmit={handleSubmit}>
        <label style={styles.label}>
          Benutzername
          <input
            style={styles.input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
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
          />
        </label>

        <button style={styles.btn} type="submit" disabled={loading}>
          {loading ? 'Wird angemeldet…' : 'Anmelden'}
        </button>
      </form>

      <p style={styles.footer}>
        Noch kein Konto?{' '}
        <Link to="/register" style={styles.link}>Registrieren</Link>
      </p>
    </div>
  )
}
