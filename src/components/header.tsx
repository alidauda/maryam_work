import { validateRequest } from "@/utils/auth";
import { MountainIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { logout } from "@/app/logout";
export default async function Header() {
  const { user } = await validateRequest();
  return (
    <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link
        href="/"
        className="flex items-center justify-center"
        prefetch={false}
      >
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Acme Accommodations</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 justify-center items-center">
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
        ) : (
          <Link
            href="/mydashboard"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            My DashBoard
          </Link>
        )}

        {user && !user.id ? (
          <Link
            href="/register"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            SignUp{" "}
          </Link>
        ) : (
          ""
        )}

        {user && user ? (
          <form action={logout}>
            <Button variant={"default"} type="submit">
              Log Out{" "}
            </Button>
          </form>
        ) : (
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            login
          </Link>
        )}
      </nav>
    </header>
  );
}
