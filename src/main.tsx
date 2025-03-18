import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './routes/index.routes';
import "./globals.css";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
    <QueryClientProvider
      client={queryClient}
    >
      <Router />
    </QueryClientProvider> 
)
