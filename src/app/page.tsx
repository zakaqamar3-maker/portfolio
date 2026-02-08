import ScrollyCanvas from "@/components/ScrollyCanvas";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Disable caching for dynamic content (optional, or use revalidate)
export const dynamic = 'force-dynamic';

export default async function Home() {
    // Try to fetch projects from DB, fallback to empty array if DB not set up
    let projects = [];
    try {
        projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch {
        console.warn("Database not connected or schema mismatch. Using default.");
    }

    return (
        <main className="bg-background min-h-screen">
            <ScrollyCanvas />

            {/* Pass DB projects to the component */}
            <Projects dbProjects={projects} />

            {/* Contact Section */}
            <Contact />

            {/* Footer */}
            <footer className="py-12 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} Qamar Zaka. All rights reserved.</p>
                <a href="/admin" className="text-gray-700 hover:text-gray-500 ml-4 text-xs">Admin Login</a>
            </footer>
        </main>
    );
}
