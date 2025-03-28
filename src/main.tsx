import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './routes/index.routes';
import "./globals.css";
import {Toast} from "./components/Toast.tsx";
import {StorageKeys} from "./constants/StorageKeys.ts";
const queryClient = new QueryClient();

document.documentElement.classList.toggle(
    "dark",
    localStorage[StorageKeys.theme] == "dark"
)

createRoot(document.getElementById('root')!).render(
    <QueryClientProvider
      client={queryClient}
    >
        <Toast>
            <Router />
        </Toast>
    </QueryClientProvider>
)
