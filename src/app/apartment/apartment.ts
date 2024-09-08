"use server";
import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";

export async function get_all_apartment() {
  const session = await validateRequest();
  if (session.user) {
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
    return prisma.property.findMany({
      where: {
        gender: user?.gender,
      },

      include: {
        images: true,
        rooms: true,
      },
    });
  }
  return prisma.property.findMany({
    include: {
      images: true,
      rooms: true,
    },
  });
}
