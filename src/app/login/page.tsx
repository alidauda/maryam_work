"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import AdminLogin from "./adminlogin";

import UserLogin from "./userlogin";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  return (
    <div className="flex justify-center items-center h-screen">
      {" "}
      <Tabs defaultValue="user" className="w-[400px] ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
        </TabsList>
        <TabsContent value={"user"}>
          <UserLogin router={() => router.push("/")} />
        </TabsContent>
        <TabsContent value="admin">
          <AdminLogin router={() => router.push("/admin/dashboard")} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
