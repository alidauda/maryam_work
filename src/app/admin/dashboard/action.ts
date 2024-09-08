"use server";

import { lucia, validateRequest } from "@/utils/auth";
import { cookies } from "next/headers";

export async function logout() {
  const { session } = await validateRequest();
  if (!session) {
    throw new Error("no session found");
  }

  await lucia.invalidateSession(session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
}
