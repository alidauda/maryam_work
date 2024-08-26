"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";

import { zfd } from "zod-form-data";

const schema = zfd.formData({
  gender: zfd.text(),
  sleepSchedule: zfd.numeric(),
  cleanliness: zfd.numeric(),

  price: zfd.text(),
  quietness: zfd.numeric(),
  socialness: zfd.numeric(),
});
export async function createPreference(formData: FormData) {
  try {
    const dataObject = schema.safeParse(formData);

    if (!dataObject.success) {
      throw new Error("Invalid data");
    }
    const { data } = dataObject;
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized: User not logged in");
    }
    const activeUser = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
    });
    if (!activeUser) {
      throw new Error("Unauthorized: User not found");
    }
    const newPreference = await prisma.preference.create({
      data: {
        userId: user.id,
        genderPreference: data.gender,
        sleepSchedule: data.sleepSchedule,
        quietness: data.quietness,
        socialness: data.socialness,
        cleanliness: data.cleanliness,
        pricePreference: parseInt(data.price),
      },
    });
    console.log("New preference created:", newPreference);
  } catch (e) {
    console.log(e);
  }
  redirect("/apartment");
}
