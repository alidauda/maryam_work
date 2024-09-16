import prisma from "@/utils/db";
import { validateRequest } from "../auth";
import { redirect } from "next/navigation";

export async function get_total_count() {
  const data = await prisma.$transaction([
    prisma.property.count(),
    prisma.room.count(),
    prisma.booking.count(),
    prisma.room.count({ where: { status: "AVAILABLE" } }),
  ]);
  return data;
}

export function get_all_apartment() {
  return prisma.property.findMany({
    include: {
      images: true,
      rooms: true,
    },
  });
}

export async function get_rooms(id: number) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("no user");
  }
  const preference = await prisma.preference.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (!preference) {
    redirect("/preference");
  }
  const data = await prisma.property.findUnique({
    where: {
      id,
    },
    include: {
      rooms: true,
      images: true,
    },
  });

  return {
    data,
  };
}
