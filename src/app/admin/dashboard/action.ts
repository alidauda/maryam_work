"use server";

import { lucia, validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { startOfDay, subDays } from "date-fns";
import { cookies } from "next/headers";

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    throw new Error("no session found");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}

export async function fetchBookingData(timeRange: string) {
  const endDate = startOfDay(new Date());
  const startDate = subDays(endDate, parseInt(timeRange));

  const bookings = await prisma.booking.groupBy({
    by: ["startDate"],
    _count: {
      id: true,
    },
    where: {
      startDate: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return bookings.map((booking) => ({
    date: booking.startDate.toISOString().split("T")[0],
    bookings: booking._count.id,
  }));
}
