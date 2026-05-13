import './App.css'
import Layout from './pages/Layout'
import { ThemeProvider } from './components/ThemeProvider'

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="mood-space-theme">
      <Layout />
    </ThemeProvider>
  )
}

export default App
