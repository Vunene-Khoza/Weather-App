import { render, screen } from '@testing-library/react';
import App from './App';

test('renders weather app locate button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Locate/i);
  expect(buttonElement).toBeInTheDocument();
});
