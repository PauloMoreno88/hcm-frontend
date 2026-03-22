import { useEffect } from 'react'
import { AppRouter } from './router'
import { useAuthStore } from './store/authStore'

function App() {
  const hydrate = useAuthStore(s => s.hydrate)

  // Restaura sessão do token salvo ao montar o app
  useEffect(() => { hydrate() }, [hydrate])

  return <AppRouter />
}

export default App
