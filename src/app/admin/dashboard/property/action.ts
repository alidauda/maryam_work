"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";

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
        images: true,
      },
    });

    return property;
  } catch (e) {
    throw e;
  }
}

export async function deleteProperty(id: string) {
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

    const property = await prisma.property.delete({
      where: {
        id: parseInt(id),
      },
    });

    return property;
  } catch (e) {
    throw e;
  }
}
