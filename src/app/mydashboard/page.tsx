"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { bookings } from "./bookings";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: bookingState, isLoading: isLoadingBookingState } = useQuery({
    queryKey: ["activeBooking"],
    queryFn: () => bookings(),
  });

  console.log("Booking state", bookingState);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-16 items-center border-b px-6">
        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
      </header>

      <main className="flex-1 overflow-x-auto overflow-y-auto p-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Start</TableHead>
                <TableHead className="w-[100px]">End</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Apartment</TableHead>
                <TableHead className="text-right">Room ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingBookingState ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ) : bookingState?.activeBooking ? (
                <TableRow>
                  <TableCell className="font-medium">
                    {new Date(
                      bookingState.activeBooking.startDate
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      bookingState.activeBooking.endDate
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        bookingState.activeBooking.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : bookingState.activeBooking.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {bookingState.activeBooking.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {bookingState.activeBooking.room.roomName}
                  </TableCell>
                  <TableCell>
                    {bookingState.activeBooking.room.property.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {bookingState.activeBooking.roomId}
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No active bookings found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
