# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/5ed9908e-fa3d-4618-b22f-017633a2f3af

## 🤖 A2A Intelligent Agent System

This project features an advanced **Agent-to-Agent (A2A) autonomous system** that monitors, detects, and fixes issues without manual intervention.

### What is A2A?

The A2A system consists of 5 specialized AI agents working together:

- 🏗️ **Build Agent** - Ensures successful compilation
- 🧪 **Test Agent** - Maintains test suite health  
- 🎨 **Lint Agent** - Enforces code quality
- 🔒 **Security Agent** - Identifies vulnerabilities
- 🔄 **Integration Agent** - Manages Lovable.dev sync

### How It Works

The agents autonomously:
1. Monitor all code changes via GitHub Actions
2. Detect issues in build, tests, linting, and security
3. Apply automated fixes when safe
4. Create PRs for human review when needed
5. Coordinate with each other to ensure fixes don't break anything

### Benefits

✅ **Automatic issue detection and resolution**  
✅ **Always buildable, tested code**  
✅ **Security vulnerabilities addressed promptly**  
✅ **Lovable.dev integration maintained**  
✅ **More time for feature development**

**Learn more**: See [docs/A2A_AGENT_SYSTEM.md](docs/A2A_AGENT_SYSTEM.md) for the complete guide.

---

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5ed9908e-fa3d-4618-b22f-017633a2f3af) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5ed9908e-fa3d-4618-b22f-017633a2f3af) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
