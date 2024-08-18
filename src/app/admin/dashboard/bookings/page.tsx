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
import DataTableHeadBookings from "./components/DataTableHead";
import DataTabelBookings from "./components/DataTable";
import prisma from "@/utils/db";

export default async function Hostel() {
  const bookings = await prisma.booking.findMany({});

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-5">
      <Tabs defaultValue="All">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <TabsList>
              <TabsTrigger value={"All"}>All</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value={"All"}>
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Bookings</CardTitle>
              <CardDescription>Bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTableHeadBookings>
                {bookings &&
                  bookings.map((room) => (
                    <DataTabelBookings
                      bookings={[
                        {
                          ...room,
                        },
                      ]}
                    />
                  ))}
              </DataTableHeadBookings>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
