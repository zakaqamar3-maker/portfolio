import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const providers = [];

// Safely add Google Provider only if keys exist.
// This prevents NextAuth from crashing if you haven't set up .env yet.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }));
} else {
    // Warn but don't crash
    console.warn("⚠️  Google Client ID/Secret missing in .env. Authentication disabled for now.");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers,
    callbacks: {
        async signIn({ user }) {
            if (!process.env.ADMIN_EMAIL) return false;
            return user.email === process.env.ADMIN_EMAIL;
        },
    },
    // If no secret provided, use a dummy one for dev to prevent crash. (Production requires real secret)
    secret: process.env.NEXTAUTH_SECRET || "dev_secret_fallback_123",
});
