import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { dateConvert } from "@/utils/date";
import { $Enums, BookingStatus, RoomStatus } from "@prisma/client";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

// Define the Booking interface based on your Prisma schema
interface Booking {
  id: number;
  startDate: Date;
  endDate: Date;
  status: $Enums.BookingStatus;
  userId: string;
  roomId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface DataTableProps {
  bookings: Booking[];
}

export default function DataTabelBookings({
  bookings,
}: {
  bookings: Booking[];
}) {
  return (
    <>
      {bookings.map((booking) => {
        const createdAtFormatted = dateConvert(booking.createdAt.toISOString());
        const startDateFormatted = dateConvert(booking.startDate.toISOString());
        const endDateFormatted = dateConvert(booking.endDate.toISOString());

        return (
          <TableRow key={booking.id}>
            <TableCell>{booking.id}</TableCell>
            <TableCell>{startDateFormatted}</TableCell>
            <TableCell>{endDateFormatted}</TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={cn(
                  booking.status === "PENDING" && "text-yellow-500",
                  booking.status === "CONFIRMED" && "text-green-500",
                  booking.status === "CANCELLED" && "text-red-500"
                )}
              >
                {booking.status}
              </Badge>
            </TableCell>
            <TableCell>{booking.userId}</TableCell>
            <TableCell>{booking.roomId}</TableCell>
            <TableCell>{createdAtFormatted}</TableCell>
            <TableCell>
              {dateConvert(booking.updatedAt.toISOString())}
            </TableCell>
          </TableRow>
        );
      })}
    </>
  );
}
