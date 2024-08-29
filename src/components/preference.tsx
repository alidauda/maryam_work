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
import { Slider } from "./ui/slider";

const roommatePreferencesSchema = z.object({
  gender: z.enum(["male", "female", "other"]),

  sleepSchedule: z.enum(["early", "normal", "late"]),
  course: z.string(),
});
type RoommatePreferences = z.infer<typeof roommatePreferencesSchema>;

export function Preferences() {
  const [gender, setGender] = useState<string>();

  const [sleepSchedule, setSleepSchedule] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [quietness, setQuietness] = useState<number>(0);
  const [socialness, setSocialness] = useState<number>(0);
  const [cleanliness, setCleanliness] = useState<number>(0);
  const { mutate, isPending } = useMutation({
    mutationFn: createPreference,
  });
  const onSubmit = () => {
    const formdata = new FormData();
    formdata.append("gender", gender!);
    formdata.append("cleanliness", cleanliness.toString());
    formdata.append("sleepSchedule", sleepSchedule.toString());

    formdata.append("quietness", quietness?.toString());
    formdata.append("socialness", socialness?.toString());

    mutate(formdata);
  };

  return (
    <div>
      <section className="bg-black py-20 md:py-10 min-h-screen">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-white">
                Find the perfect roommate for your student stay
              </h1>
              <p className="text-lg text-white">
                Adjust the sliders to set your preferences for the perfect
                roommate
              </p>
            </div>

            <Card className="bg-white p-6 rounded-lg shadow-lg overflow-y-auto max-h-[80vh]">
              <CardContent className="grid gap-6">
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
                    htmlFor="sleepSchedule"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Sleep Schedule: {sleepSchedule}
                  </Label>
                  <Slider
                    id="sleepSchedule"
                    min={0}
                    max={10}
                    step={1}
                    value={[sleepSchedule]}
                    onValueChange={(value) => setSleepSchedule(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Early Bird</span>
                    <span>Normal</span>
                    <span>Night Owl</span>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Quietness Range: {quietness}
                  </Label>
                  <Slider
                    id="quietness"
                    min={0}
                    max={10}
                    step={1}
                    value={[quietness]}
                    onValueChange={(value) => setQuietness(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>
                <div>
                  <Label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Socialness Range: {socialness}
                  </Label>
                  <Slider
                    id="socialness"
                    min={0}
                    max={10}
                    step={1}
                    value={[socialness]}
                    onValueChange={(value) => setSocialness(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="price"
                    className="block mb-2 text-sm font-medium text-black"
                  >
                    Cleanliness Range: {cleanliness}
                  </Label>
                  <Slider
                    id="socialness"
                    min={0}
                    max={10}
                    step={1}
                    value={[cleanliness]}
                    onValueChange={(value) => setCleanliness(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-full relative py-3 px-3 bg-black text-white hover:bg-gray-800"
                  onClick={onSubmit}
                >
                  {isPending && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Spinner />
                    </span>
                  )}
                  <span className={`${isPending ? "invisible" : ""}`}>
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
