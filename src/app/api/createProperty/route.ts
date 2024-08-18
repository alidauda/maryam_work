// app/api/createProperty/route.ts

import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/utils/auth";
import prisma from "@/utils/db";
import { UserRole } from "@prisma/client";

import { UTApi } from "uploadthing/server";
import { revalidatePath } from "next/cache";

const utapi = new UTApi();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    console.log("Received form data:", formData);

    // Extract and validate non-file fields
    const fields = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      address: formData.get("address") as string,
    };

    // Authenticate and authorize the user
    const { user: userId } = await validateRequest();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: User not logged in" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId?.id,
        role: UserRole.ADMIN,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: Only admins can create property" },
        { status: 403 }
      );
    }

    // Handle file uploads
    const files = formData.getAll("file") as File[];
    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one file is required" },
        { status: 400 }
      );
    }

    const uploadResults = await utapi.uploadFiles(files);
    if (uploadResults.some((result) => result.error)) {
      return NextResponse.json(
        { error: "Error uploading files" },
        { status: 400 }
      );
    }
    const uploadedUrls = uploadResults
      .map((result) => ({ url: result.data!.url }))
      .filter((url) => url.url);

    // Create new property with uploaded images
    const newProperty = await prisma.property.create({
      data: {
        ...fields,
        images: {
          create: uploadedUrls,
        },
      },
    });

    console.log("Created new property:", newProperty);
    revalidatePath("/dashboard/hostel");
    return NextResponse.json(newProperty);
  } catch (error) {
    console.error("Error creating property:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
