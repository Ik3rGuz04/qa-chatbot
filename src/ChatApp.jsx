import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import './ChatApp.css'

const BOTS = {
  bot1: {
    label: 'Cliente',
    icon: 'person',
    url: 'https://gersongt.app.n8n.cloud/webhook/4994ac1e-33c0-40be-adff-39e51d97140c/chat',
  },
  bot2: {
    label: 'QA',
    icon: 'verified',
    url: 'https://gersongt.app.n8n.cloud/webhook/f61bc9cf-7b44-4315-8b1c-983e52def6c1/chat',
  },
}

const N8N_AUTH_USER = import.meta.env.VITE_N8N_AUTH_USER
const N8N_AUTH_PASS = import.meta.env.VITE_N8N_AUTH_PASS

function generateSessionId() {
  return 'sess-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function ChatApp({ onLogout }) {
  const [selectedBot, setSelectedBot] = useState('bot1')
  const [sessionId, setSessionId] = useState(generateSessionId())
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const streamEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  function handleBotChange(botKey) {
    if (botKey === selectedBot) return
    setSelectedBot(botKey)
    setSessionId(generateSessionId())
    setMessages([])
    setError(null)
  }

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 140) + 'px'
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: text, time: formatTime() }])
    setInput('')
    setLoading(true)
    setError(null)
    requestAnimationFrame(autoResize)

    try {
      const response = await fetch(BOTS[selectedBot].url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${N8N_AUTH_USER}:${N8N_AUTH_PASS}`),
        },
        body: JSON.stringify({ chatInput: text, sessionId }),
      })

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`)
      }

      const data = await response.json()
      const botReply =
        data.output ?? data.text ?? data.response ?? data.message ?? JSON.stringify(data)

      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: botReply, time: formatTime() },
      ])
    } catch (err) {
      setError(
        err.message.includes('Failed to fetch')
          ? 'No se pudo conectar al webhook. Verifica que n8n esté activo.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleChange(e) {
    setInput(e.target.value)
    autoResize()
  }

  const currentBot = BOTS[selectedBot]

  return (
    <div className="chat-root">
      <header className="chat-topbar">
        <div className="topbar-identity">
          <div className="identity-avatar-wrap">
            <div className="identity-avatar">
              <span className="material-icon">terminal</span>
            </div>
            <span className="identity-ping">
              <span className="ping-ring"></span>
              <span className="ping-core"></span>
            </span>
          </div>
          <div className="identity-text">
            <div className="identity-title-row">
              <h1>Asistente Virtual</h1>
              <span className="engine-badge">AI-ENGINE</span>
            </div>
            <p className="identity-sub">
              <span>Módulo de Validación &amp; Diagnóstico</span>
              <span className="dot-sep">•</span>
              <span className="online-text">En línea</span>
            </p>
          </div>
        </div>

        <div className="topbar-tabs">
          {Object.entries(BOTS).map(([key, bot]) => (
            <button
              key={key}
              className={`topbar-tab ${selectedBot === key ? 'active' : ''}`}
              onClick={() => handleBotChange(key)}
            >
              <span>{bot.label}</span>
              {selectedBot === key && <span className="tab-live-dot"></span>}
            </button>
          ))}
        </div>

        <div className="topbar-actions">
          <div className="latency-pill">
            <span className="latency-dot"></span>
            <span>14ms</span>
          </div>
          <button className="logout-pill" onClick={onLogout}>
            <span>Salir</span>
          </button>
        </div>
      </header>

      <div className="context-strip">
        <div className="context-left">
          <span className="context-icon">◆</span>
          <span className="context-label">Modo:</span>
          <span className="context-value">
            Conversación con {currentBot.label}
          </span>
        </div>
        <div className="context-right">
          <span>Sesión #{sessionId.slice(5, 13)}</span>
        </div>
      </div>

      <main className="chat-stream">
        {messages.length === 0 && !loading && (
          <div className="stream-empty">
            <div className="empty-avatar">
              <span className="material-icon">smart_toy</span>
            </div>
            <p>
              Envía un mensaje para comenzar la conversación con {currentBot.label}.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={msg.role === 'user' ? 'msg-row msg-user' : 'msg-row msg-bot'}
          >
            {msg.role === 'bot' && (
              <div className="msg-avatar bot-avatar">
                <span className="material-icon">smart_toy</span>
              </div>
            )}

            <div className="msg-col">
              <div className="msg-meta">
                {msg.role === 'bot' ? (
                  <>
                    <span className="msg-name bot-name">Asistente Virtual</span>
                    <span className="msg-time">{msg.time}</span>
                  </>
                ) : (
                  <>
                    <span className="msg-time">{msg.time}</span>
                    <span className="msg-name">Tú</span>
                  </>
                )}
              </div>
              <div className={msg.role === 'bot' ? 'bubble bot-bubble' : 'bubble user-bubble'}>
                {msg.role === 'bot' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="msg-avatar user-avatar">
                <span className="material-icon">engineering</span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="typing-row">
            <div className="msg-avatar bot-avatar">
              <span className="material-icon">psychology</span>
            </div>
            <div className="typing-pill">
              <span className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </span>
              <span className="typing-text">
                {currentBot.label} está procesando tu mensaje...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span className="material-icon">error</span>
            <span>{error}</span>
          </div>
        )}

        <div ref={streamEndRef} />
      </main>

      <footer className="chat-footer">
        <div className="footer-inner">
          <div className="input-bar">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              rows={1}
            />
            <button
              className="send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              <span>Enviar</span>
              <span className="material-icon">send</span>
            </button>
          </div>
          <div className="footer-note">
            <span>Herramienta interna de Aseguramiento de la Calidad</span>
            <span className="footer-note-right">
              <span className="footer-note-dot"></span>
              Conectado vía n8n
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ChatApp