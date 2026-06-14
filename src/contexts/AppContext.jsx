/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  addressService,
  authService,
  cartService,
  databaseService,
  favoriteService,
  orderService,
} from '../mock/mockService.js';

const AppContext = createContext(null);

const initialState = {
  user: null,
  cartItems: [],
  favorites: [],
  orders: [],
  addresses: [],
  loading: false,
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, error: '' };
    case 'SET_CART_ITEMS':
      return { ...state, cartItems: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'SET_ADDRESSES':
      return { ...state, addresses: action.payload };
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
      async registerUser(payload) {
        dispatch({ type: 'SET_LOADING', payload: true });
        const result = await authService.registerUser(payload);
        dispatch({ type: 'SET_LOADING', payload: false });
        if (!result.success) {
          dispatch({ type: 'SET_ERROR', payload: result.message });
          return result;
        }
        dispatch({ type: 'SET_USER', payload: result.data });
        return result;
      },
      refreshCart() {
        if (!state.user) return;
        dispatch({ type: 'SET_CART_ITEMS', payload: cartService.listCartSync(state.user.id) });
      },
      async addToCart(payload) {
        const activeUserId = authService.getUserSession()?.id || null;
        if (!activeUserId) return;
        const result = await cartService.addItem({ userId: activeUserId, ...payload });
        if (result.success && authService.getUserSession()?.id === activeUserId) {
          dispatch({ type: 'SET_CART_ITEMS', payload: cartService.listCartSync(activeUserId) });
        }
        return result;
      },
      refreshFavorites() {
        if (!state.user) return;
        dispatch({
          type: 'SET_FAVORITES',
          payload: favoriteService.listFavoritesSync(state.user.id),
        });
      },
      async toggleFavorite(productId) {
        const activeUserId = authService.getUserSession()?.id || null;
        if (!activeUserId) return;
        const result = await favoriteService.toggleFavorite(activeUserId, productId);
        if (result.success && authService.getUserSession()?.id === activeUserId) {
          dispatch({
            type: 'SET_FAVORITES',
            payload: favoriteService.listFavoritesSync(activeUserId),
          });
        }
        return result;
      },
      refreshOrders() {
        if (!state.user) return;
        dispatch({ type: 'SET_ORDERS', payload: orderService.listOrdersSync(state.user.id) });
      },
      refreshAddresses() {
        if (!state.user) return;
        dispatch({
          type: 'SET_ADDRESSES',
          payload: addressService.listByUserSync(state.user.id),
        });
      },
      logoutUser() {
        authService.logoutUser();
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_CART_ITEMS', payload: [] });
        dispatch({ type: 'SET_FAVORITES', payload: [] });
        dispatch({ type: 'SET_ORDERS', payload: [] });
        dispatch({ type: 'SET_ADDRESSES', payload: [] });
      },
    }),
    [state.user],
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
