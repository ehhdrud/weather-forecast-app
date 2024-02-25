import Navigation from './navigation/Navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // staleTime, cacheTime은 weatherAPI의 업데이트 주기인 15분으로 설정
            staleTime: 1000 * 60 * 15,
            cacheTime: 1000 * 60 * 15,
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Navigation />
        </QueryClientProvider>
    );
}
