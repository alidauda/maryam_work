import { get_rooms } from "@/utils/data/page";

import Rooms from "@/components/apartment";
import Header from "@/components/header";

import { validateRequest } from "@/utils/auth";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { room: string } }) {
  const id = parseInt(params.room);
  const rooms = await get_rooms(id);
  const { user } = await validateRequest();
  if (!user) {
    return redirect("/login");
  }

  return (
    <>
      <Header />

      <Rooms imageUrl={rooms.data!.images} user={user} />
    </>
  );
}
