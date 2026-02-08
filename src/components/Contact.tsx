"use client";
import { motion } from "framer-motion";

export default function Contact() {
    return (
        <section className="relative py-20 px-6 bg-background text-center z-20">
            <div className="max-w-3xl mx-auto">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold text-white mb-8"
                >
                    Let&apos;s Work Together
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-gray-400 text-lg md:text-xl mb-12"
                >
                    Have a project in mind? Reach out and let&apos;s create something amazing.
                </motion.p>

                <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">

                    {/* Email */}
                    <motion.a
                        href="mailto:zakaqamar3@gmail.com"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full md:w-auto min-w-[280px]"
                    >
                        <div className="p-4 rounded-full bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Email Me</p>
                            <p className="text-xl font-medium text-white">zakaqamar3@gmail.com</p>
                        </div>
                    </motion.a>

                    {/* Phone */}
                    <motion.a
                        href="tel:+923434674134"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="group flex flex-col items-center gap-4 p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors w-full md:w-auto min-w-[280px]"
                    >
                        <div className="p-4 rounded-full bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 0 0 6 3.75v16.5a2.25 2.25 0 0 0 2.25 2.25h7.5A2.25 2.25 0 0 0 18 20.25V3.75a2.25 2.25 0 0 0-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Call Me</p>
                            <p className="text-xl font-medium text-white">0343 4674134</p>
                        </div>
                    </motion.a>

                </div>
            </div>
        </section>
    );
}
