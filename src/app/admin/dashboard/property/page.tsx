"use client";
import Image from "next/image";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteProperty, getPropertyBy } from "./action";
import { dateConvert } from "@/utils/date";
import { cn } from "@/lib/utils";
import { PropertyStatus } from "@prisma/client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Hostel() {
  const query = useQueryClient();
  const { data: property } = useQuery({
    queryKey: ["property"],
    queryFn: () => getPropertyBy(),
  });
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      query.invalidateQueries();
    },
  });
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0  mt-5">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={() => router.push("/admin/dashboard/property/create")}
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create new room
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Propertys</CardTitle>
              <CardDescription>Manage your Propertys</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Location
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      rooms
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      gender
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property &&
                    property.map((item) => {
                      const value = dateConvert(item.createdAt.toISOString());
                      const image = item.images.filter(
                        (item) => item.propertyId === item.id
                      );

                      return (
                        <TableRow key={item.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={item.images ? item.images[0].url : ""}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                item.status === PropertyStatus.ACTIVE &&
                                  "text-green-500",
                                item.status ===
                                  PropertyStatus.UNDER_MAINTENANCE &&
                                  "text-yellow-500",
                                item.status === PropertyStatus.INACTIVE &&
                                  "text-red-500"
                              )}
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {item.address}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {item.rooms.length}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {item.gender}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {value}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  aria-haspopup="true"
                                  size="icon"
                                  variant="ghost"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <Link
                                  href={`/admin/dashboard/property/${item.id}/edit`}
                                >
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  onClick={() => {
                                    mutate(item.id.toString());
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>
                                <Link
                                  href={`/admin/dashboard/property/${item.id}/view`}
                                >
                                  <DropdownMenuItem>View</DropdownMenuItem>
                                </Link>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
