import { SearchIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <SearchIcon className="w-8 h-8 text-blue-500 animate-pulse mr-2" />
          <span className="text-2xl font-semibold text-gray-700">
            Finding the best roommate
          </span>
        </div>
        <div className="flex space-x-2 justify-center items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
