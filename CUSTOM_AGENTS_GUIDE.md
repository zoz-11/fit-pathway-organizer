# Custom Agents Guide

## Where to Find Custom Agents

GitHub Copilot custom agents are stored in the `.github/agents/` directory.

### Current Status

The `.github/agents/` directory has been created for this repository. 

### If You Previously Created a Custom Agent

If you created a custom agent before and cannot find it, please check:

1. **Local Files**: Check your local machine for any `.yml` or `.yaml` files you may have created
2. **Git History**: Use `git log --all --full-history -- ".github/agents/"` to search commit history
3. **Other Branches**: The agent might be in a different branch
4. **Not Committed**: The agent may have been created but never committed to the repository

### How to Create a New Custom Agent

1. Navigate to `.github/agents/` directory
2. Create a new YAML file (e.g., `my-agent.yml`)
3. Add your agent configuration
4. Commit and push the file

### Example Custom Agent

Create a file `.github/agents/example-agent.yml`:

```yaml
name: example-agent
description: An example custom agent
instructions: |
  This is an example custom agent.
  Add your specific instructions here.
```

### Need Help?

- Check the README in `.github/agents/` directory
- Review GitHub Copilot documentation
- Search the repository history for previous agent configurations

## Quick Recovery Steps

If you remember what your custom agent did, you can recreate it:

1. Go to `.github/agents/`
2. Create a new `.yml` file
3. Add the agent configuration
4. Save and commit

The custom agent will then be available for use with GitHub Copilot.
