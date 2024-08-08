/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/9jr5mmFoq9d
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Archivo } from 'next/font/google'
import { IBM_Plex_Sans } from 'next/font/google'

archivo({
  subsets: ['latin'],
  display: 'swap',
})

ibm_plex_sans({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import Link from "next/link";
import { JSX, SVGProps } from "react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Acme Accommodations</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Accommodations
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

      <main className="flex-1">
        <section className="w-full h-screen relative overflow-hidden">
          <img
            src="/images.jpeg"
            width={1920}
            height={1080}
            alt="Hero"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ aspectRatio: "1920/1080", objectFit: "cover" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="relative h-full flex flex-col items-center justify-center px-4 md:px-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tighter text-primary-foreground sm:text-5xl md:text-6xl">
              Discover Your Dream Getaway
            </h1>
            <p className="max-w-[700px] text-primary-foreground md:text-xl">
              Explore our collection of luxurious accommodations in the most
              breathtaking destinations around the world.
            </p>
            <Link
              href="/preference"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Browse Accommodations
            </Link>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; 2024 Acme Accommodations. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

function MountainIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}
