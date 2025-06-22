#!/bin/bash

# Replace these variables with your actual GitHub information
GITHUB_USERNAME="YOUR_USERNAME"
REPOSITORY_NAME="YOUR_REPOSITORY_NAME"
BRANCH_NAME="main"  # or 'master' if that's your default branch

# Check current remotes
echo "Current remote repositories:"
git remote -v

# Set up the remote repository if needed
if ! git remote | grep -q "^origin$"; then
  echo "Adding remote repository..."
  git remote add origin "https://github.com/$GITHUB_USERNAME/$REPOSITORY_NAME.git"
else
  echo "Remote 'origin' already exists. Do you want to update it? (y/n)"
  read update_remote
  if [ "$update_remote" = "y" ]; then
    echo "Updating remote repository..."
    git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPOSITORY_NAME.git"
  fi
fi

# Stage changes
echo "Staging changes..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Add enhanced AthleteDashboard_Version2 with improved UI and features"

# Push to GitHub
echo "Pushing to GitHub..."
git push -u origin $BRANCH_NAME

echo "Done!"