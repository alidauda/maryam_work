"use server";

import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { PropertyStatus } from "@prisma/client";
import { redirect } from "next/navigation";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
export async function getItemtoEdit(slug: string) {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const property = await prisma.property.findUnique({
    where: {
      id: parseInt(slug),
    },
    include: {
      images: true,
    },
  });
  if (!property) {
    throw new Error("Property not found");
  }
  return property;
}

interface Props {
  property: {
    id: number;
    name: string;
    description: string;
    status: string;
    address: string;

    images: {
      id: number;
      url: string;
    }[];
  };
  data: FormData;
}

export async function updateProperty(data: Props) {
  try {
    const { user } = await validateRequest();

    if (!user) {
      throw new Error("Unauthorized");
    }

    const formData = data.data;
    const files = formData.getAll("file") as File[];

    const property = await prisma.property.findUnique({
      where: {
        id: data.property.id,
      },
      include: {
        images: true,
      },
    });

    if (!property) {
      throw new Error("Property not found");
    }

    // Prepare update data

    // Handle image updates
    if (files.length > 0) {
      const uploadResults = await utapi.uploadFiles(files);
      if (uploadResults.some((result) => result.error)) {
        throw new Error("Error uploading files");
      }

      const newImages = uploadResults.map((result) => ({
        url: result.data?.url,
      }));
      const image = await prisma.images.createMany({
        data: newImages
          .filter((image) => image.url !== undefined)
          .map((image) => ({
            propertyId: property.id,
            url: image.url!,
          })),
      });
    }

    // Update the property
    const updatedProperty = await prisma.property.update({
      where: {
        id: property.id,
      },
      data: {
        name: data.property.name,
        description: data.property.description,
        status: data.property.status as PropertyStatus,
        address: data.property.address,
        images: {
          connect: data.property.images,
        },
      },
      include: {
        images: true,
      },
    });
    console.log("Updated property:", updatedProperty);
  } catch (err) {
    console.log(err);
  }
  redirect("/admin/dashboard/property");
}
