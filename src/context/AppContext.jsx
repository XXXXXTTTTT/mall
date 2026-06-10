import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { authService, databaseService } from '../mock/mockService.js';

const AppContext = createContext(null);

const initialState = {
  user: null,
  loading: false,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, error: '' };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    databaseService.initializeDatabase();
    dispatch({ type: 'SET_USER', payload: authService.getUserSession() });
  }, []);

  const actions = useMemo(
    () => ({
      async loginUser(username, password) {
        dispatch({ type: 'SET_LOADING', payload: true });
        const result = await authService.loginUser(username, password);
        dispatch({ type: 'SET_LOADING', payload: false });
        if (!result.success) {
          dispatch({ type: 'SET_ERROR', payload: result.message });
          return result;
        }
        dispatch({ type: 'SET_USER', payload: result.data });
        return result;
      },
      logoutUser() {
        authService.logoutUser();
        dispatch({ type: 'SET_USER', payload: null });
      },
    }),
    [],
  );

  const value = useMemo(() => ({ state, ...actions }), [state, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const value = useContext(AppContext);
  if (!value) {
    throw new Error('useAppContext 必须在 AppProvider 内使用');
  }
  return value;
}
