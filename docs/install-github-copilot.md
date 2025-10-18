# Installing GitHub Copilot

GitHub Copilot is an AI pair programmer that offers autocomplete-style suggestions as you code. Here's how to install and set it up:

## Installation Steps

1. **Install the GitHub Copilot Extension in VS Code**:
   - Open VS Code
   - Go to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X on Mac)
   - Search for "GitHub Copilot"
   - Click "Install"

2. **Sign in to GitHub**:
   - After installation, you'll be prompted to sign in to GitHub
   - Follow the authentication flow to connect your GitHub account

3. **Verify Your Subscription**:
   - GitHub Copilot requires a subscription
   - If you're a student, GitHub Education participant, or maintainer of popular open source projects, you may be eligible for free access
   - Otherwise, you'll need a paid subscription

4. **Start Using GitHub Copilot**:
   - Once installed and authenticated, GitHub Copilot will start providing suggestions as you code
   - Suggestions appear as ghost text that you can accept by pressing Tab

## Usage Tips

- Press `Alt+]` (or `Option+]` on Mac) to see the next suggestion
- Press `Alt+[` (or `Option+[` on Mac) to see the previous suggestion
- Press `Ctrl+Enter` to open the GitHub Copilot suggestion panel with multiple suggestions

## Project Integration

We've added the GitHub Copilot types package to the project as a dev dependency:

```json
"@vscode/github-copilot-types": "^0.1.0"
```

This package provides TypeScript type definitions for GitHub Copilot, which can be helpful for development.

## Additional Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [GitHub Copilot for VS Code](https://marketplace.visualstudio.com/items?itemName=GitHub.copilot)
- [GitHub Copilot Pricing](https://github.com/features/copilot#pricing)
