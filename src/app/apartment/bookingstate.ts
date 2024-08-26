// app/actions/bookings.ts
"use server";

import prisma from "@/utils/db";

export async function checkActiveBooking(userId: string) {
  const activeBooking = await prisma.booking.findFirst({
    where: {
      userId: userId,
      status: "CONFIRMED",
    },
  });

  console.log("Active booking", activeBooking);
  console.log("Has active booking", userId);

  return { hasActiveBooking: !!activeBooking };
}
