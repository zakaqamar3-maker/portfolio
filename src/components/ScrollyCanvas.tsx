"use client";
import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import Overlay from "./Overlay";

export default function ScrollyCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // We have 120 frames: 000.webp to 119.webp
    const frameCount = 120;

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Map scroll (0-1) to frame index (0-119)
    const currentIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const promises = [];

            for (let i = 0; i < frameCount; i++) {
                const promise = new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.src = `/sequence/${i.toString().padStart(3, "0")}.webp`;
                    img.onload = () => resolve(img);
                    img.onerror = () => {
                        console.error("Failed to load frame", i);
                        resolve(img); // Resolve anyway to avoid hanging
                    };
                });
                promises.push(promise);
            }

            const results = await Promise.all(promises);
            setImages(results);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    const renderFrame = (index: number) => {
        const canvas = canvasRef.current;
        if (!canvas || images.length === 0) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Set canvas size to match window for high DPI? 
        // Usually handled by CSS, but for drawing resolution:
        if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth;
        if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;

        const img = images[Math.floor(index)];
        if (!img) return;

        // Object fit cover logic
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
    };

    useMotionValueEvent(currentIndex, "change", (latest) => {
        if (isLoaded) {
            renderFrame(latest);
        }
    });

    // Initial render when loaded
    useEffect(() => {
        if (isLoaded) renderFrame(0);
    }, [isLoaded]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (isLoaded) renderFrame(currentIndex.get());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        // eslint-disable-next-line
    }, [isLoaded]);

    return (
        <div ref={containerRef} className="relative h-[500vh] bg-background">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas ref={canvasRef} className="block w-full h-full" />

                {/* Pass scroll progress to Overlay */}
                <Overlay scrollYProgress={scrollYProgress} />

                {/* Loading Indicator */}
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white z-50">
                        <div className="text-2xl font-light tracking-widest animate-pulse">LOADING SEQUENCE...</div>
                    </div>
                )}
            </div>
        </div>
    );
}
