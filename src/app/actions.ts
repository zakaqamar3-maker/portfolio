"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; // Use auth helper
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

// Check if current user is admin
async function isAdmin() {
    const session = await auth();
    return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function addProject(formData: FormData) {
    if (!(await isAdmin())) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    let imageUrl = null;
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const result = await new Promise<UploadApiResponse | undefined>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "portfolio_projects" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        if (result) {
            imageUrl = result.secure_url;
        }
    }

    await prisma.project.create({
        data: {
            title,
            description,
            imageUrl,
            link: formData.get("link") as string,
        },
    });

    revalidatePath("/");
    revalidatePath("/admin");
}

export async function updateProfile(formData: FormData) {
    if (!(await isAdmin())) {
        throw new Error("Unauthorized");
    }

    const bio = formData.get("bio") as string;
    const experience = formData.get("experience") as string;

    const existing = await prisma.profile.findFirst();

    if (existing) {
        await prisma.profile.update({
            where: { id: existing.id },
            data: { bio, experience }
        });
    } else {
        await prisma.profile.create({
            data: { bio, experience, email: process.env.ADMIN_EMAIL! }
        });
    }

    revalidatePath("/");
}

export async function deleteProject(formData: FormData) {
    if (!(await isAdmin())) {
        throw new Error("Unauthorized");
    }

    const id = formData.get("id") as string;

    if (id) {
        await prisma.project.delete({
            where: { id }
        });
    }

    revalidatePath("/");
    revalidatePath("/admin");
}
