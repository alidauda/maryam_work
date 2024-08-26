"use server";
"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { zfd } from "zod-form-data";
import { UTApi } from "uploadthing/server";
const utapi = new UTApi();
// Define the schema using zod-form-data
const roomSchema = zfd.formData({
  name: zfd.text(),
  property: zfd.numeric(),
  price: zfd.numeric(),
  capacity: zfd.numeric(),
  availableroom: zfd.numeric(),
  image: zfd.file(),
});

export async function createRoom(formData: FormData) {
  try {
    const { user: userId } = await validateRequest();
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId?.id,
        role: UserRole.ADMIN,
      },
    });

    if (!user) {
      throw new Error("Unauthorized: Only admins can create rooms");
    }

    // Parse and validate the form data
    const validatedData = roomSchema.parse(formData);

    // Handle file upload
    let imageUrl = null;
    if (validatedData.image) {
      try {
        const uploadResults = await utapi.uploadFiles([validatedData.image]);
        if (uploadResults[0]?.data?.url) {
          imageUrl = uploadResults[0].data.url;
        } else {
          throw new Error("File upload failed");
        }
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        throw new Error("File upload failed");
      }
    }

    const newRoom = await prisma.room.create({
      data: {
        roomName: validatedData.name,
        price: validatedData.price,
        capacity: validatedData.capacity,
        availableSpots: validatedData.availableroom,
        propertyId: validatedData.property,
        imageUrl: imageUrl!,
      },
    });

    revalidatePath("/dashboard/room");
    return newRoom;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export const getRooms = async () => {
  try {
    const { user: userId } = await validateRequest();
    if (!userId) throw new Error("no user logged in");
    const user = await prisma.user.findUnique({
      where: {
        id: userId?.id,
      },
    });
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    const room = await prisma.room.findMany({
      include: {
        property: {
          select: {
            name: true,
          },
        },
      },
    });
    return room;
  } catch (e) {
    throw e;
  } finally {
    await prisma.$disconnect();
  }
};
export async function getPropertyname() {
  try {
    const { user: userId } = await validateRequest();
    if (!userId) {
      throw new Error("Unauthorized: User not logged in");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId?.id,
      },
    });
    if (!user) {
      throw new Error("Unauthorized: User not found");
    }

    const property = await prisma.property.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return property;
  } catch (e) {
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}
