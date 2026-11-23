import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Router} from './router/router.tsx'
import {AuthProvider} from "./context/AuthProvider.tsx";
import './index.css'
import {QueryProvider} from "./providers/QueryProvider.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryProvider>
            <AuthProvider>
                <Router/>
            </AuthProvider>
        </QueryProvider>
    </StrictMode>
)
