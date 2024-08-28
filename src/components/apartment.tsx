"use client";

import { JSX, SVGProps } from "react";
import { toast } from "sonner";

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
import Footer from "./footer";

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
    onSuccess: () => {
      toast.success("Booking successful");
    },
  });

  const { data: bookingState, isLoading: isLoadingBookingState } = useQuery({
    queryKey: ["bookingState"],
    queryFn: () => checkActiveBooking(user.id),
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative mb-8">
          <div className="w-full h-64 rounded-xl overflow-hidden">
            <Image
              src={imageUrl[0].url}
              alt="Available Rooms"
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-transparent opacity-75 rounded-xl"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold absolute top-1/2 left-8 transform -translate-y-1/2 text-white">
            Available Rooms
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data &&
            data.map((room: Room) => (
              <Card
                key={room.id}
                className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={room.imageUrl}
                    alt={`Room in ${room.property.name}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <CardContent className="flex flex-col items-start gap-4 p-6 flex-grow">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="text-xl font-bold text-gray-900">
                      Room of {room.capacity}
                    </h3>
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
                  <div className="flex flex-col w-full gap-2 text-gray-600">
                    <div className="flex items-center gap-2">
                      <HomeIcon className="w-4 h-4" />
                      <span className="text-sm">{room.property.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="text-sm">{room.property.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full text-gray-600">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      <span>
                        <span className="text-gray-400">Room of</span>{" "}
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
                      <span className="text-sm font-medium text-gray-700">
                        Match Percentage
                      </span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="w-4 h-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This shows how well your preferences match with
                              the room's current occupants.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Progress
                      value={room.matchPercentage}
                      className="h-2 bg-gray-200"
                    >
                      <div
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${room.matchPercentage}%` }}
                      ></div>
                    </Progress>
                    <span className="text-sm text-gray-500">
                      {room.matchPercentage}% match
                    </span>
                  </div>
                  <div className="flex items-center justify-between w-full mt-auto">
                    <h4 className="text-lg font-bold text-gray-900">
                      ₦{room.price.toLocaleString()}/month
                    </h4>
                    {room.availableSpots > 0 &&
                    !isLoadingBookingState &&
                    !bookingState!.hasActiveBooking ? (
                      <PaystackButton
                        className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
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
                      <Button
                        disabled
                        className="bg-gray-300 text-gray-500 cursor-not-allowed"
                      >
                        {isLoadingBookingState
                          ? "Loading..."
                          : bookingState!.hasActiveBooking
                          ? "Booked"
                          : "Not Available"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
      <Footer />
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
