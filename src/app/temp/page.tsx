import React from "react";

const LandingPage = () => {
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
                  href="#home"
                  className="hover:text-blue-600 transition duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-blue-600 transition duration-300"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-blue-600 transition duration-300"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-blue-600 transition duration-300"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Revolutionize Your Math Learning
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            Unlock the power of AI to master mathematics effortlessly
          </p>
          <a
            href="#"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 hover:shadow-lg hover:opacity-90"
          >
            Start Learning Now
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white p-8 rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
            <div className="text-5xl mb-4 text-blue-600">🧠</div>
            <h3 className="text-2xl font-semibold mb-4">Smart Tutoring</h3>
            <p className="text-gray-600">
              Get personalized answers to any math question instantly
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
            <div className="text-5xl mb-4 text-blue-600">📊</div>
            <h3 className="text-2xl font-semibold mb-4">Interactive Graphs</h3>
            <p className="text-gray-600">
              Visualize complex functions and data with ease
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-lg transition duration-300 hover:shadow-xl">
            <div className="text-5xl mb-4 text-blue-600">🔷</div>
            <h3 className="text-2xl font-semibold mb-4">Geometry Mastery</h3>
            <p className="text-gray-600">
              Explore geometric concepts with clear, AI-generated illustrations
            </p>
          </div>
        </div>
      </main>
      <main className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">
          Choose Your Plan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Basic Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Basic
              </h2>
              <p className="text-gray-600 mb-6">
                Perfect for students just starting out
              </p>
              <p className="text-4xl font-bold text-gray-800 mb-6">
                $9.99
                <span className="text-lg font-normal text-gray-600">
                  /month
                </span>
              </p>
              <ul className="text-gray-600 mb-6">
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Unlimited math questions
                </li>
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Basic graph plotting
                </li>
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Step-by-step solutions
                </li>
              </ul>
            </div>
            <div className="p-4">
              <button className="w-full bg-blue-600 text-white rounded-full px-4 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                Choose Basic
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden border-4 border-blue-600">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">Pro</h2>
              <p className="text-gray-600 mb-6">
                For dedicated learners seeking more
              </p>
              <p className="text-4xl font-bold text-gray-800 mb-6">
                $19.99
                <span className="text-lg font-normal text-gray-600">
                  /month
                </span>
              </p>
              <ul className="text-gray-600 mb-6">
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  All Basic features
                </li>
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Advanced graph plotting
                </li>
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Interactive geometry tools
                </li>
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Practice quizzes
                </li>
              </ul>
            </div>
            <div className="p-4">
              <button className="w-full bg-blue-600 text-white rounded-full px-4 py-2 font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                Choose Pro
              </button>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Enterprise
              </h2>
              <p className="text-gray-600 mb-6">
                For schools and large organizations
              </p>
              <p className="text-4xl font-bold text-gray-800 mb-6">Custom</p>
              <ul className="text-gray-600 mb-6">
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  All Pro features
                </li>
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Customizable curriculum
                </li>
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Analytics dashboard
                </li>
                <li className="mb-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>
            <div className="p-4">
              <button className="w-full bg-gray-800 text-white rounded-full px-4 py-2 font-semibold hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-8 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AImath Teacher. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
