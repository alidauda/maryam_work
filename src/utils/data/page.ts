import prisma from "@/utils/db";

export async function create_hostel() {
  const data = await prisma.hostel.create({
    data: {},
  });
}

export async function get_total_count() {
  const data = await prisma.$transaction([
    prisma.property.count(),
    prisma.room.count(),
    prisma.booking.count(),
    prisma.room.count({ where: { status: "AVAILABLE" } }),
  ]);
  return data;
}

export async function get_total_rooms() {
  const data = await prisma.room.count();
  return data;
}

export async function get_total_bed() {
  const data = await prisma.bed.count();
  return data;
}
