import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router";
import App from './App.tsx'
import { AuthContextProvider } from './components/Auth/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AuthContextProvider>,
)