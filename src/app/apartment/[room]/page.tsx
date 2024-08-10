import { get_rooms } from "@/utils/data/page";

import Rooms from "@/components/apartment";

export default async function Page({ params }: { params: { room: string } }) {
  const id = parseInt(params.room);
  const rooms = await get_rooms(id);

  return <Rooms props={rooms} />;
}
