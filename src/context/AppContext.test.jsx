import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppProvider, useAppContext } from './AppContext.jsx';
import { databaseService } from '../mock/mockService.js';

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
});
