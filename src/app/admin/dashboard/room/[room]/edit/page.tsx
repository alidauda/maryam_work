"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getRoomToEdit, updateRoom } from "./action";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { RoomStatus } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function RoomEdit({ params }: { params: { room: string } }) {
  const router = useRouter();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["room", params.room],
    queryFn: () => getRoomToEdit(params.room),
  });

  const {
    mutate,
    isPending,
    isError: mutationError,
  } = useMutation({
    mutationFn: updateRoom,
    onSuccess: () => {
      toast.success("Room Updated Successfully");
      router.push("/admin/dashboard/room");
    },
  });

  const [room, setRoom] = useState(data || null);
  const [newImage, setNewImage] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!room) return;
    const value =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setRoom({ ...room, [e.target.name]: value });
  };

  const handlePropertyChange = (value: string) => {
    if (!room) return;
    setRoom({ ...room, propertyId: parseInt(value) });
  };

  const handleStatusChange = (value: RoomStatus) => {
    if (!room) return;
    setRoom({ ...room, status: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room) return;
    const formData = new FormData();
    if (newImage) {
      formData.append("file", newImage);
    }
    mutate({
      data: formData,
      room: room,
    });
  };

  useEffect(() => {
    if (data) {
      setRoom(data);
    }
  }, [data]);

  if (isLoading) {
    return <RoomEditSkeleton />;
  }

  if (isError || !data) {
    return <div>Error loading room data. Please try again later.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Room</h1>
      {room ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="roomName">Room Name</Label>
            <Input
              id="roomName"
              name="roomName"
              value={room.roomName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="property">Property</Label>
            <Select
              onValueChange={handlePropertyChange}
              value={room.propertyId.toString()}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {/* You would need to fetch and map available properties here */}
                <SelectItem value={room.propertyId.toString()}>
                  {room.property.name}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={room.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={room.capacity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="availableSpots">Available Spots</Label>
            <Input
              id="availableSpots"
              name="availableSpots"
              type="number"
              value={room.availableSpots}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select onValueChange={handleStatusChange} value={room.status}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RoomStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Room Image</Label>
            <div className="mt-2">
              <Image
                src={room.imageUrl}
                alt={`Room image`}
                width={300}
                height={200}
                className="rounded-lg object-cover"
              />
              <div
                className="mt-2 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center p-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <span className="mt-2 block text-sm font-semibold text-gray-900">
                    Change Image
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              {newImage && (
                <p className="mt-2 text-sm text-gray-500">
                  New image selected: {newImage.name}
                </p>
              )}
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      ) : (
        <div>No room data available.</div>
      )}
    </div>
  );
}

function RoomEditSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
