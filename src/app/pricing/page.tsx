import React from "react";

const PricingPage = () => {
  return (
    <div className="font-sans text-gray-800 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            AImath Teacher
          </div>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 transition duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 transition duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 font-semibold">
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 transition duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

     

      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AImath Teacher. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PricingPage;
