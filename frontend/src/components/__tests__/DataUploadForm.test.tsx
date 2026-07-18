import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import DataUploadForm from '../DataUploadForm';

test('renders data upload form with file input and buttons', () => {
  render(<DataUploadForm onAnalysisComplete={vi.fn()} />);
  expect(screen.getByText(/Upload Crowd Data/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Select CSV File/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Run AI Analysis/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Use Sample Data/i })).toBeInTheDocument();
});
