"use server";
import { z } from "zod";
import prisma from "@/utils/db";
import { UserRole } from "@prisma/client";
import { hash } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/utils/auth";
import { generateIdFromEntropySize } from "lucia";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(255),
});
type SignupFormData = z.infer<typeof signupSchema>;
export async function signup(data: SignupFormData) {
  try {
    const { email, password } = signupSchema.parse(data);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    const userId = generateIdFromEntropySize(10);

    const user = await prisma.user.create({
      data: {
        id: userId,
        email,
        password: passwordHash,

        role: UserRole.GUEST,
      },
    });

    const session = await lucia.createSession(userId, {
      role: user.role,
      email,
    });
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return { success: true, message: "Account created successfully" };
  } catch (e) {
    if (e instanceof z.ZodError) {
      const errors = e.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");
      throw new Error(`Validation error: ${errors}`);
    }
    if (e instanceof Error) {
      throw new Error(e.message);
    }
    throw new Error("An unexpected error occurred");
  }
}
