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
import { createProperty } from "./action";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
export const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
  description: z.string().min(3),
  imageUrl: z.string(),
  address: z.string().min(3),
});
export default function Modal() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      imageUrl: "",
    },
    resolver: zodResolver(schema),
  });
  const { mutate, isPending } = useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      setOpen(false);
    },
  });

  const submit = (data: z.infer<typeof schema>) => {
    mutate({ ...data });
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
      <DialogContent className="w-full">
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
            <UploadDropzone
              className="text-black bg-red-400"
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                // Do something with the response

                setValue("imageUrl", res[0].url);
                alert("Upload Completed");
              }}
              onUploadError={(error: Error) => {
                // Do something with the error.
                alert(`ERROR! ${error.message}`);
              }}
            />
            <Input
              className="col-span-3 w-full hidden "
              readOnly
              {...register("imageUrl")}
            />
            <Button type="submit" disabled={!watch("imageUrl")}>
              {isPending ? "...saving" : "submit"}
            </Button>
          </form>
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
