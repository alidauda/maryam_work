import { User } from "@prisma/client";
import prisma from "./db";
import { validateRequest } from "./auth";

async function recommendRoommates(
  userId: string,
  minMatchingPreferences: number = 2
): Promise<User[]> {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized: User not logged in");
  }
  const roommates = await prisma.user.findMany({
    where: {
      id: {
        not: userId,
      },
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
