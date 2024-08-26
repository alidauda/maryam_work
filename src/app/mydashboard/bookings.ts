// app/actions/bookings.ts
"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";

export async function bookings() {
  const { user } = await validateRequest();
  if (!user) {
    redirect("/login");
  }
  const activeBooking = await prisma.booking.findFirst({
    where: {
      userId: user.id,
      status: "CONFIRMED",
    },
    include: {
      room: {
        include: {
          property: true,
        },
      },
    },
  });
  console.log("Active booking", activeBooking);
  return { activeBooking };
}
