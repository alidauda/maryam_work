import {
  Home,
  Star,
  Users,
  Search,
  MapPin,
  HeartHandshake,
  Coffee,
  Music,
  Moon,
  Sun,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { get_all_apartment } from "@/utils/data/page";
import Footer from "./footer";
import Header from "./header";

export default async function LandingPage() {
  const apartments = await get_all_apartment();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow">
        <section className="bg-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                Find Your Perfect Room & Roommate Match
              </h1>
              <p className="text-xl mb-8">
                Discover your ideal living space and a roommate you'll actually
                get along with!
              </p>
              <Link
                href="/apartment"
                className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-200"
              >
                Start Your Search
                <Search className="inline-block ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Search Rooms
                </h3>
                <p className="text-gray-600">
                  Browse through our curated list of available rooms near your
                  university.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Check Compatibility
                </h3>
                <p className="text-gray-600">
                  See your compatibility score with potential roommates based on
                  lifestyle and preferences.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mb-4">
                  <HeartHandshake className="text-white h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Connect & Move In
                </h3>
                <p className="text-gray-600">
                  Chat with your matches, find your perfect fit, and start your
                  new chapter!
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Featured Apartments
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {apartments.length > 0 &&
                apartments.slice(0, 3).map((apartment) => (
                  <div
                    key={apartment.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                  >
                    <Image
                      src={apartment.images[0].url}
                      alt={apartment.name}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">
                        {apartment.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                        <span className="text-sm text-gray-600">
                          {apartment.address}
                        </span>
                      </div>
                      <div className="flex items-center mb-4">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium text-gray-700">
                          4.8 (120 reviews)
                        </span>
                      </div>
                      <Link
                        href={`/apartment/${apartment.id}`}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Compatibility Factors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <Coffee className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Lifestyle Habits
                </h3>
                <p className="text-gray-600">
                  Early bird or night owl? We match you with roommates who share
                  your rhythm.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Music className="h-12 w-12 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Interests & Hobbies
                </h3>
                <p className="text-gray-600">
                  Find roommates who share your passions, from music to sports
                  and everything in between.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <Moon className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  Sleep Schedule
                </h3>
                <p className="text-gray-600">
                  We consider sleep patterns to ensure peaceful nights and
                  harmonious mornings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              What Students Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-600 mb-4">
                    "Not only did I find an awesome room, but I also got paired
                    with a roommate who's become my best friend. The
                    compatibility score was spot on!"
                  </p>
                  <div className="flex items-center">
                    <Image
                      src={`/placeholder.svg?height=40&width=40`}
                      alt="Student"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">
                        Sam Thompson
                      </p>
                      <p className="text-sm text-gray-600">
                        University of Harmony
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-purple-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Find Your Perfect Room & Roommate?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of students who've found their ideal living
                situation and made lifelong friends!
              </p>
              <Link
                href="/apartment"
                className="bg-yellow-500 text-gray-900 hover:bg-yellow-400 px-6 py-3 rounded-md text-lg font-semibold transition-colors duration-200"
              >
                Start Your Search Now
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
