import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider, useAppContext } from './AppContext.jsx';
import { databaseService } from '../mock/mockService.js';

const waitForMockServiceDelay = async () => {
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 250);
    });
  });
};

function Probe() {
  const { state, loginUser, logoutUser } = useAppContext();
  return (
    <div>
      <p data-testid="user">{state.user?.username || '未登录'}</p>
      <button type="button" onClick={() => loginUser('member', '123456')}>
        登录
      </button>
      <button type="button" onClick={logoutUser}>
        退出
      </button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  databaseService.initializeDatabase({ force: true });
});

describe('AppContext', () => {
  it('logs in and logs out frontend user', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <Probe />
      </AppProvider>,
    );

    expect(screen.getByTestId('user')).toHaveTextContent('未登录');

    await user.click(screen.getByRole('button', { name: '登录' }));

    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('member'));

    await user.click(screen.getByRole('button', { name: '退出' }));

    expect(screen.getByTestId('user')).toHaveTextContent('未登录');
  });

  function C3Probe() {
    const {
      state,
      loginUser,
      refreshCart,
      addToCart,
      toggleFavorite,
      refreshFavorites,
      refreshOrders,
      refreshAddresses,
      logoutUser,
    } = useAppContext();
    return (
      <div>
        <p data-testid="user">{state.user?.id || '未登录'}</p>
        <p data-testid="cart-count">{state.cartItems.length}</p>
        <p data-testid="favorite-count">{state.favorites.length}</p>
        <p data-testid="order-count">{state.orders.length}</p>
        <p data-testid="address-count">{state.addresses.length}</p>
        <button type="button" onClick={() => loginUser('member', '123456')}>
          登录会员
        </button>
        <button type="button" onClick={logoutUser}>
          退出会员
        </button>
        <button type="button" onClick={() => refreshCart()}>
          刷新购物车
        </button>
        <button
          type="button"
          onClick={() =>
            addToCart({
              productId: 'p-001',
              skuId: 'p-001-standard',
              quantity: 1,
            })
          }
        >
          加购
        </button>
        <button type="button" onClick={() => toggleFavorite('p-001')}>
          收藏
        </button>
        <button type="button" onClick={() => refreshFavorites()}>
          刷新收藏
        </button>
        <button type="button" onClick={() => refreshOrders()}>
          刷新订单
        </button>
        <button type="button" onClick={() => refreshAddresses()}>
          刷新地址
        </button>
      </div>
    );
  }

  it('refreshes C3 cart, favorites, and orders for logged in user', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <C3Probe />
      </AppProvider>,
    );

    await user.click(screen.getByRole('button', { name: '登录会员' }));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('user-001'));

    await user.click(screen.getByRole('button', { name: '加购' }));
    await waitFor(() => expect(screen.getByTestId('cart-count')).toHaveTextContent('1'));

    await user.click(screen.getByRole('button', { name: '收藏' }));
    await user.click(screen.getByRole('button', { name: '刷新收藏' }));
    await waitFor(() => expect(screen.getByTestId('favorite-count')).toHaveTextContent('1'));

    await user.click(screen.getByRole('button', { name: '刷新订单' }));
    await waitFor(() => expect(screen.getByTestId('order-count')).toHaveTextContent('1'));
  });

  it('refreshes addresses for logged in user', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <C3Probe />
      </AppProvider>,
    );

    await user.click(screen.getByRole('button', { name: '登录会员' }));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('user-001'));

    await user.click(screen.getByRole('button', { name: '刷新地址' }));
    await waitFor(() => expect(screen.getByTestId('address-count')).toHaveTextContent('1'));
  });

  it('clears cartItems, favorites, orders, and addresses on logout', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <C3Probe />
      </AppProvider>,
    );

    await user.click(screen.getByRole('button', { name: '登录会员' }));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('user-001'));

    await user.click(screen.getByRole('button', { name: '加购' }));
    await waitFor(() => expect(screen.getByTestId('cart-count')).toHaveTextContent('1'));

    await user.click(screen.getByRole('button', { name: '收藏' }));
    await user.click(screen.getByRole('button', { name: '刷新收藏' }));
    await waitFor(() => expect(screen.getByTestId('favorite-count')).toHaveTextContent('1'));

    await user.click(screen.getByRole('button', { name: '刷新订单' }));
    await waitFor(() => expect(screen.getByTestId('order-count')).toHaveTextContent('1'));

    await user.click(screen.getByRole('button', { name: '刷新地址' }));
    await waitFor(() => expect(screen.getByTestId('address-count')).toHaveTextContent('1'));

    await user.click(screen.getByRole('button', { name: '退出会员' }));

    expect(screen.getByTestId('user')).toHaveTextContent('未登录');
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    expect(screen.getByTestId('favorite-count')).toHaveTextContent('0');
    expect(screen.getByTestId('order-count')).toHaveTextContent('0');
    expect(screen.getByTestId('address-count')).toHaveTextContent('0');
  });

  it('does not repopulate cartItems after logout while addToCart is pending', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <C3Probe />
      </AppProvider>,
    );

    await user.click(screen.getByRole('button', { name: '登录会员' }));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('user-001'));

    await user.click(screen.getByRole('button', { name: '加购' }));
    await user.click(screen.getByRole('button', { name: '退出会员' }));

    expect(screen.getByTestId('user')).toHaveTextContent('未登录');
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');

    await waitForMockServiceDelay();

    expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  });

  it('does not repopulate favorites after logout while toggleFavorite is pending', async () => {
    const user = userEvent.setup();
    render(
      <AppProvider>
        <C3Probe />
      </AppProvider>,
    );

    await user.click(screen.getByRole('button', { name: '登录会员' }));
    await waitFor(() => expect(screen.getByTestId('user')).toHaveTextContent('user-001'));

    await user.click(screen.getByRole('button', { name: '收藏' }));
    await user.click(screen.getByRole('button', { name: '退出会员' }));

    expect(screen.getByTestId('user')).toHaveTextContent('未登录');
    expect(screen.getByTestId('favorite-count')).toHaveTextContent('0');

    await waitForMockServiceDelay();

    expect(screen.getByTestId('favorite-count')).toHaveTextContent('0');
  });
});
