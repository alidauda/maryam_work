"use client";
import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  HomeIcon,
  MapPinIcon,
  UserIcon,
  CalendarIcon,
  ArrowLeftIcon,
  InfoIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DateRange } from "react-day-picker";
import {
  addDays,
  format,
  differenceInDays,
  differenceInMonths,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getSingleRoomRecommendation } from "@/app/recommendationForAsingleRoom";
import { Skeleton } from "@/components/ui/skeleton";
import { createBookingAndPayment } from "../../payment";
import { toast } from "sonner";
import { PaystackButton } from "react-paystack";
import { checkActiveBooking } from "../../bookingstate";

export default function SingleRoom({
  params,
}: {
  params: { room: string; one: string };
}) {
  const { data: roomDetails, isLoading } = useQuery({
    queryKey: ["recommend", params.room, params.one],
    queryFn: () => getSingleRoomRecommendation(params.room, params.one),
  });
  const { mutate } = useMutation({
    mutationFn: createBookingAndPayment,
    onSuccess: () => {
      toast.success("Booking successful");
    },
  });
  const { data: bookingState, isLoading: isLoadingBookingState } = useQuery({
    queryKey: ["bookingState"],
    queryFn: () => checkActiveBooking(),
  });
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [totalPrice, setTotalPrice] = React.useState<number | null>(null);
  const [monthsSelected, setMonthsSelected] = React.useState<number | null>(
    null
  );
  const [error, setError] = React.useState<string | null>(null);

  const handleDateSelect = (selectedDate: DateRange | undefined) => {
    if (selectedDate?.from && selectedDate?.to) {
      const months = differenceInMonths(selectedDate.to, selectedDate.from);
      if (months < 1) {
        setError(
          "Minimum booking duration is 1 month. Please select a longer period."
        );
        setDate(undefined);
        setTotalPrice(null);
        setMonthsSelected(null);
      } else {
        setDate(selectedDate);
        setError(null);
      }
    } else {
      setDate(selectedDate);
      setError(null);
    }
  };

  React.useEffect(() => {
    if (date?.from && date?.to) {
      const days = differenceInDays(date.to, date.from) + 1;
      const months = Math.ceil(days / 30);
      const calculatedPrice = Math.round(months * roomDetails!.price); // Convert back to Naira
      setTotalPrice(calculatedPrice);
      setMonthsSelected(months);
    } else {
      setTotalPrice(null);
      setMonthsSelected(null);
    }
  }, [date]);

  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <Skeleton className="w-full h-64 mb-6" />
              <Skeleton className="h-8 w-3/4 mb-4" />
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
              <Skeleton className="h-10 w-full mb-6" />
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-1/2 mb-4" />
              {[...Array(2)].map((_, i) => (
                <div key={i} className="mb-6">
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!roomDetails) {
    return (
      <div className="bg-gray-100 min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardContent className="p-6">
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error ||
                    "No room details available. Please try again later."}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative w-full h-64 mb-6">
              <Image
                src={roomDetails.imageUrl}
                alt={`Room in ${roomDetails.property.name}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              Room of {roomDetails.capacity}
            </h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-2">
                <HomeIcon className="w-5 h-5" />
                <span>{roomDetails.property.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5" />
                <span>{roomDetails.property.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                <span>{roomDetails.availableSpots} spots available</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                <span>₦{roomDetails.price.toLocaleString()}/month</span>
              </div>
            </div>
            <div className="flex items-center justify-between w-full mb-6">
              <h4 className="text-lg font-bold">
                ₦{roomDetails.price.toLocaleString()}/month
              </h4>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  roomDetails.status === "AVAILABLE"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {roomDetails.status}
              </span>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Select Dates</h2>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {totalPrice !== null && monthsSelected !== null && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  Booking Summary
                </h3>
                <p className="text-sm text-green-600 mb-2">
                  Duration: {monthsSelected} month
                  {monthsSelected > 1 ? "s" : ""}
                </p>
                <p className="text-2xl font-bold text-green-800">
                  Total Price: ₦{totalPrice.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">Roommate Compatibility</h2>
            {roomDetails.roomName.length > 0 ? (
              roomDetails.roommates.map((roommate) => {
                return (
                  <div key={roommate.id} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold">{roommate.name}</h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <InfoIcon className="w-4 h-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              This shows how well your preferences match with
                              this roommate.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium">
                          Overall Match
                        </span>
                        <Progress
                          value={roommate.matchPercentages.overall}
                          className="h-2 mb-1"
                        />
                        <span className="text-sm text-muted-foreground">
                          {roommate.matchPercentages.overall}% overall match
                        </span>
                      </div>
                      <div>
                        <span className="text-sm">
                          Cleanliness: {roommate.matchPercentages.cleanliness}%
                        </span>
                        <Progress
                          value={roommate.matchPercentages.cleanliness}
                          className="h-1"
                        />
                      </div>
                      <div>
                        <span className="text-sm">
                          Quietness: {roommate.matchPercentages.quietness}%
                        </span>
                        <Progress
                          value={roommate.matchPercentages.quietness}
                          className="h-1"
                        />
                      </div>
                      <div>
                        <span className="text-sm">
                          Socialness: {roommate.matchPercentages.socialness}%
                        </span>
                        <Progress
                          value={roommate.matchPercentages.socialness}
                          className="h-1"
                        />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-center items-center">
                No Room Mate Yet
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          {roomDetails.availableSpots > 0 &&
          !isLoadingBookingState &&
          !bookingState!.hasActiveBooking ? (
            <PaystackButton
              disabled={
                !date?.from ||
                !date?.to ||
                monthsSelected === null ||
                monthsSelected < 1
              }
              className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              text="Book Now"
              publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!}
              amount={totalPrice! * 100} // amount in kobo
              email={roomDetails.me.email}
              metadata={{
                custom_fields: [
                  {
                    display_name: "Room",
                    variable_name: "room",
                    value: roomDetails.id,
                  },
                ],
              }}
              onSuccess={(reference) => {
                console.log(reference);
                mutate({
                  userId: roomDetails.me.id,
                  roomId: roomDetails.id,
                  amount: totalPrice!,
                  paymentData: reference,
                  endDate: date?.to!,
                  startDate: date?.from!,
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

          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Rooms
          </Button>
        </div>
      </div>
    </div>
  );
}
