"use client";
import { MotionValue, motion, useTransform } from "framer-motion";

export default function Overlay({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
    // Section 1: 0% - 20%
    const opacity1 = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

    // Section 2: 20% - 50%
    const opacity2 = useTransform(scrollYProgress, [0.2, 0.3, 0.5, 0.6], [0, 1, 1, 0]);
    const y2 = useTransform(scrollYProgress, [0.2, 0.6], [50, -50]);

    // Section 3: 60% - 90%
    const opacity3 = useTransform(scrollYProgress, [0.6, 0.7, 0.9, 1], [0, 1, 1, 0]);
    const y3 = useTransform(scrollYProgress, [0.6, 1], [50, -50]);

    return (
        <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-center w-full h-full max-w-7xl mx-auto px-6">

            {/* Section 1: Intro */}
            <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute self-center text-center">
                <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mix-blend-difference bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Qamar Zaka
                </h1>
                <p className="mt-4 text-xl md:text-2xl font-light text-gray-300">
                    UI/UX Designer & Developer
                </p>
            </motion.div>

            {/* Section 2: Statement */}
            <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute self-start text-left max-w-2xl">
                <h2 className="text-5xl md:text-7xl font-bold leading-tight text-white mb-6">
                    <span className="text-purple-400">2 Years</span> of Experience.
                </h2>
                <p className="text-lg text-gray-400">
                    Specializing in creating intuitive and beautiful digital products.
                </p>
            </motion.div>

            {/* Section 3: Philosophy */}
            <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute self-end text-right max-w-2xl">
                <h2 className="text-5xl md:text-7xl font-bold leading-tight text-white mb-6">
                    Bridging <span className="text-blue-400">design</span> & code.
                </h2>
                <p className="text-lg text-gray-400">
                    Crafting seamless interactions that tell a story.
                </p>
            </motion.div>

        </div>
    );
}
