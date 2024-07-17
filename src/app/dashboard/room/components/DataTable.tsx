import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { dateConvert } from "@/utils/date";
import { RoomStatus } from "@prisma/client";

import { MoreHorizontal } from "lucide-react";
import Image from "next/image";

interface DataTableProps {
  property: {
    name: string;
  };
  images: {
    id: number;
    imageUrl: string;
    roomId: number;
  };
  id: number;
  name: string;
  description: string;
  capacity: number;
  availableRoom: number;
  price: number;
  status: RoomStatus;
  propertyId: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function DataTabel({ props }: { props: DataTableProps }) {
  const value = dateConvert(props.createdAt.toISOString());
  return (
    <TableRow key={props.id}>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={props.images.imageUrl || ""}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{props.name}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            props.status === RoomStatus.OCCUPIED && "text-blue-500",
            props.status === RoomStatus.AVAILABLE && "text-green-500",
            props.status === RoomStatus.UNDER_MAINTENANCE && "text-yellow-500",
            props.status === RoomStatus.OUT_OF_SERVICE && "text-red-500"
          )}
        >
          {props.status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {props.property.name}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {props.availableRoom}
      </TableCell>
      <TableCell className="hidden md:table-cell">{props.capacity}</TableCell>
      <TableCell className="hidden md:table-cell">{props.price}</TableCell>
      <TableCell className="hidden md:table-cell">{value}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
