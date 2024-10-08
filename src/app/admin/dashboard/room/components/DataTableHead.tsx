import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DataTableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead className="hidden md:table-cell">Apartment</TableHead>
          <TableHead className="hidden md:table-cell">
            available rooms
          </TableHead>
          <TableHead>Capcity</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="hidden md:table-cell">Created at</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{children}</TableBody>
    </Table>
  );
}
