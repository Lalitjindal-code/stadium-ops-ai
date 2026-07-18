import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import LoginPage from '../login/page';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

test('renders login page with email and password inputs', () => {
  render(<LoginPage />);
  expect(screen.getByLabelText(/Secure Email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Access Key/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Enter Command Center/i })).toBeInTheDocument();
});
