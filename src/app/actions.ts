"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth"; // Use auth helper

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
    const imageUrl = formData.get("imageUrl") as string;
    // const tags = formData.get("tags") as string; 

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
