import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '@/App';

describe('App', () => {
  it('renders the main application component without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
