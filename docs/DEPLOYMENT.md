# Goalfinity Institute — GitHub Pages Deployment Guide

This guide walks through deploying the **Goalfinity Institute Student Career Readiness Assessment Platform** to **GitHub Pages** with zero hosting costs, reliable relative linking, and proper Google Apps Script configuration.

---

## 1. Prerequisites

- A [GitHub](https://github.com) account.
- Git installed on your workstation.
- A deployed Google Apps Script Web App URL (see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md)).

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Initialize Git Repository
In your local project directory:
```bash
git init
git add .
git commit -m "Initial commit: Goalfinity Career Readiness Assessment Platform"
```

### Step 2: Create a GitHub Repository
1. Log in to GitHub and click **New repository** (`https://github.com/new`).
2. Repository name: e.g., `goalfinity-assessment` (or any name you prefer).
3. Set visibility to **Public** (required for free GitHub Pages).
4. Do **not** initialize with a README, .gitignore, or license (these already exist locally).
5. Click **Create repository**.

### Step 3: Push Local Code to GitHub
```bash
# Link local repository to remote
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git

# Set default branch to main and push
git branch -M main
git push -u origin main
```

### Step 4: Enable GitHub Pages
1. On GitHub, navigate to your repository's **Settings** tab.
2. In the left sidebar under *Code and automation*, click **Pages**.
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` (or `master`).
   - **Folder**: Select `/ (root)`.
4. Click **Save**.

### Step 5: Verify Deployment
1. Wait 1–2 minutes for GitHub Actions to complete the deployment.
2. Refresh the Pages settings page. You will see a banner:
   ```
   Your site is live at https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
   ```
3. Click the link to open your live application!

---

## 3. Important GitHub Pages Considerations

### Relative Paths & Repository Subpath
When hosted on GitHub Pages under a subpath like `https://username.github.io/goalfinity-assessment/`, root-relative paths like `/assets/css/styles.css` would fail by attempting to fetch from `https://username.github.io/assets/css/styles.css`.

This codebase strictly utilizes **relative paths** (e.g., `assets/css/styles.css`, `assets/js/config.js`). It will function properly whether hosted at a root custom domain (`assessment.goalfinity.in`) or a GitHub repository subpath.

### The `.nojekyll` File
GitHub Pages runs a Jekyll build processor by default that ignores files starting with underscores or specific extensions. The included `.nojekyll` file at the root disables this processing, ensuring that all assets and scripts are served directly.

### Custom 404 Redirect
The included `404.html` page catches any missing route or bookmark error and provides a branded screen directing counsellors back to `index.html`.

---

## 4. Configuring a Custom Domain (Optional)

If Goalfinity Institute owns a custom domain (e.g., `assess.goalfinity.in`):
1. In repository **Settings** &rarr; **Pages** &rarr; **Custom domain**, enter your domain name.
2. In your DNS provider (Cloudflare, GoDaddy, Route 53):
   - Add a `CNAME` record pointing `assess` to `YOUR-USERNAME.github.io`.
3. Check the box for **Enforce HTTPS**.

---

## 5. Updating the Live Application

Whenever you modify any code or update `assets/js/config.js` with a new Google Apps Script URL:
```bash
git add .
git commit -m "Update Apps Script endpoint configuration"
git push origin main
```
GitHub Pages will automatically rebuild and deploy the latest changes within 60–90 seconds.
