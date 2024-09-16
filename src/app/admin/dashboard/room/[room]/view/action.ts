"use server";
import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";

export async function viewRooms(id: string) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const room = await prisma.room.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      currentOccupants: {
        select: {
          id: true,
          email: true,
          gender: true,
          phoneNumber: true,
          name: true,
          bookings: true,
        },
      },
      bookings: {
        select: {
          id: true,
          startDate: true,
          endDate: true,
          user: true,
        },
      },
      property: true,
    },
  });
  if (!room) {
    throw new Error("Property not found");
  }
  return room;
}
