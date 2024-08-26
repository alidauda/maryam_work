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
import { Label } from "@/components/ui/label";
import { PlusCircle, UploadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createRoom } from "./action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PropertyData {
  property: {
    name: string;
    id: number;
  }[];
}

export default function RoomModal({ props }: { props: PropertyData }) {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error creating room:", error);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
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
      <DialogContent className="w-full max-h-[80vh] flex flex-col overflow-scroll">
        <DialogHeader>
          <DialogTitle>Create a new Room</DialogTitle>
          <DialogDescription>
            Create a new room for your property
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <form onSubmit={handleSubmit} className="w-auto space-y-5">
            <Label htmlFor="name" className="text-right">
              Room Name
            </Label>
            <Input className="w-full" name="name" id="name" required />

            <Label htmlFor="property" className="text-right">
              Apartment
            </Label>
            <Select name="property">
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
            <Input className="w-full" name="price" id="price" required />

            <Label htmlFor="capacity" className="text-right">
              Capacity
            </Label>
            <Input className="w-full" name="capacity" id="capacity" required />

            <Label htmlFor="availableroom" className="text-right">
              Available Room
            </Label>
            <Input
              className="w-full"
              name="availableroom"
              id="availableroom"
              required
            />

            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-primary rounded-md bg-primary/10 cursor-pointer transition-colors hover:bg-primary/20 relative ">
              <UploadIcon className="h-10 w-10 text-primary" />
              <div className="mt-4 text-primary font-medium">
                Click to upload an image
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                name="image"
                accept="image/*"
              />
            </div>

            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Room preview"
                  className="max-w-full h-auto"
                />
              </div>
            )}

            <Button type="submit" disabled={isPending}>
              {isPending ? "...saving" : "Create"}
            </Button>
          </form>
        </div>
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
