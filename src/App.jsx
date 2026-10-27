import { useState } from 'react'
import LoginScreen from './LoginScreen'
import ChatApp from './ChatApp'

const APP_USER = import.meta.env.VITE_APP_USER
const APP_PASS = import.meta.env.VITE_APP_PASS

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('qa-app-auth') === 'true'
  )

  function handleLogout() {
    localStorage.removeItem('qa-app-auth')
    setIsAuthenticated(false)
  }

  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLogin={() => setIsAuthenticated(true)}
        correctUser={APP_USER}
        correctPass={APP_PASS}
      />
    )
  }

  return <ChatApp onLogout={handleLogout} />
}

export default App