"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { toast } from "sonner";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createRoom, getPropertyname } from "../action";

const schema = z.object({
  name: z.string().min(1, { message: "Room name is required" }),
  property: z.string().min(1, { message: "Property selection is required" }),
  price: z.string().min(1, { message: "Price is required" }),
  capacity: z.string().min(1, { message: "Capacity is required" }),
  availableRooms: z.string().min(1, { message: "Available rooms is required" }),

  image: z
    .array(z.instanceof(File))
    .min(1, { message: "At least one image is required" }),
});

type FormData = z.infer<typeof schema>;

async function createRom(data: FormData) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("property", data.property);
  formData.append("price", data.price);
  formData.append("capacity", data.capacity);
  formData.append("availableroom", data.availableRooms);

  data.image.forEach((file) => {
    formData.append("image", file);
  });

  const response = await fetch("/api/createRoom", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create room");
  }

  return response.json();
}

export default function RoomCreationComponent({}: {}) {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["myPropties"],
    queryFn: () => getPropertyname(),
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      property: "",
      price: "",
      capacity: "",
      availableRooms: "",

      image: [],
    },
  });

  const imageField = useWatch({
    control,
    name: "image",
  });

  const {
    mutate: createMutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createRoom,
    onSuccess: () => {
      toast.success("Room Created Successfully");
      router.push("/admin/dashboard/room");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create room: ${error.message}`);
    },
  });

  useEffect(() => {
    if (imageField && imageField.length > 0) {
      const urls = imageField.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  }, [imageField]);

  const handleImageDelete = (index: number) => {
    const newFiles = [...(watch("image") || [])];
    newFiles.splice(index, 1);
    setValue("image", newFiles);

    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentFiles = watch("image") || [];
    setValue("image", [...currentFiles, ...files]);

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const onSubmit = (data: FormData) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("property", data.property);
    formData.append("price", data.price);
    formData.append("capacity", data.capacity);
    formData.append("availableroom", data.availableRooms);

    data.image.forEach((file) => {
      formData.append("image", file);
    });

    createMutate(formData);
  };
  if (isLoading) {
    return <h1>loading</h1>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Room</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Room Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="property">Property</Label>
          <Select onValueChange={(value) => setValue("property", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties &&
                properties.map((property) => (
                  <SelectItem key={property.id} value={property.id.toString()}>
                    {property.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.property && (
            <p className="text-red-500">{errors.property.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" {...register("price")} />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input id="capacity" {...register("capacity")} />
          {errors.capacity && (
            <p className="text-red-500">{errors.capacity.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="availableRooms">Available Rooms</Label>
          <Input id="availableRooms" {...register("availableRooms")} />
          {errors.availableRooms && (
            <p className="text-red-500">{errors.availableRooms.message}</p>
          )}
        </div>

        <div>
          <Label>Images</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  alt={`Room image ${index}`}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Add Image
                </span>
              </div>
              <input
                id="file-input"
                type="file"
                {...register("image")}
                onChange={handleImageAdd}
                accept="image/*"
                className="hidden"
                multiple
              />
            </div>
          </div>
          {errors.image && (
            <p className="text-red-500">{errors.image.message}</p>
          )}
        </div>
        {isError && (
          <div className="text-red-500">
            Error:{" "}
            {error instanceof Error
              ? error.message
              : "An unknown error occurred"}
          </div>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Room"}
        </Button>
      </form>
    </div>
  );
}
