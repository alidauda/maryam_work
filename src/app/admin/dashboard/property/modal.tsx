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
import { PlusCircle, UploadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { UploadDropzone } from "@/utils/uploadthing";

import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useUpLoadHook from "./uploadhook";
import { zfd } from "zod-form-data";
import { toast } from "sonner";

export const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().min(3),

  address: z.string().min(3),
  file: z.array(zfd.file()),
});
type formData = z.infer<typeof schema>;

export default function Modal() {
  const [open, setOpen] = useState(false);
  const [previewUrl, setPreviewURl] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    trigger,
    formState: { errors },
  } = useForm<formData>({});
  const { mutate, isPending } = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      setOpen(false);
      toast.success("Property Created Successfully");
    },
    onError: (error) => {
      console.error("Error creating property:", error);
    },
  });

  const fileField = useWatch({
    control,
    name: "file",
  });
  useEffect(() => {
    if (getValues("file")) {
      if (getValues("file").length > 0) {
        console.log(getValues("file"));
        const urls = getValues("file").map((file) => URL.createObjectURL(file));
        setPreviewURl(urls);
      }
    }
  }, [fileField]);

  const submit = (data: z.infer<typeof schema>) => {
    mutate({ ...data });
  };
  console.log(errors);

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
      <DialogContent className="w-full max-h-[80vh] flex flex-col overflow-scroll">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className=" py-4">
          <form onSubmit={handleSubmit(submit)} className="w-auto space-y-5 ">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input className="w-full" {...register("name")} />
            <Label htmlFor="description" className="text-right">
              description
            </Label>
            <Input className=" w-full" {...register("description")} />
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input className="col-span-3 w-full" {...register("address")} />

            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-primary rounded-md bg-primary/10 cursor-pointer transition-colors hover:bg-primary/20 relative ">
              <UploadIcon className="h-10 w-10 text-primary" />
              <div className="mt-4 text-primary font-medium">
                Drag and drop files here or click to upload
              </div>

              <input
                type="file"
                onChange={(e) => {
                  const f = [];
                  if (e.target.files) {
                    for (let i = 0; i < e.target.files?.length; i++) {
                      const file = e.target.files[i];
                      f.push(file);
                    }
                    setValue("file", f);
                    trigger("file");
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                multiple
              />
            </div>

            <div className="grid grid-cols-2 gap-1 ">
              {previewUrl.length > 0 &&
                previewUrl.map((url) => (
                  <div key={url}>
                    <img src={url} alt={"an image to be show here"} />
                  </div>
                ))}
            </div>

            <Button type="submit" disabled={isPending}>
              {isPending ? "...saving" : "create"}
            </Button>
          </form>
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

async function createProperty(data: formData) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("address", data.address);

  // Append each file
  if (data.file) {
    for (let i = 0; i < data.file.length; i++) {
      formData.append("file", data.file[i]);
    }
  }
  const call = await fetch("/api/createProperty", {
    method: "POST",
    body: formData,
  });
  if (!call.ok) {
    throw new Error(`HTTP error! status: ${call.status}`);
  }
  const response = await call.json();
  console.log(response);
  return response;
}
