# Scrollytelling Portfolio & CMS

## 1. Setup

**Install Node.js** (Required): Download from [nodejs.org](https://nodejs.org/).

Run in terminal:
```bash
npm install
```

## 2. Configuration (For Admin Access)

1.  Rename `.env.example` to `.env`.
2.  **Database**: Setup a free PostgreSQL database (e.g. on Supabase or Neon). Paste the connection string into `DATABASE_URL`.
3.  **Authentication**:
    -   Go to Google Cloud Console -> APIs & Services -> Credentials.
    -   Create OAuth 2.0 Client ID.
    -   Authorized Redirect URI: `http://localhost:3000/api/auth/callback/google`
    -   Copy Client ID and Secret to `.env`.
    -   Set `NEXTAUTH_SECRET` (generate a random string).
    -   **Set `ADMIN_EMAIL` to your Gmail address.**

## 3. Database Setup

Once `.env` is ready:
```bash
npx prisma generate
npx prisma db push
```

## 4. Run

```bash
npm run dev
```

-   **Portfolio**: [http://localhost:3000](http://localhost:3000)
-   **Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin) (Login with your Gmail)
