import Image from "next/image";
import { validateRequest } from "../utils/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import LandingPage from "@/components/landing-page";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <LandingPage user={user} />
    // <div>
    //   <nav className="flex justify-between px-20 bg-red-300 py-10 shadow-xl  ">
    //     <ul>
    //       <Link href={"#"}>
    //         <li>Home</li>
    //       </Link>
    //     </ul>
    //     {user ? (
    //       <ul className="flex gap-5">
    //         <Link href={"/dashboard"}>
    //           <li>Dashboard</li>
    //         </Link>
    //         <Link href={"/logout"}>
    //           <li>Logout</li>
    //         </Link>
    //       </ul>
    //     ) : (
    //       <ul className="flex gap-5">
    //         <Link href={"/login"}>
    //           <li>Login</li>
    //         </Link>
    //         <Link href={"/register"}>
    //           <li>Register</li>
    //         </Link>
    //       </ul>
    //     )}
    //   </nav>
    //   <img src={"/images.jpeg"} alt="hello" className="w-full max-h-[450px]" />

    //   <div className="px-20 flex gap-5 py-10 justify-around cursor-pointer">
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>24/7 SCHOOL BUS</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <img src="/cctv.jpeg" className="w-full" />
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>
    //           Unlimited Internet With <br /> speed over 10mbs
    //         </CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <img src="/cctv.jpeg" className="w-full" />
    //       </CardContent>
    //     </Card>
    //     <Card>
    //       <CardHeader>
    //         <CardTitle>Security 24/7 CCTV CAMERA</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <img src="/cctv.jpeg" className="w-full" />
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
  );
}
