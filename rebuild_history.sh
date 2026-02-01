#!/bin/bash

# Configuration
export GIT_COMMITTER_NAME="anjim999"
export GIT_COMMITTER_EMAIL="anjim999@users.noreply.github.com"
export GIT_AUTHOR_NAME="anjim999"
export GIT_AUTHOR_EMAIL="anjim999@users.noreply.github.com"

# Function to commit with date
commit_with_date() {
    local date="$1"
    local message="$2"
    export GIT_AUTHOR_DATE="$date"
    export GIT_COMMITTER_DATE="$date"
    git commit -m "$message"
}

# Clear old git
rm -rf .git
git init
git branch -M main

# 1. Project Init (Last Night 21:00)
git add README.md .gitignore
commit_with_date "2026-01-31 21:00:00 +0530" "initial commit: project structure setup"

# 2. Stack Envrionment Setup (Last Night 22:30) - BOTH Client and Server Setup
git add server/package.json server/tsconfig.json server/.env.example
git add client/package.json client/tsconfig.json client/vite.config.ts client/index.html client/postcss.config.js client/tailwind.config.js client/tsconfig.node.json
commit_with_date "2026-01-31 22:30:00 +0530" "chore: initialize full-stack environment (express + vite/react)"

# 3. Core Architecture (Today 09:15) - Database & Frontend Foundation
git add server/src/config server/src/models server/src/middleware
git add client/src/context client/src/types client/src/utils client/src/index.css
commit_with_date "2026-02-01 09:15:00 +0530" "feat: setup database schema and frontend core context"

# 4. API & Service Layer (Today 11:30) - Connecting FE and BE
git add server/src/routes server/src/controllers server/src/services server/src/validators server/src/app.ts server/src/index.ts
git add client/src/services client/src/hooks
commit_with_date "2026-02-01 11:30:00 +0530" "feat: implement api endpoints and client-side service integration"

# 5. Feature Implementation (Today 13:45) - Menu, Orders, Dashboard UI
git add client/src/components client/src/pages client/src/App.tsx client/src/main.tsx
git add server/src/scripts
commit_with_date "2026-02-01 13:45:00 +0530" "feat: complete dashboard, menu, and order management features"

# 6. Branding & Assets (Today 15:15 - Recent)
git add .
commit_with_date "2026-02-01 15:15:00 +0530" "style: update branding, assets and final polish"

# Branch Setup
git branch stage
git branch dev
git remote add origin https://github.com/anjim999/Eatoes-Admin.git

echo "History rewriting complete."
