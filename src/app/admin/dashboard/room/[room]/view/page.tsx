"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarIcon,
  UsersIcon,
  DollarSignIcon,
  BedDoubleIcon,
  HomeIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { viewRooms } from "./action";

type Room = {
  status: "AVAILABLE" | "OCCUPIED" | "UNDER_MAINTENANCE" | "OUT_OF_SERVICE";
};

export default function RoomDetailsPage({
  params,
}: {
  params: { room: string };
}) {
  const {
    data: room,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["room", params.room],
    queryFn: () => viewRooms(params.room),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading room data. Please try again later.</div>;
  }

  if (!room) {
    return <div>No room data available.</div>;
  }
  const getStatusBadge = (status: Room["status"]) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge className="bg-green-500">Available</Badge>;
      case "OCCUPIED":
        return <Badge variant="destructive">Occupied</Badge>;
      case "UNDER_MAINTENANCE":
        return <Badge variant="secondary">Maintenance</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{room.roomName}</CardTitle>
              <CardDescription>{room.property.name}</CardDescription>
            </div>
            {getStatusBadge(room.status)}
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div>
            <Image
              src={room.imageUrl}
              alt={room.roomName}
              width={300}
              height={200}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-5 w-5 text-muted-foreground" />
              <span>{room.property.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <BedDoubleIcon className="h-5 w-5 text-muted-foreground" />
              <span>Capacity: {room.capacity}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-5 w-5 text-muted-foreground" />
              <span>Available Spots: {room.availableSpots}</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSignIcon className="h-5 w-5 text-muted-foreground" />
              <span>Price: ${room.price.toFixed(2)} / night</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span>
                Created: {new Date(room.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <span>
                Last Updated: {new Date(room.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Occupants</CardTitle>
        </CardHeader>
        <CardContent>
          {room.currentOccupants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {room.currentOccupants.map((occupant) => (
                  <TableRow key={occupant.id}>
                    <TableCell className="font-medium">
                      {occupant.name}
                    </TableCell>
                    <TableCell>{occupant.email}</TableCell>
                    <TableCell>{occupant.gender}</TableCell>
                    <TableCell>{occupant.phoneNumber}</TableCell>
                    <TableCell>
                      {new Date(
                        occupant.bookings.filter(
                          (item) => item.userId === occupant.id
                        )[0].startDate
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        occupant.bookings.filter(
                          (item) => item.userId === occupant.id
                        )[0].endDate
                      ).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p>No current occupants.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
