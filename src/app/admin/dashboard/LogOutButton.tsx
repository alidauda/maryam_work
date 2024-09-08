"use client";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { logout } from "./action";
import { useRouter } from "next/navigation";

export default function LogOut() {
  const router = useRouter();
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      router.push("/login");
    },
  });
  return (
    <Button type="button" onClick={() => mutate()}>
      Log Out
    </Button>
  );
}
