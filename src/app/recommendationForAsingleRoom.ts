"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";

export async function getSingleRoomRecommendation(
  propertyId: string,
  roomId: string
) {
  // Step 1: Validate user and get their preferences
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("No user found");
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
    throw new Error("User not found");
  }

  if (!me.preference) {
    redirect("/preference");
  }

  // Step 2: Fetch the single room from the database
  const room = await prisma.room.findUnique({
    where: {
      id: parseInt(roomId),
      propertyId: parseInt(propertyId),
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

  if (!room) {
    throw new Error("Room not found");
  }

  // Step 3: Calculate match percentages for each roommate
  const roommates = room.currentOccupants.map((occupant) => ({
    ...occupant,
    matchPercentages: calculateMatchPercentages(
      me.preference!,
      occupant.preference!
    ),
  }));

  // Step 4: Format the response
  const recommendedRoom = {
    me,
    ...room,
    roommates,
  };

  return recommendedRoom;
}

type Preference = {
  id: number;
  cleanliness: number;
  sleepSchedule: number;
  quietness: number;
  socialness: number;
};

// Calculate match percentages for overall and individual preferences
const calculateMatchPercentages = (
  userPreferences: Preference,
  roommatePreferences: Preference
) => {
  const calculatePreferenceMatch = (userPref: number, roommatePref: number) => {
    const difference = Math.abs(userPref - roommatePref);
    return Math.round((1 - difference / 10) * 100); // 10 is the max difference
  };

  const cleanlinessMatch = calculatePreferenceMatch(
    userPreferences.cleanliness,
    roommatePreferences.cleanliness
  );
  const quietnessMatch = calculatePreferenceMatch(
    userPreferences.quietness,
    roommatePreferences.quietness
  );
  const socialnessMatch = calculatePreferenceMatch(
    userPreferences.socialness,
    roommatePreferences.socialness
  );

  const overallMatch = Math.round(
    (cleanlinessMatch + quietnessMatch + socialnessMatch) / 3
  );

  return {
    overall: overallMatch,
    cleanliness: cleanlinessMatch,
    quietness: quietnessMatch,
    socialness: socialnessMatch,
  };
};
