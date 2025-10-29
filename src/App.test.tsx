import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@/App';

describe('App', () => {
  it('renders the main application component', () => {
    render(<App />);
    // Test that the app renders without crashing
    expect(document.body).toBeInTheDocument();
  });
});
