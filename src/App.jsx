import { RouterProvider } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext.jsx';
import { router } from './router.jsx';

export function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
