import { ReactNode } from "react";
import { Menu, Home, Users, BarChart, Settings } from "lucide-react";

import { validateRequest } from "@/utils/auth";
import { redirect } from "next/navigation";
export default async function MyDashBoardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={` fixed inset-y-0 left-0 z-50 w-64 bg-muted transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.link}
                className="flex items-center space-x-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </aside>
      {children}
      {/* Main content */}
    </div>
  );
}

const navItems = [
  { icon: Home, label: "Bookings", link: "/mydashboard" },
  { icon: Users, label: "roommate", link: "/mydashboard/roommate" },
  { icon: BarChart, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];
