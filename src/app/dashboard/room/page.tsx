import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoomStatus } from "@prisma/client";
import { getPropertyname, getRooms } from "./action";
import RoomModal from "./modal";
import DataTabel from "./components/DataTable";
import DataTableHead from "./components/DataTableHead";

export default async function Hostel() {
  const rooms = await getRooms();
  const property = await getPropertyname();
  const status = ["All", ...Object.keys(RoomStatus)];

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-5">
      <Tabs defaultValue="All">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <TabsList>
              {status.map((item) => (
                <TabsTrigger key={item} value={item}>
                  {item}
                </TabsTrigger>
              ))}
            </TabsList>
            <RoomModal
              props={{
                property,
              }}
            />
          </div>
        </div>
        {status.map((item) => (
          <TabsContent value={item} key={item}>
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Propertys</CardTitle>
                <CardDescription>Manage your Propertys</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTableHead>
                  {rooms &&
                    rooms
                      .filter((room) =>
                        item === "All" ? room : room.status === item
                      )
                      .map((room) => (
                        <DataTabel
                          props={{
                            ...room,
                            images: room.images[0],
                          }}
                        />
                      ))}
                </DataTableHead>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Showing <strong>1-10</strong> of <strong>32</strong> products
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  );
}
