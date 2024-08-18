import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { get_all_apartment } from "@/utils/data/page";
import { MountainIcon } from "lucide-react";
import Link from "next/link";

export default async function Apartment() {
  const apartments = await get_all_apartment();
  return (
    <div className="flex flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
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

          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            signup
          </Link>
        </nav>
      </header>
      <main className="grid grid-cols-3  gap-4 px-32">
        {apartments &&
          apartments.map((apartment) => (
            <Card key={apartment.id}>
              <CardHeader>
                <CardTitle>{apartment.name}</CardTitle>
                <CardDescription>{apartment.address}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={apartment.images[0].url!} className="w-full h-64" />
                <div></div>
              </CardContent>
              <CardFooter>
                <Link
                  href={`/apartment/${apartment.id}`}
                  className="px-5 py-2 rounded bg-black text-white"
                >
                  View
                </Link>
              </CardFooter>
            </Card>
          ))}
      </main>
    </div>
  );
}
