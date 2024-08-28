"use server";

import prisma from "@/utils/db";
// Adjust the import path as needed
import { revalidatePath } from "next/cache";
interface PaymentData {
  userId: string;
  roomId: number;
  startDate: Date;
  endDate: Date;
  amount: number;
  paymentData: {
    reference: string;
    transaction: string;
    status: string;
    message: string;
    // You'll need to provide this
  };
}
export async function createBookingAndPayment(paymentData: PaymentData) {
  try {
    const { userId, roomId, startDate, endDate, amount } = paymentData;
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: userId,
        status: "CONFIRMED",
        endDate: { gte: new Date() }, // Check for active bookings
      },
    });

    if (existingBooking) {
      throw new Error("User already has an active booking");
    }
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });
    if (!room) {
      throw new Error("Room not found");
    }
    if (room.availableSpots <= 0) {
      await prisma.room.update({
        where: { id: roomId },
        data: {
          status: "OCCUPIED",
        },
      });
      throw new Error("Room is not available");
    }
    const result = await prisma.$transaction(async (prisma) => {
      // Create the booking
      const booking = await prisma.booking.create({
        data: {
          userId,
          roomId,
          startDate,
          endDate,
          status: "CONFIRMED", // Since payment is successful
        },
      });

      // Create the payment
      const payment = await prisma.payment.create({
        data: {
          amount: amount,
          status: "COMPLETED",
          bookingId: booking.id,
        },
      });

      // Update room availability
      await prisma.room.update({
        where: { id: roomId },
        data: {
          availableSpots: { decrement: 1 },
          currentOccupants: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return { booking, payment };
    });

    revalidatePath("/bookings"); // Adjust the path as needed

    return { success: true, data: result };
  } catch (error) {
    console.error("Error creating booking and payment:", error);
    return { success: false, error: "Failed to create booking and payment" };
  }
}
