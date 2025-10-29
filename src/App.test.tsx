import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@/App';

describe('App', () => {
  it('renders the main application component', () => {
    render(<App />);
    // The app renders a loading state initially
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
