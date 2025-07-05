import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('App', () => {
  it('renders the main application component', () => {
    render(<App />);
    // You might want to add a more specific assertion here based on your App component's content
    expect(screen.getByText(/FitPathway/i)).toBeInTheDocument(); // Assuming 'FitPathway' is present in your App
  });
});
