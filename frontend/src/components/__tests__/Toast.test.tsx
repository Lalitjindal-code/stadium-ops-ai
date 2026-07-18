import { render, screen, act } from '@testing-library/react';
import { expect, test } from 'vitest';
import { ToastProvider, useToast } from '../ui/Toast';
import { useEffect } from 'react';

const TestComponent = () => {
  const { toast } = useToast();
  useEffect(() => {
    toast('success', 'Operation completed');
  }, [toast]);
  return null;
};

test('renders toast notification with accessible role', () => {
  render(
    <ToastProvider>
      <TestComponent />
    </ToastProvider>
  );
  
  const statusContainer = screen.getByRole('status');
  expect(statusContainer).toBeInTheDocument();
  expect(statusContainer).toHaveAttribute('aria-live', 'polite');
  expect(screen.getByText('Operation completed')).toBeInTheDocument();
});
