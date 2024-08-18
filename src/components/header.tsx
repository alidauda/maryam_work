import { validateRequest } from "@/utils/auth";
import { MountainIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function Header() {
  const { user } = await validateRequest();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center shadow-2xl">
      <Link
        href="/"
        className="flex items-center justify-center"
        prefetch={false}
      >
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Acme Accommodations</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          href="/apartment"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          Apartment
        </Link>
        {user && user.role === "ADMIN" ? (
          <Link
            href="/admin/dashboard"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Admin DashBoard
          </Link>
        ) : null}

        <Link
          href="/register"
          className="text-sm font-medium hover:underline underline-offset-4"
          prefetch={false}
        >
          signup
        </Link>
        <Button variant={"default"}>Log Out</Button>
      </nav>
    </header>
  );
}
