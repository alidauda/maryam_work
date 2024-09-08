"use server";
import prisma from "@/utils/db";

export async function get_all_apartment() {
 
  return prisma.property.findMany({
    include: {
      images: true,
      rooms: true,
    },
  });
}
