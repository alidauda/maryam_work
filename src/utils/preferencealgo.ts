import { User } from "@prisma/client";
import prisma from "./db";

async function recommendRoommates(
  userId: string,
  minMatchingPreferences: number = 2
): Promise<User[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.preferences) {
    return [];
  }

  const { gender, cleanliness, sleepSchedule } = user.preferences;

  const roommates = await prisma.user.findMany({
    where: {
      id: { not: userId },
      age: { gte: minAge, lte: maxAge },
      gender: gender,
      cleanliness: { equals: cleanliness },
      sleepSchedule: { equals: sleepSchedule },
    },
    include: {
      wantedRoommatePreferences: true,
    },
  });

  return roommates.filter((roommate) => {
    const matchingPreferences = Object.keys(
      user.wantedRoommatePreferences
    ).filter(
      (key) =>
        user.wantedRoommatePreferences[key] ===
        roommate.wantedRoommatePreferences[key]
    );
    return matchingPreferences.length >= minMatchingPreferences;
  });
}
