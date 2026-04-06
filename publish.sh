#!/bin/bash
set -e

GH_TOKEN="YOUR_GITHUB_TOKEN_HERE"
GH_USER="HamzaZia786"
REPO_NAME="EDUC-353-Digital-Project"

echo "→ Creating GitHub repository..."
curl -s \
  -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"One Concept, Four Classrooms — EDUC 353 Digital Project\",\"private\":false,\"auto_init\":false}"

echo ""
echo "→ Setting remote with token..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://$GH_USER:$GH_TOKEN@github.com/$GH_USER/$REPO_NAME.git"

echo "→ Pushing to GitHub..."
GIT_TERMINAL_PROMPT=0 git -c credential.helper= push -u origin main

echo ""
echo "→ Enabling GitHub Pages..."
sleep 5
curl -s \
  -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$GH_USER/$REPO_NAME/pages" \
  -d '{"build_type":"workflow"}'

echo ""
echo "✓ Done! Your site will be live in ~2 minutes at:"
echo "  https://$GH_USER.github.io/$REPO_NAME/"
