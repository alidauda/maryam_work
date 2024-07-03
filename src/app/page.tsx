import Image from "next/image";
import { validateRequest } from "../utils/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }
  if (user.role == "ADMIN") {
    return redirect("/dashboard");
  }
  return <h1>Hi, {user.role}!</h1>;
}
