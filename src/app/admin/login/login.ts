"use server";
import prisma from "@/utils/db";
import { UserRole } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/utils/auth";
import { redirect } from "next/navigation";
import { generateIdFromEntropySize } from "lucia";

interface ActionResult {
  error: string;
}

export async function signup(formData: FormData) {
  console.log(formData.get("email"));
  const email = formData.get("email");

  // username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
  // keep in mind some database (e.g. mysql) are case insensitive
  if (typeof email !== "string" || email.length < 3 || email.length > 31) {
    return {
      error: "Invalid username",
    };
  }
  const password = formData.get("password");
  if (
    typeof password !== "string" ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: "Invalid password",
    };
  }

  const passwordHash = await hash(password, {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
  const userId = generateIdFromEntropySize(10); // 16 characters long

  // TODO: check if username is already used
  //
  try {
    await prisma.user.create({
      data: {
        id: userId,
        email,
        password: passwordHash,
        name: "admin",
        role: UserRole.ADMIN,
      },
    });
    console.log("user created");

    const session = await lucia.createSession(userId, {
      role: UserRole.ADMIN,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    console.log(e);
  }
  return redirect("/admin/dashboard");
}
