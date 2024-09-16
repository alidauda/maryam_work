"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getRooms } from "./action";
import DataTabel from "./components/DataTable";
import DataTableHead from "./components/DataTableHead";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function Hostel() {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => getRooms(),
  });
  const router = useRouter();

  const SkeletonLoader = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 mt-5">
      <Tabs defaultValue="All">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="All">All</TabsTrigger>
            </TabsList>
            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => {
                router.push("/admin/dashboard/room/create");
              }}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create new room
              </span>
            </Button>
          </div>
        </div>

        <TabsContent value="All">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Rooms</CardTitle>
              <CardDescription>Manage your Rooms</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <SkeletonLoader />
              ) : (
                <DataTableHead>
                  {rooms &&
                    rooms.map((room) => (
                      <DataTabel
                        key={room.id}
                        props={{
                          ...room,
                        }}
                      />
                    ))}
                </DataTableHead>
              )}
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-4 w-[200px]" />
                ) : (
                  <>
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </>
                )}
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
