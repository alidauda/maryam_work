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
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  gender: z.enum(["male", "female", "other"], {
    required_error: "Gender is required",
  }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" }),
  address: z
    .string()
    .min(3, { message: "Address must be at least 3 characters" }),
  file: z
    .array(z.instanceof(File))
    .min(1, { message: "At least one image is required" }),
});

type FormData = z.infer<typeof schema>;

async function createProperty(data: FormData) {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("gender", data.gender);
  formData.append("description", data.description);
  formData.append("address", data.address);

  data.file.forEach((file) => {
    formData.append("file", file);
  });

  const response = await fetch("/api/createProperty", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create property");
  }

  return response.json();
}

export default function PropertyCreationComponent() {
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
      gender: undefined,
      description: "",
      address: "",
      file: [],
    },
  });

  const fileField = useWatch({
    control,
    name: "file",
  });

  const {
    mutate: createMutate,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      toast.success("Property Created Successfully");
      router.push("/admin/dashboard/property");
      // Reset form or redirect here if needed
    },
    onError: (error: Error) => {
      toast.error(`Failed to create property: ${error.message}`);
    },
  });

  useEffect(() => {
    if (fileField && fileField.length > 0) {
      const urls = fileField.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  }, [fileField]);

  const handleImageDelete = (index: number) => {
    const newFiles = [...(watch("file") || [])];
    newFiles.splice(index, 1);
    setValue("file", newFiles);

    // Also remove the preview URL
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentFiles = watch("file") || [];
    setValue("file", [...currentFiles, ...files]);

    // Create new preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const onSubmit = (data: FormData) => {
    createMutate(data);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Property</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Property Name</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="gender">Gender</Label>
          <Select
            onValueChange={(value) =>
              setValue("gender", value as "male" | "female" | "other")
            }
          >
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
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" {...register("description")} />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input id="address" {...register("address")} />
          {errors.address && (
            <p className="text-red-500">{errors.address.message}</p>
          )}
        </div>
        <div>
          <Label>Images</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <Image
                  src={url}
                  alt={`Property image ${index}`}
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
                {...register("file")}
                onChange={(e) => {
                  handleImageAdd(e);
                }}
                accept="image/*"
                className="hidden"
                multiple
              />
            </div>
          </div>
          {errors.file && <p className="text-red-500">{errors.file.message}</p>}
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
          {isPending ? "Creating..." : "Create Property"}
        </Button>
      </form>
    </div>
  );
}
