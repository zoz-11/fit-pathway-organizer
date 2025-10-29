# CodeQL Advanced Setup Guide

This repository uses **CodeQL Advanced Setup** for code security scanning.

## Current Configuration

The CodeQL workflow (`.github/workflows/codeql.yml`) is configured to:
- Analyze **JavaScript/TypeScript** and **Python** code with explicit build steps for TypeScript
- Run on pushes and PRs to branches: `zoz-11-patch-15`, `main`, `master`, `develop`
- Perform weekly scheduled scans (Sundays at midnight UTC)
- Use enhanced security-and-quality query suite for comprehensive vulnerability detection
- Include dependency caching for faster CI runs
- Generate detailed SARIF results with 30-day artifact retention

## ⚠️ Important: Switch to Advanced Setup Required

For the CodeQL workflow to function properly, you **must** switch from Default to Advanced setup in GitHub:

### Steps to Enable Advanced Setup:

1. Navigate to your repository's security settings:
   ```
   https://github.com/zoz-11/fit-pathway-organizer/settings/security_analysis
   ```

2. Find the **"Code scanning"** section

3. Click the **"Switch to advanced"** button

4. Confirm the switch

### Why This is Necessary:

GitHub blocks SARIF (Static Analysis Results Interchange Format) uploads from advanced CodeQL workflows when the Default setup is enabled. This is to prevent duplicate or conflicting scans. By switching to Advanced setup, you're telling GitHub to use the workflow file in this repository instead of the automatic default configuration.

## What Happens After Switching:

- ✅ The CodeQL workflow will run automatically on relevant branches
- ✅ Security scanning results will appear in the Security tab
- ✅ No conflicts between default and advanced setups
- ✅ Full control over CodeQL configuration via the workflow file

## Troubleshooting

If you see errors like:
```
CodeQL analyses from advanced configurations cannot be processed when default setup is enabled
```

This means the repository is still using Default setup. Follow the steps above to switch to Advanced setup.

## Additional Resources

- [GitHub CodeQL Documentation](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql)
- [Switching to Advanced Setup](https://docs.github.com/en/code-security/code-scanning/creating-an-advanced-setup-for-code-scanning/configuring-advanced-setup-for-code-scanning)
- [Troubleshooting SARIF Uploads](https://docs.github.com/en/code-security/code-scanning/troubleshooting-sarif-uploads/default-setup-enabled)
