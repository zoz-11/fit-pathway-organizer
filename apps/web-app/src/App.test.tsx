import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "@/App";

describe("App", () => {
  it("renders the main application component", () => {
    render(<App />);
    // You might want to add a more specific assertion here based on your App component's content
    // The App component renders different content based on auth state
    // We should test for something that's always present, like the loading state or auth check
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
