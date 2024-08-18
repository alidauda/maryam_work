"use client";

import { useState, useMemo, JSX, SVGProps } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { $Enums, RoomStatus } from "@prisma/client";
import { PaystackButton } from "react-paystack";

import { useMutation } from "@tanstack/react-query";
import { createBookingAndPayment } from "@/app/apartment/payment";

interface Room {
  id: number;
  capacity: number;
  availableSpots: number;
  price: number;
  status: $Enums.RoomStatus;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}
interface Payment {
  reference: string;
  transaction: string;
  status: string;
  message: string;
  amount: number; // You'll need to provide this
}
interface User {
  id: string;
  email: string;
  role: string;
}

export default function Rooms({
  props,
  imageUrl,
  user,
}: {
  props: Room[];
  imageUrl: { url: string }[];
  user: User;
}) {
  const [sortBy, setSortBy] = useState("price");
  const [filterBy, setFilterBy] = useState({
    capacity: [],
    status: [],
  });

  const { mutate } = useMutation({
    mutationFn: createBookingAndPayment,
  });

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  const handleFilterChange = (type: string, value: number | string) => {
    setFilterBy({
      ...filterBy,
      [type]: filterBy[type].includes(value)
        ? filterBy[type].filter((item) => item !== value)
        : [...filterBy[type], value],
    });
  };
  const filteredRooms = useMemo(() => {
    return props
      .filter((room) => {
        if (
          filterBy.capacity.length > 0 &&
          !filterBy.capacity.includes(room.capacity as never)
        ) {
          return false;
        }
        if (
          filterBy.status.length > 0 &&
          !filterBy.status.includes(room.status as never)
        ) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price":
            return a.price - b.price;
          case "capacity":
            return b.capacity - a.capacity;
          case "available":
            return b.availableSpots - a.availableSpots;
          default:
            return 0;
        }
      });
  }, [props, sortBy, filterBy]);
  return (
    <div className=" w-full px-24 py-8 bg-gray-200 h-screen space-y-5 ">
      <div className="relative">
        <img
          src={imageUrl[0].url}
          alt="Apartment"
          className="w-full h-[300px] rounded-xl shadow-md"
        />
        <h1 className="text-5xl font-extrabold absolute top-10 left-10 text-white ">
          Available Rooms
        </h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowUpDownIcon className="w-4 h-4" />
                Sort by: {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={sortBy}
                onValueChange={handleSortChange}
              >
                <DropdownMenuRadioItem value="price">
                  Price
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="capacity">
                  Capacity
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="available">
                  Available
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Accordion type="single" collapsible>
            <AccordionItem value="filters">
              <AccordionTrigger className="flex items-center gap-2">
                <FilterIcon className="w-4 h-4" />
                Filters
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Capacity</h3>
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={() =>
                            handleFilterChange("capacity", 1)
                          }
                        />
                        1 person
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={() =>
                            handleFilterChange("capacity", 2)
                          }
                        />
                        2 people
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={() =>
                            handleFilterChange("capacity", 4)
                          }
                        />
                        4 people
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={() =>
                            handleFilterChange("capacity", 6)
                          }
                        />
                        6 people
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={() =>
                            handleFilterChange("capacity", 8)
                          }
                        />
                        8 people
                      </Label>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Status</h3>
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={() =>
                            handleFilterChange("status", "available")
                          }
                        />
                        Available
                      </Label>
                      <Label className="flex items-center gap-2 font-normal">
                        <Checkbox
                          onCheckedChange={() =>
                            handleFilterChange("status", "sold out")
                          }
                        />
                        Sold Out
                      </Label>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="relative group shadow-md">
            <CardContent className="flex flex-col items-start gap-4 p-4">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-xl font-bold">room of {room.capacity}</h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    room.status === RoomStatus.AVAILABLE
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {room.status}
                </span>
              </div>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span>
                    {" "}
                    <span className="text-gray-500">room of</span>{" "}
                    {room.capacity}{" "}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{room.availableSpots} available</span>
                </div>
              </div>
              <div className="flex items-center justify-between w-full">
                <h4 className="text-lg font-bold">₦{room.price}/month</h4>
                {room.availableSpots > 0 ? (
                  <div style={{ position: "relative", zIndex: 20 }}>
                    <PaystackButton
                      text="Book Now"
                      className="bg-blue-400"
                      email={user.email}
                      amount={room.price * 100}
                      publicKey="pk_test_37335d37c9fb118d8a917de0a58a8efde1bb96c4"
                      onSuccess={(reference: Payment) => {
                        console.log(reference);
                        mutate({
                          amount: room.price,
                          userId: user.id,
                          roomId: room.id,
                          startDate: new Date(),
                          endDate: new Date(),
                          paymentData: reference,
                        });
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ArrowUpDownIcon(
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
      <path d="m21 16-4 4-4-4" />
      <path d="M17 20V4" />
      <path d="m3 8 4-4 4 4" />
      <path d="M7 4v16" />
    </svg>
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

function FilterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
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
