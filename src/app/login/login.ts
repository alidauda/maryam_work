"use server";
import prisma from "@/utils/db";
import { UserRole } from "@prisma/client";

import { cookies } from "next/headers";
import { lucia } from "@/utils/auth";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import { z } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

type LoginType = z.infer<typeof loginSchema>;

export async function login(data: LoginType) {
  try {
    const { email, password } = loginSchema.parse(data);
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        role: UserRole.GUEST,
      },
    });
    if (!user) {
      throw new Error("Incorrect username or password");
    }
    const validPassword = await verify(user.password, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    if (!validPassword) {
      throw new Error("Incorrect username or password");
    }
    const session = await lucia.createSession(user.id, {
      role: user.role,
      email: user.email,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      throw new Error(`Validation error: ${errors}`);
    }
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new Error("Incorrect username or password");
      }
      throw e;
    }
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error("An unexpected error occurred");
  }
}

// 16 characters long

// TODO: check if username is already used
//

export async function admin(data: LoginType) {
  try {
    const { email, password } = loginSchema.parse(data);
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        role: UserRole.ADMIN,
      },
    });
    if (!user) {
      throw new Error("Incorrect username or password");
    }
    const validPassword = user.password === password;
    if (!validPassword) {
      throw new Error("Incorrect username or password");
    }
    const session = await lucia.createSession(user.id, {
      role: user.role,
      email: user.email,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      throw new Error(`Validation error: ${errors}`);
    }
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2025") {
        throw new Error("Incorrect username or password");
      }
      throw e;
    }
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error("An unexpected error occurred");
  }
}
