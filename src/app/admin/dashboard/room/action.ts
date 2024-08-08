"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { room_schema } from "./modal";
import { revalidatePath } from "next/cache";

export async function createRoom(data: z.infer<typeof room_schema>) {
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

    const newProperty = await prisma.room.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseInt(data.price),
        capacity: parseInt(data.capacity),
        availableRoom: parseInt(data.availableroom),
        propertyId: parseInt(data.property),
      },
    });
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
  revalidatePath("/dashboard/room");
  // Check if the user is an admin
}

export const getRooms = async () => {
  try {
    const { user: userId } = await validateRequest();
    if (!userId) throw new Error("no user logged in");
    const user = await prisma.user.findUnique({
      where: {
        id: userId?.id,
      },
    });
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    const room = await prisma.room.findMany({
      include: {
        property: {
          select: {
            name: true,
          },
        },
      },
    });
    return room;
  } catch (e) {
    throw e;
  } finally {
    await prisma.$disconnect();
  }
};
export async function getPropertyname() {
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
      select: {
        id: true,
        name: true,
      },
    });

    return property;
  } catch (e) {
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}
