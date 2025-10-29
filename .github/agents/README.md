# Custom Agents Directory

This directory is where GitHub Copilot custom agents are stored.

## What are Custom Agents?

Custom agents are specialized AI assistants that can help with specific tasks in your repository. They are configured using YAML files in this directory.

## How to Create a Custom Agent

1. Create a new `.yml` or `.yaml` file in this directory
2. Define your agent's configuration following the GitHub Copilot custom agent schema
3. The agent will be available for use in GitHub Copilot

## Example Agent Structure

```yaml
name: my-custom-agent
description: A description of what this agent does
instructions: |
  Detailed instructions for the agent on how to perform its tasks.
```

## Finding Your Custom Agents

All custom agents for this repository should be stored in this directory (`.github/agents/`).

If you previously created a custom agent and can't find it here, it may have been:
- Stored in a different location
- Not committed to the repository
- Deleted in a previous commit

To recover a lost custom agent, check:
1. Your local file system if you created it locally
2. Previous commits using `git log` and `git show`
3. Other branches that might contain the agent configuration

## Additional Resources

- [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
- [Custom Agents Guide](https://docs.github.com/en/copilot/customizing-copilot)
