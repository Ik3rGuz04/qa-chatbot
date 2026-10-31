import { useState } from 'react'
import './LoginScreen.css'

function LoginScreen({ onLogin, correctUser, correctPass }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!user.trim() || !pass.trim()) {
      setError('Ingrese sus credenciales completas (usuario y contraseña).')
      triggerShake()
      return
    }

    setLoading(true)
    setError('')

    setTimeout(() => {
      if (user === correctUser && pass === correctPass) {
        localStorage.setItem('qa-app-auth', 'true')
        onLogin()
      } else {
        setLoading(false)
        setError('Credenciales no válidas. Verifique su usuario o contraseña.')
        setPass('')
        triggerShake()
      }
    }, 600)
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  return (
    <div className="login-page">
      <div className="login-bg-blob blob-1"></div>
      <div className="login-bg-blob blob-2"></div>
      <div className="login-bg-blob blob-3"></div>
      <div className="login-bg-grid"></div>

      <header className="login-header">
        <div className="header-left">
          <div className="pill pill-secure">
            <span className="dot-icon">🛡</span>
            <span>E2E SecOps 256-Bit</span>
          </div>
          <div className="pill pill-tls">
            <span className="pulse-dot"></span>
            TLS 1.3 Strict
          </div>
        </div>
        <div className="header-right">
          <div className="pill pill-cluster">
            <span>⬡</span>
            <span>Cluster QA-01: Online</span>
          </div>
          <div className="pill pill-version">
            <span className="pulse-dot"></span>
            <span>v4.2.0-qa</span>
          </div>
        </div>
      </header>

      <main className="login-main">
        <section className="login-info">
          <div className="info-badge">
            <span className="ping-dot"></span>
            <span>Autonomous Test Operations</span>
          </div>

          <div className="info-heading">
            <h2>Proyecto Integrador "Dos Equipos, Un Sistema"</h2>
            <p>
              Gerson Ajanel, Kaisy García, Hugo Leonel Méndez y Iker Guzmán — suite
              automatizada de pruebas end-to-end, validación de regresión inteligente y
              telemetría de fallos en tiempo real.
            </p>
          </div>

          <div className="info-avatars">
            <div className="avatar-stack">
              <div className="avatar-chip">QA</div>
              <div className="avatar-chip chip-2">DEV</div>
              <div className="avatar-chip chip-3">OPS</div>
            </div>
            <p>Conexión integrada con repositorios CI/CD y telemetría de staging</p>
          </div>
        </section>

        <section className="login-card-wrap">
          <form className={`login-card ${shake ? 'shake' : ''}`} onSubmit={handleSubmit}>
            <div className="card-glow glow-1"></div>
            <div className="card-glow glow-2"></div>

            <div className="card-header">
              <div className="brand-icon">
                <span>🤖</span>
                <span className="brand-ping"></span>
              </div>

              <div className="sso-pill">
                <span>🔒</span>
                <span>SSO / LDAP Activo</span>
              </div>

              <h1>Acceso al Asistente</h1>
              <p>Herramienta interna de Aseguramiento de la Calidad automatizada</p>
            </div>

            {error && (
              <div className="alert-box">
                <span>⚠</span>
                <span>{error}</span>
              </div>
            )}

            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="usernameInput">
                  <span className="label-icon">🪪</span>
                  Usuario
                </label>
              </div>
              <input
                id="usernameInput"
                type="text"
                placeholder="usuario"
                autoComplete="username"
                value={user}
                onChange={(e) => {
                  setUser(e.target.value)
                  setError('')
                }}
                autoFocus
              />
            </div>

            <div className="field-group">
              <div className="field-label-row">
                <label htmlFor="passwordInput">
                  <span className="label-icon">🔑</span>
                  Contraseña
                </label>
              </div>
              <div className="password-wrap">
                <input
                  id="passwordInput"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  value={pass}
                  onChange={(e) => {
                    setPass(e.target.value)
                    setError('')
                  }}
                />
                <button
                  type="button"
                  className="toggle-pass-btn"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label="Alternar visibilidad de contraseña"
                >
                  {showPass ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div className="remember-row">
              <label className="remember-check">
                <input type="checkbox" defaultChecked />
                <span>Mantener sesión activa</span>
              </label>
              <span className="cluster-tag">
                <span className="pulse-dot small"></span>
                Cluster QA-01
              </span>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              <span>{loading ? 'Validando credenciales...' : 'Ingresar al Sistema'}</span>
              <span className={loading ? 'spin' : ''}>{loading ? '⟳' : '→'}</span>
            </button>

            <div className="card-footer">
              <div className="footer-secure">
                <span>🔐</span>
                <span>Entorno interno protegido</span>
              </div>
              <p>QA Core v2.4 • TLS 1.3 • Cifrado Asistido</p>
            </div>
          </form>
        </section>
      </main>

      <footer className="login-footer">
        <div className="footer-left">
          <span>⌘</span>
          <span>Agente Cliente / QA</span>
          <span className="footer-sep">• Enterprise SecOps v4.2</span>
        </div>
        <div className="footer-right">
          <span className="footer-dc">Datacenter: us-east-1 (Primary)</span>
          <span className="footer-sla">
            <span className="pulse-dot small"></span>
            SLA 99.99%
          </span>
        </div>
      </footer>
    </div>
  )
}

export default LoginScreen