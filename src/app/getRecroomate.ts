"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { $Enums } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getFilteredRoomRecommendations(id: string) {
  // Step 1: Filter by Budget and Availability
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("no user found");
  }

  const me = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      preference: true,
    },
  });
  if (!me) {
    throw new Error("me not found");
  }
  if (!me.preference) {
    redirect("/preference");
  }

  const availableRooms = await prisma.room.findMany({
    where: {
      propertyId: parseInt(id),

      availableSpots: { gt: 0 },
      status: "AVAILABLE",
    },
    include: {
      property: true,
      currentOccupants: {
        include: {
          preference: true,
        },
      },
    },
  });

  const rankedRooms = availableRooms.map((room) => {
    const matchPercentage = calculateMatchPercentage(
      me.preference!,
      room.currentOccupants.map((occupant) => occupant.preference!)
    );

    return {
      ...room,
      matchPercentage,
    };
  });

  rankedRooms.sort((a, b) => b.matchPercentage - a.matchPercentage);
  setTimeout(() => {}, 4000);

  return rankedRooms;
}

type preference = {
  id: number;
  cleanliness: number;
  sleepSchedule: number;
  quietness: number;
  socialness: number;
};

// Calculate match percentage based on preferences
const calculateMatchPercentage = (
  userPreferences: preference,
  roomOccupants: preference[]
) => {
  if (roomOccupants.length === 0) return 100; // Perfect match for empty room

  const totalDifference = roomOccupants.reduce((sum, occupant) => {
    const cleanDiff = Math.abs(
      userPreferences.cleanliness - occupant.cleanliness
    );
    const quietDiff = Math.abs(userPreferences.quietness - occupant.quietness);
    const socialDiff = Math.abs(
      userPreferences.socialness - occupant.socialness
    );
    const sleepSchedule = Math.abs(
      userPreferences.sleepSchedule - occupant.sleepSchedule
    );
    return sum + cleanDiff + quietDiff + socialDiff + sleepSchedule;
  }, 0);

  const maxPossibleDifference = roomOccupants.length * 40; // 10 points max difference per preference, 3 preferences
  const matchPercentage = 100 - (totalDifference / maxPossibleDifference) * 100;
  return Math.round(matchPercentage);
};
