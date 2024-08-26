"use client";

import { useState, useMemo, JSX, SVGProps } from "react";

import { Button } from "@/components/ui/button";
import { PaystackButton, usePaystackPayment } from "react-paystack";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { $Enums, RoomStatus } from "@prisma/client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { createBookingAndPayment } from "@/app/apartment/payment";
import { checkActiveBooking } from "@/app/apartment/bookingstate";
import Loading from "@/app/laoding";
import { getFilteredRoomRecommendations } from "@/app/getRecroomate";
import { HomeIcon, InfoIcon, MapPinIcon } from "lucide-react";

import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Progress } from "./ui/progress";

interface Room {
  id: number;
  capacity: number;
  availableSpots: number;
  price: number;
  status: $Enums.RoomStatus;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
  property: {
    name: string;
    address: string;
  };
  imageUrl: string;
  matchPercentage: number;
}

interface Payment {
  reference: string;
  transaction: string;
  status: string;
  message: string;
  amount: number;
}

interface User {
  id: string;
  email: string;
  role: string;
}

export default function Rooms({
  imageUrl,
  user,
}: {
  imageUrl: { url: string }[];
  user: User;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["recommend"],
    queryFn: () => getFilteredRoomRecommendations(),
  });

  const { mutate } = useMutation({
    mutationFn: createBookingAndPayment,
  });

  const { data: bookingState, isLoading: isLoadingBookingState } = useQuery({
    queryKey: ["bookingState"],
    queryFn: () => checkActiveBooking(user.id),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full px-24 py-8 bg-gray-200 h-full space-y-5">
      <div className="relative">
        <img
          src={imageUrl[0].url}
          alt="Apartment"
          className="w-full h-[300px] rounded-xl shadow-md"
        />
        <h1 className="text-5xl font-extrabold absolute top-10 left-10 text-white">
          Available Rooms
        </h1>
      </div>

      <div className="flex justify-between items-center mb-6"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data &&
          data.map((room: Room) => (
            <Card
              key={room.id}
              className="flex flex-col shadow-md overflow-hidden"
            >
              <div className="relative w-full h-48">
                <Image
                  src={room.imageUrl}
                  alt={`Room in ${room.property.name}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardContent className="flex flex-col items-start gap-4 p-4 flex-grow">
                <div className="flex items-center justify-between w-full">
                  <h3 className="text-xl font-bold">Room of {room.capacity}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      room.status === "AVAILABLE"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
                <div className="flex flex-col w-full gap-2">
                  <div className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{room.property.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{room.property.address}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span>
                      <span className="text-muted-foreground">Room of</span>{" "}
                      {room.capacity}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>{room.availableSpots} available</span>
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Match Percentage
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            This shows how well your preferences match with the
                            room's current occupants.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Progress value={room.matchPercentage} className="h-2" />
                  <span className="text-sm text-muted-foreground">
                    {room.matchPercentage}% match
                  </span>
                </div>
                <div className="flex items-center justify-between w-full mt-auto">
                  <h4 className="text-lg font-bold">
                    ₦{room.price.toLocaleString()}/month
                  </h4>
                  {room.availableSpots > 0 &&
                  !isLoadingBookingState &&
                  !bookingState!.hasActiveBooking ? (
                    <PaystackButton
                      className="bg-primary text-primary-foreground hover:bg-primary/90 relative z-30 px-4 py-2 rounded-md text-sm font-medium"
                      text="Book Now"
                      publicKey="pk_test_37335d37c9fb118d8a917de0a58a8efde1bb96c4"
                      amount={room.price * 100} // amount in kobo
                      email={user.email}
                      metadata={{
                        custom_fields: [
                          {
                            display_name: "Room",
                            variable_name: "room",
                            value: room.id,
                          },
                        ],
                      }}
                      onSuccess={(reference) => {
                        console.log(reference);
                        mutate({
                          userId: user.id,
                          roomId: room.id,
                          amount: room.price,
                          paymentData: reference,
                          endDate: new Date(),
                          startDate: new Date(),
                        });
                      }}
                      onClose={() => console.log("Payment canceled")}
                    />
                  ) : (
                    <Button disabled className="bg-muted text-muted-foreground">
                      {isLoadingBookingState
                        ? "Loading..."
                        : bookingState!.hasActiveBooking
                        ? "Already Booked"
                        : "Not Available"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}

function CalendarIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

function UserIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
