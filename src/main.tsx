import { createRoot } from 'react-dom/client';
import { AuthContextProvider } from './Auth/AuthContext.tsx';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </BrowserRouter>
);