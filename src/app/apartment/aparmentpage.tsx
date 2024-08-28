"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  Search,
  MapPin,
  DoorClosed,
  Calendar,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { get_all_apartment } from "./apartment";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";

export default function ApartmentListPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["apartments"],
    queryFn: () => get_all_apartment(),
  });
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Property Rooms</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  if (isError) {
    return <h1>Error loading data</h1>;
  }

  if (!data) {
    return <h1>No data found</h1>;
  }
  const filteredApartments = data.filter(
    (apartment) =>
      apartment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apartment.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <main className="flex-grow">
        <section className="bg-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              Find Your Perfect Apartment
            </h1>
            <p className="text-xl mb-8">
              Discover comfortable living spaces tailored to your needs.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="Search apartments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow bg-white text-gray-900"
              />
              <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-400">
                Search
                <Search className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Available Apartments
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredApartments.map((apartment) => (
                <Card key={apartment.id} className="overflow-hidden">
                  <Image
                    src={apartment.images[0].url}
                    alt={apartment.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <CardHeader>
                    <CardTitle>{apartment.name}</CardTitle>
                    <Badge variant="secondary">{apartment.status}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      {apartment.description}
                    </p>
                    <div className="flex items-center text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-2" />
                      {apartment.address}
                    </div>
                    <div className="flex items-center">
                      <DoorClosed className="h-4 w-4 mr-1" />
                      <span>
                        {apartment.rooms.length}{" "}
                        {apartment.rooms.length === 1 ? "Room" : "Rooms"}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(apartment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Button
                      onClick={() => router.push(`/apartment/${apartment.id}`)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            {filteredApartments.length === 0 && (
              <p className="text-center text-gray-500 mt-8">
                No apartments found matching your search criteria.
              </p>
            )}
          </div>
        </section>

        <section className="bg-gray-200 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We're constantly updating our listings. Check back soon or contact
              us for personalized assistance.
            </p>
            <Button size="lg">Contact Us</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
