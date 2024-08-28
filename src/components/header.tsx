import { validateRequest } from "@/utils/auth";
import { Home, MountainIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { logout } from "@/app/logout";

export default async function Header() {
  const { user } = await validateRequest();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link className="flex items-center" href="/">
            <Home className="h-8 w-8 text-purple-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">
              RoommateFinder
            </span>
          </Link>
          <nav className="hidden md:flex space-x-8 md:justify-center md:items-center">
            <Link
              href="/apartment"
              className="text-gray-500 hover:text-gray-900"
              prefetch={false}
            >
              Apartment
            </Link>
            {user && user.role === "ADMIN" ? (
              <Link
                href="/admin/dashboard"
                className="text-gray-500 hover:text-gray-900"
                prefetch={false}
              >
                Admin DashBoard
              </Link>
            ) : (
              <Link
                href="/mydashboard"
                className="text-gray-500 hover:text-gray-900"
                prefetch={false}
              >
                My DashBoard
              </Link>
            )}

            {user && !user.id && (
              <Link
                href="/register"
                className="text-gray-500 hover:text-gray-900"
                prefetch={false}
              >
                SignUp
              </Link>
            )}
            {user ? (
              <form action={logout}>
                <Button variant="default" type="submit">
                  Log Out
                </Button>
              </form>
            ) : (
              <Link
                href="/login"
                className="text-gray-500 hover:text-gray-900"
                prefetch={false}
              >
                Login
              </Link>
            )}
          </nav>
          <Button className="md:hidden">Menu</Button>
        </div>
      </div>
    </header>
  );
}
