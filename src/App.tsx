import { AppProvider } from './context/AppContext'
import AppContent from './AppContent'

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}

export default App
