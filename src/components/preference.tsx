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
import Spinner from "./spinner";
import { useMutation } from "@tanstack/react-query";
import { createPreference } from "@/app/preference/data";

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

  sleepSchedule: z.enum(["early", "normal", "late"]),
  course: z.string(),
});
type RoommatePreferences = z.infer<typeof roommatePreferencesSchema>;

export function Preferences({ property }: { property: Property[] }) {
  const [gender, setGender] = useState<string>();
  const [course, setCourse] = useState<string>();
  const [sleepSchedule, setSleepSchedule] = useState<string>();
  const { mutate, isPending } = useMutation({
    mutationFn: createPreference,
  });
  const onSubmit = () => {
    const formdata = new FormData();
    formdata.append("gender", gender!);
    formdata.append("course", course!);
    formdata.append("sleepSchedule", sleepSchedule!);
    mutate(formdata);
  };

  return (
    <div>
      <section className="bg-primary py-20 md:py-10 h-screen">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
                Find the perfect roommate for your student stay
              </h1>
              <p className="text-lg text-primary-foreground">
                Fill this form to get the perfect roommate for your student stay
              </p>
            </div>

            <Card className="bg-primary-foreground p-6 rounded-lg shadow-lg  overflow-y-scroll">
              <CardContent className="grid gap-4">
                <div>
                  <Label
                    htmlFor="gender"
                    className="block mb-1 text-sm font-medium text-primary"
                  >
                    Gender
                  </Label>
                  <Select name="gender" onValueChange={(e) => setGender(e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="course"
                    className="block mb-1 text-sm font-medium text-primary"
                  >
                    Course of Study
                  </Label>
                  <Input
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="course"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="sleepSchedule"
                    className="block mb-1 text-sm font-medium text-primary"
                  >
                    Sleep Schedule
                  </Label>
                  <Select onValueChange={(e) => setSleepSchedule(e)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sleep schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early">Early Bird</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="late">Night Owl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  className="w-full relative py-3 px-3"
                  onClick={onSubmit}
                >
                  {isPending && (
                    <span className="absolute inset-0 flex items-center justify-center py-4">
                      <Spinner />
                    </span>
                  )}
                  <span className={`${isPending ? "invisible" : ""}`}>
                    {" "}
                    Submit
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
