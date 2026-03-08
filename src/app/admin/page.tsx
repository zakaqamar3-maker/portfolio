import { auth } from "@/auth"; // Use the auth helper from src/auth.ts
import { redirect } from "next/navigation";
import { addProject, updateProfile, deleteProject } from "../actions";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AdminPage() {
    const session = await auth();

    // 1. Security Check: Redirect if not logged in or not admin
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/api/auth/signin");
    }

    let projects: any[] = [];
    try {
        projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch {
        console.warn("Database not connected or schema mismatch.");
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400">Logged in as {session.user?.email}</span>
                        {/* Logout button would go here */}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Section 1: Add Project */}
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-6">Add New Project</h2>
                        <form action={addProject} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Project Title</label>
                                <input name="title" type="text" className="w-full bg-white/10 p-3 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500" required />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea name="description" rows={4} className="w-full bg-white/10 p-3 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500" required />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Project Screenshot</label>
                                <input name="image" type="file" accept="image/*" className="w-full bg-white/10 p-3 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 text-gray-400" />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Project Link</label>
                                <input name="link" type="text" placeholder="https://..." className="w-full bg-white/10 p-3 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500" />
                            </div>

                            <button type="submit" className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                Publish Project
                            </button>
                        </form>
                    </div>

                    {/* Section 2: Update Profile */}
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
                        <form action={updateProfile} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Bio / About Me</label>
                                <textarea name="bio" rows={6} className="w-full bg-white/10 p-3 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500" placeholder="I am a Creative Developer..." />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Experience (Markdown/Text)</label>
                                <textarea name="experience" rows={6} className="w-full bg-white/10 p-3 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500" placeholder="2 Years at..." />
                            </div>

                            <button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                Update Profile
                            </button>
                        </form>
                    </div>
                </div>
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">Manage Projects</h2>
                    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
                        {projects.length === 0 ? (
                            <p className="p-8 text-gray-400 text-center">No projects found.</p>
                        ) : (
                            <ul className="divide-y divide-white/10">
                                {projects.map((proj) => (
                                    <li key={proj.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-4">
                                            {proj.imageUrl && (
                                                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                                    <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-white">{proj.title}</h3>
                                                <p className="text-sm text-gray-400 line-clamp-1">{proj.description}</p>
                                            </div>
                                        </div>
                                        <form action={deleteProject}>
                                            <input type="hidden" name="id" value={proj.id} />
                                            <button type="submit" className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                                                Delete
                                            </button>
                                        </form>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
