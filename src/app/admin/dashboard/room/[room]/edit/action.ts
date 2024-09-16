"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";
import { UTApi } from "uploadthing/server";
import { RoomStatus } from "@prisma/client";

const utapi = new UTApi();

export async function getRoomToEdit(slug: string) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const room = await prisma.room.findUnique({
    where: {
      id: parseInt(slug),
    },
    include: {
      property: true,
    },
  });
  if (!room) {
    throw new Error("Room not found");
  }
  return room;
}

interface UpdateRoomProps {
  room: {
    id: number;
    roomName: string;
    propertyId: number;
    capacity: number;
    availableSpots: number;
    price: number;
    status: RoomStatus;
    imageUrl: string;
  };
  data: FormData;
}

export async function updateRoom(data: UpdateRoomProps) {
  try {
    const { user } = await validateRequest();
    if (!user) {
      throw new Error("Unauthorized");
    }

    const formData = data.data;
    const file = formData.get("file") as File | null;

    const room = await prisma.room.findUnique({
      where: {
        id: data.room.id,
      },
    });

    if (!room) {
      throw new Error("Room not found");
    }

    let imageUrl = data.room.imageUrl;

    // Handle image update
    if (file) {
      const uploadResult = await utapi.uploadFiles([file]);
      if (uploadResult[0].error) {
        throw new Error("Error uploading file");
      }
      imageUrl = uploadResult[0].data?.url || data.room.imageUrl;
    }

    // Update the room
    const updatedRoom = await prisma.room.update({
      where: {
        id: room.id,
      },
      data: {
        roomName: data.room.roomName,
        propertyId: data.room.propertyId,
        capacity: data.room.capacity,
        availableSpots: data.room.availableSpots,
        price: data.room.price,
        status: data.room.status,
        imageUrl: imageUrl,
      },
      include: {
        property: true,
      },
    });
    console.log("Updated room:", updatedRoom);
  } catch (err) {
    console.error(err);
    throw err;
  }
  redirect("/admin/dashboard/room");
}
