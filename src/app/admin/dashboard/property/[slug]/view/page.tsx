"use client";
import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, DollarSign, CalendarDays } from "lucide-react";
import { PropertyStatus, RoomStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { viewRooms } from "./view";
import { dateConvert } from "@/utils/date";

// This would typically come from your API or props
type propertyRooms = {
  id: number;
  roomName: string;
  capacity: number;
  availableSpots: number;
  price: number;
  status: RoomStatus;
  imageUrl: string;
  currentOccupants: [];
  bookings: [
    { id: number; startDate: Date; endDate: Date },
    { id: number; startDate: Date; endDate: Date }
  ];
};

export default function PropertyRooms({
  params,
}: {
  params: { slug: string };
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["property", params.slug],
    queryFn: () => viewRooms(params.slug),
  });
  const [selectedRoom, setSelectedRoom] = useState<propertyRooms>();

  const getStatusColor = (status: RoomStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-500";
      case "OCCUPIED":
        return "bg-red-500";
      case "UNDER_MAINTENANCE":
        return "bg-yellow-500";
      case "OUT_OF_SERVICE":
        return "bg-gray-500";
      default:
        return "bg-blue-500";
    }
  };
  if (!data) {
    return <h1>no data found</h1>;
  }
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((room) => (
          <Card key={room.id} className="overflow-hidden">
            <Image
              src={room.imageUrl}
              alt={room.roomName}
              width={300}
              height={200}
              className="w-full h-48 object-cover"
            />
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{room.roomName}</CardTitle>
                <Badge className={getStatusColor(room.status as RoomStatus)}>
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>{room.capacity} guests</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>${room.price}/night</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span>{room.availableSpots} spots available</span>
                <span>{room.currentOccupants.length} current occupants</span>
              </div>

              <Button
                onClick={() =>
                  //@ts-ignore - bookings is an array of objects
                  setSelectedRoom(room)
                }
                className="w-full"
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedRoom && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>{selectedRoom.roomName} Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Room Information</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Capacity</TableCell>
                      <TableCell>{selectedRoom.capacity} guests</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Available Spots
                      </TableCell>
                      <TableCell>{selectedRoom.availableSpots}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Price</TableCell>
                      <TableCell>${selectedRoom.price}/night</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Status</TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(
                            selectedRoom.status as RoomStatus
                          )}
                        >
                          {selectedRoom.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        Current Occupants
                      </TableCell>
                      <TableCell>
                        {selectedRoom.currentOccupants.length}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Upcoming Bookings</h3>
                {selectedRoom.bookings.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking ID</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRoom.bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.id}</TableCell>
                          <TableCell>
                            {dateConvert(booking.startDate.toISOString())}
                          </TableCell>
                          <TableCell>
                            {dateConvert(booking.endDate.toISOString())}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No upcoming bookings</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
