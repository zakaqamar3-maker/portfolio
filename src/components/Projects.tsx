"use client";
import { motion } from "framer-motion";

interface Project {
    id?: string;
    title: string;
    description: string;
    tags?: string[];
    imageUrl?: string | null;
    link?: string | null;
}

export default function Projects({ dbProjects = [] }: { dbProjects?: any[] }) {

    // Default static projects if DB is empty
    const defaultProjects: Project[] = [
        {
            title: "FinTech Dashboard",
            description: "Complete UI/UX redesign for a banking data platform.",
            tags: ["Figma", "Product Design"],
        },
        {
            title: "Travel App Interaction",
            description: "Micro-interactions and motion design for a booking app.",
            tags: ["Prototyping", "Motion"],
        },
        {
            title: "E-Commerce System",
            description: "Scaleable design system for a retail giant.",
            tags: ["Design System", "UX Research"],
        },
    ];

    // If we have DB projects, use them. Otherwise show defaults.
    // We need to map DB structure to our UI structure
    const projectsToDisplay = dbProjects.length > 0 ? dbProjects.map(p => ({
        ...p,
        // If tags are stored as string, split them. If array, use as is.
        tags: typeof p.tags === 'string' ? p.tags.split(',') : (p.tags || ["Project"])
    })) : defaultProjects;

    return (
        <div className="relative min-h-screen bg-background py-20 px-6 z-20">
            <div className="max-w-7xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-16 text-center"
                >
                    Selected Works
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projectsToDisplay.map((project, index) => (
                        <motion.div
                            key={project.id || index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-500" />

                            {project.imageUrl && (
                                <div className="mb-4 h-40 overflow-hidden rounded-lg">
                                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
                            <p className="text-gray-400 mb-6">{project.description}</p>

                            <div className="flex flex-wrap gap-2">
                                {(project.tags || []).map((tag: string) => (
                                    <span key={tag} className="px-3 py-1 text-xs font-medium text-white bg-white/10 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
