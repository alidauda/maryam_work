// app/actions/bookings.ts
"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";

export async function checkActiveBooking() {
  const session = await validateRequest();
  if (!session.user) {
    throw new Error("Unauthorized: User not logged in");
  }
  const activeBooking = await prisma.booking.findFirst({
    where: {
      userId: session.user.id,
      status: "CONFIRMED",
    },
  });

  return { hasActiveBooking: !!activeBooking };
}
