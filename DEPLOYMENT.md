# 🚀 Deployment Guide: Publishing Your Portfolio for Free

This guide will show you how to put your "Scrollytelling" portfolio on the internet so anyone can visit it. We will use **Vercel** (the creators of Next.js), which is free for personal projects.

## Prerequisite: GitHub
You need a GitHub account to store your code.
1.  If you don't have one, sign up at [github.com](https://github.com/).
2.  Download and install [Git](https://git-scm.com/downloads) if you haven't already.

---

## Phase 1: Upload Code to GitHub

1.  **Log in to GitHub** and click the **+** icon (top right) -> **New repository**.
2.  Name it `portfolio` (or whatever you like).
3.  Make it **Public**.
4.  **Do NOT** check "Add a README file" (we already have one).
5.  Click **Create repository**.
6.  You will see a page with commands. Keep this open.

Now, open your **Terminal** (PowerShell or VS Code) in your `portfolio` project folder:

```powershell
# 1. Initialize Git
git init

# 2. Add all your files
git add .

# 3. Save the changes
git commit -m "Initial portfolio launch"

# 4. Link to your GitHub (Replace URL with YOUR repository link from step 6 above)
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git

# 5. Switch to main branch
git branch -M main

# 6. Upload
git push -u origin main
```

*(If it asks you to sign in, a browser window should pop up. Follow the prompts.)*

---

## Phase 2: Deploy on Vercel

1.  Go to [vercel.com](https://vercel.com/) and **Sign Up**.
    *   Choose **"Continue with GitHub"**.
2.  On your dashboard, click **"Add New..."** -> **"Project"**.
3.  You should see your new `portfolio` repository in the list. Click **Import**.
4.  **Configure Project:**
    *   **Framework Preset:** Next.js (Default)
    *   **Root Directory:** `./` (Default)
    *   **Build Command:** `next build` (Default)
5.  **Environment Variables** (Crucial Step):
    *   Click the arrow to expand **Environment Variables**.
    *   Add the keys from your local `.env` file here.
    *   *Note: If you haven't set up the Database/Google Login yet, you can skip this for now. The site will work, but the "Admin" login won't.*
    *   **Required for Admin:** `DATABASE_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ADMIN_EMAIL`, `NEXTAUTH_SECRET`.
6.  Click **Deploy**.

---

## Phase 3: Success!

Wait about 1-2 minutes. Vercel will build your site.
When it's done, you'll see a confetti screen! 🎉

Click the **Visit** button. You now have a live URL like:
`https://portfolio-qamar-zaka.vercel.app`

---

## Phase 4: Setting up the Database (Optional - For Admin Panel)

If you want the **Admin Panel** to work online so you can update projects without coding:

1.  **Create a cloud database** on [Neon.tech](https://neon.tech/) (Free) or Vercel Postgres.
2.  Copy the connection string (`postgres://...`).
3.  Go to your project on **Vercel -> Settings -> Environment Variables**.
4.  Add a new key `DATABASE_URL` with your connection string.
5.  Redeploy your project (Go to **Deployments** -> Click the 3 dots on the latest one -> **Redeploy**).

Now your live site has a working CMS!
