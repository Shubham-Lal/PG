import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App.tsx'
import './App.css'

createRoot(document.getElementById('root')!).render(
    <>
        <Toaster
            duration={5000}
            position='top-center'
            richColors
            closeButton
        />
        <App />
    </>
)