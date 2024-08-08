"use client";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createRoom } from "./action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { url } from "inspector";

interface PropertyData {
  property: {
    name: string;
    id: number;
  }[];
}
export const room_schema = z.object({
  property: z.string(),
  price: z.string(),
  capacity: z.string(),
  availableroom: z.string(),
});
export default function RoomModal({ props }: { props: PropertyData }) {
  const [open, setOpen] = useState(false);
  const query = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      address: "",

      price: "",
      capacity: "",
      availableroom: "",
      property: "",
    },
    resolver: zodResolver(room_schema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      setOpen(false);
    },
  });

  const submit = (data: z.infer<typeof room_schema>) => {
    mutate(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
        console.log(e);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-8 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create new room
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle> Create a new Room</DialogTitle>
          <DialogDescription>
            Create a new room for your property
          </DialogDescription>
        </DialogHeader>
        <div className=" py-4">
          <form onSubmit={handleSubmit(submit)} className="w-auto space-y-5 ">
            <Label htmlFor="property" className="text-right">
              Apartment
            </Label>

            <Select onValueChange={(value) => setValue("property", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select apartment" />
              </SelectTrigger>
              <SelectContent>
                {props.property.map((item) => (
                  <SelectItem key={item.id} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label htmlFor="price" className="text-right">
              Price
            </Label>
            <Input className="col-span-3 w-full" {...register("price")} />
            <Label htmlFor="capacity" className="text-right">
              Capacity
            </Label>
            <Input className="col-span-3 w-full" {...register("capacity")} />
            <Label htmlFor="availableroom" className="text-right">
              Available Room
            </Label>
            <Input
              className="col-span-3 w-full"
              {...register("availableroom")}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? "...saving" : "submit"}
            </Button>
          </form>
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
