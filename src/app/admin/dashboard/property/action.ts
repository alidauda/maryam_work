"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { schema } from "./modal";

export async function createProperty(data: z.infer<typeof schema>) {
  try {
    const { user: userId } = await validateRequest();
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId?.id,

        role: UserRole.ADMIN,
      },
    });
    if (!user) {
      throw new Error("Unauthorized: Only admins can create all property");
    }

    const newProperty = await prisma.property.create({
      data: { ...data },
    });

    console.log("New property created:", newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }

  revalidatePath("/dashboard/hostel");
  // Check if the user is an admin
}

export async function getPropertyBy() {
  try {
    const { user: userId } = await validateRequest();
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId?.id,
      },
    });
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    const property = await prisma.property.findMany({
      include: {
        rooms: true,
      },
    });

    return property;
  } catch (e) {
    throw e;
  }
}
