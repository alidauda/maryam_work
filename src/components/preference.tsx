"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { $Enums } from "@prisma/client";

interface Room {
  id: number;

  capacity: number;
  availableRoom: number;
  price: number;
  status: $Enums.RoomStatus;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Property {
  id: number;
  name: string;
  description: string;
  address: string;
  imageUrl?: string;
  status: $Enums.PropertyStatus;
  rooms: Room[];
  createdAt: Date;
  updatedAt: Date;
}
const roommatePreferencesSchema = z.object({
  gender: z.enum(["male", "female", "other"]),
  cleanliness: z.enum(["low", "moderate", "high"]),
  sleepSchedule: z.enum(["early", "normal", "late"]),
  course: z.string(),
  propertyId: z.number(),
  roomTypeId: z.number(),
});
type RoommatePreferences = z.infer<typeof roommatePreferencesSchema>;

export function Preferences({ property }: { property: Property[] }) {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RoommatePreferences>({
    resolver: zodResolver(roommatePreferencesSchema),
  });
  const [roomType, setRoomType] = useState("");

  const onSubmit = (data: RoommatePreferences) => {
    console.log(data);
  };

  return (
    <div>
      <section className="bg-primary py-20 md:py-32 h-screen">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
                Find the perfect roommate for your student stay
              </h1>
              <p className="text-lg text-primary-foreground">
                Set your preferences and we'll match you with the ideal
                roommate.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card className="bg-primary-foreground p-6 rounded-lg shadow-lg">
                <CardContent className="grid gap-4">
                  <div>
                    <Label
                      htmlFor="gender"
                      className="block mb-1 text-sm font-medium text-primary"
                    >
                      Gender
                    </Label>
                    <Select {...register("gender", { required: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-red-500">{errors.gender.message}</p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="cleanliness"
                      className="block mb-1 text-sm font-medium text-primary"
                    >
                      Cleanliness
                    </Label>
                    <Select {...register("cleanliness", { required: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cleanliness level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.cleanliness && (
                      <p className="text-red-500">
                        {errors.cleanliness.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="course"
                      className="block mb-1 text-sm font-medium text-primary"
                    >
                      Course of Study
                    </Label>
                    <Input {...register("course", { required: true })} />
                    {errors.course && (
                      <p className="text-red-500">{errors.course.message}</p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="sleepSchedule"
                      className="block mb-1 text-sm font-medium text-primary"
                    >
                      Sleep Schedule
                    </Label>
                    <Select {...register("sleepSchedule", { required: true })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sleep schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="early">Early Bird</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="late">Night Owl</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sleepSchedule && (
                      <p className="text-red-500">
                        {errors.sleepSchedule.message}
                      </p>
                    )}
                  </div>
                  {property && (
                    <div>
                      <Label
                        htmlFor="gender"
                        className="block mb-1 text-sm font-medium text-primary"
                      >
                        property
                      </Label>
                      <Select
                        {...register("gender", { required: true })}
                        onValueChange={(e) => setRoomType(e)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Property" />
                        </SelectTrigger>
                        <SelectContent>
                          {property.map((item) => (
                            <SelectItem value={item.id!.toString()}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-red-500">{errors.gender.message}</p>
                      )}
                    </div>
                  )}
                  {property.filter(
                    (item) => item.id === parseInt(roomType)
                  ) && (
                    <div>
                      <Label
                        htmlFor="gender"
                        className="block mb-1 text-sm font-medium text-primary"
                      >
                        Room
                      </Label>
                      <Select
                        {...register("gender", { required: true })}
                        onValueChange={(e) => setRoomType(e)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Property" />
                        </SelectTrigger>
                        <SelectContent>
                          {property.map((item) =>
                            item.rooms.map((room) => (
                              <SelectItem value={room.id!.toString()}>
                                {"room of" + room.capacity}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.gender && (
                        <p className="text-red-500">{errors.gender.message}</p>
                      )}
                    </div>
                  )}
                  <Button type="submit" className="w-full">
                    Submit
                  </Button>
                </CardContent>
              </Card>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
