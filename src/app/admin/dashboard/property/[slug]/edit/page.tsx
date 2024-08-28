"use client";
import { useState, useRef, useEffect } from "react";
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
import { getItemtoEdit, updateProperty } from "./action";
import { Skeleton } from "@/components/ui/skeleton";
import { PropertyStatus } from "@prisma/client";
import { toast } from "sonner";

// This would typically come from your API or props

export default function PropertyEdit({ params }: { params: { slug: string } }) {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["property", params.slug],
    queryFn: () => getItemtoEdit(params.slug),
  });

  const {
    mutate,
    isPending,
    isError: myerror,
  } = useMutation({
    mutationFn: updateProperty,
    onSuccess: () => {
      toast.success("Property Updated Successfully");
    },
  });

  const [property, setProperty] = useState(data || null);
  const [images, setImages] = useState<{ id: number; url: string }[]>([]);
  const [imageFile, setImageFile] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProperty({ ...property!, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value: PropertyStatus) => {
    setProperty({ ...property!, status: value });
  };

  const handleImageDelete = (imageId: number) => {
    setProperty({
      ...property!,
      images: property!.images.filter((img) => img.id !== imageId),
    });
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files!); // Convert FileList to an array
    if (files) {
      const newImages = files.map((file, index) => ({
        id: Date.now() + index, // Generate a unique id
        url: URL.createObjectURL(file),
      }));
      console.log("New images:", newImages);
      setImages((prev) => [...prev, ...newImages]);
      setImageFile((prev) => [...prev!, ...files!]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated property data to your API
    const formData = new FormData();
    if (imageFile) {
      for (let i = 0; i < imageFile!.length; i++) {
        formData.append("file", imageFile![i]);
      }
    }
    mutate({
      data: formData,
      property: {
        ...property!,
        images: [...property!.images],
      },
    });
    console.log(myerror);
  };
  useEffect(() => {
    if (data) {
      setProperty(data);
    }
  }, [data]);
  if (isLoading) {
    return <PropertyEditSkeleton />;
  }

  if (isError) {
    return <div>Error loading property data. Please try again later.</div>;
  }

  if (!data) {
    return <div>No property data available.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Property Name</Label>
          <Input
            id="name"
            name="name"
            defaultValue={data.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={data.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            defaultValue={data.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select onValueChange={handleStatusChange} defaultValue={data.status}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="INACTIVE">Inactive</SelectItem>
              <SelectItem value="UNDER_MAINTENANCE">
                Under Maintenance
              </SelectItem>
              <SelectItem value="COMING_SOON">Coming Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Images</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {data.images.map((image) => (
              <div key={image.id} className="relative group">
                <Image
                  src={image.url}
                  alt={`Property image ${image.id}`}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleImageDelete(image.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {
              // Display uploaded images as placeholders
              images.map((image) => (
                <div key={image.id} className="relative group">
                  <Image
                    src={image.url}
                    alt={`Property image ${image.id}`}
                    width={300}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) =>
                        prev.filter((img) => img.id !== image.id)
                      )
                    }
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            }
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <span className="mt-2 block text-sm font-semibold text-gray-900">
                  Add Image
                </span>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageAdd}
                accept="image/*"
                className="hidden"
                multiple
              />
            </div>
          </div>
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}

function PropertyEditSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
