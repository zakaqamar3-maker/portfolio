import { auth } from "@/auth"; // Use the auth helper from src/auth.ts
import { redirect } from "next/navigation";
import { addProject, updateProfile } from "../actions";

export default async function AdminPage() {
    const session = await auth();

    // 1. Security Check: Redirect if not logged in or not admin
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/api/auth/signin");
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
                                <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                                <input name="imageUrl" type="text" placeholder="https://..." className="w-full bg-white/10 p-3 rounded-lg border border-white/10 focus:outline-none focus:border-purple-500" />
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
            </div>
        </div>
    );
}
