import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Router} from './router/router.tsx'
import {AuthProvider} from "./context/AuthProvider.tsx";
import './index.css'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <Router/>
        </AuthProvider>
    </StrictMode>
)
