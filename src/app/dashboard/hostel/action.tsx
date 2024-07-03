"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

export async function getHostels() {
  const { user: userId } = await validateRequest();
  if (!userId) {
    throw new Error("Unauthorized: User not logged in");
  }
  // Check if the user is an admin
  const user = await prisma.user.findUnique({
    where: { id: userId?.id },
    include: { admin: true },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized: Only admins can view all hostels");
  }

  // Fetch all hostels
  const hostels = await prisma.hostel.findMany();

  return hostels;
}

export async function createHostel(formData: FormData) {
  const name = formData.get("name");
  const { user: userId } = await validateRequest();
  if (!userId) {
    throw new Error("Unauthorized: User not logged in");
  }
  // Check if the user is an admin
  const user = await prisma.user.findUnique({
    where: { id: userId.id },
    include: { admin: true },
  });

  if (!user || user.role !== Role.ADMIN) {
    throw new Error("Unauthorized: Only admins can create hostels");
  }

  // Create the hostel
  const hostel = await prisma.hostel.create({
    data: {
      name: name as string,
      address: "first folor",
      gender: "FEMALE",
    },
  });

  return redirect("/");
}
