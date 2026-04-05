import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import logo from '../assets/homem-aranha-branca.png'

import { CHARACTER } from '../enum/character'

const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', passwordConfirm: '', name: '', character: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {

      if(form.password !== form.passwordConfirm) {
        setError('As senhas não coincidem.')
        return
      }

      const { data } = await api.post('/auth/signup', form)
      localStorage.setItem('token', data.access_token)
      navigate('/')
    } catch {
      setError('Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <img src={logo} alt="Logo do Homem-Aranha" width={80} style={styles.logo} />
        </div>

        {/* Header */}
        <div style={styles.header}>
          <span style={styles.badge}>HeroForce</span>
          <h1 style={styles.title}>Bem-vindo novo herói</h1>
          <p style={styles.subtitle}>Crie sua conta para começar a missão</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Nome</label>
            <input
              type="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Peter Parker"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="peter.parker@dailybugle.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Senha</label>
            <div style={styles.inputWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{ ...styles.input, paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
              
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Confirme a sua Senha</label>
            <div style={styles.inputWrap}>
              <input
                type={showPasswordConfirm ? 'text' : 'password'}
                name="passwordConfirm"
                value={form.passwordConfirm}
                onChange={handleChange}
                placeholder="••••••••"
                required
                style={{ ...styles.input, paddingRight: '42px' }}
              />
              <button
                type="button"
                onClick={() => setShowPasswordConfirm(v => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
              >
                {showPasswordConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
              
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Personagem</label>
            <select
              name="character"
              value={form.character}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Selecione seu personagem</option>
              {CHARACTER.map((char) => (
                <option key={char} value={char}>
                  {char}
                </option>
              ))}
            </select>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Entrando...' : 'Entrar na missão'}
          </button>
        </form>

      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0d0d1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },
  card: {
    position: 'relative',
    zIndex: 1,
    backgroundColor: '#12122a',
    border: '0.5px solid rgba(192, 0, 42, 0.3)',
    borderRadius: '16px',
    padding: '.8rem 2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxSizing: 'border-box',
  },
  logoWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '1.25rem',
  },
  logo: {
    animation: 'float 3s ease-in-out infinite',
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.75rem',
  },
  badge: {
    display: 'inline-block',
    backgroundColor: 'rgba(192, 0, 42, 0.15)',
    color: '#ff4d6d',
    border: '0.5px solid rgba(192, 0, 42, 0.4)',
    borderRadius: '99px',
    padding: '2px 12px',
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.5px',
    marginBottom: '0.75rem',
  },
  title: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#f0f0ff',
    margin: '0 0 4px',
  },
  subtitle: {
    fontSize: '13px',
    color: '#8888aa',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  fieldGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    color: '#8888aa',
    marginBottom: '6px',
    textAlign: 'left',
  },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#1a1a35',
    border: '0.5px solid rgba(192, 0, 42, 0.25)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: '#f0f0ff',
    fontSize: '14px',
    outline: 'none',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#8888aa',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  error: {
    color: '#ff4d6d',
    fontSize: '13px',
    margin: '0 0 0.5rem',
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    backgroundColor: '#c0002a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '11px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '0.25rem',
    transition: 'background 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '1.25rem 0',
  },
  hr: {
    flex: 1,
    border: 'none',
    borderTop: '0.5px solid rgba(255,255,255,0.08)',
  },
  dividerText: {
    fontSize: '12px',
    color: '#55556a',
    whiteSpace: 'nowrap',
  },
  registerText: {
    textAlign: 'center',
    fontSize: '13px',
    color: '#8888aa',
    margin: 0,
  },
  registerLink: {
    color: '#ff4d6d',
    fontWeight: 500,
    cursor: 'pointer',
  },
}