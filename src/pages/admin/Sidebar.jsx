import BackButton from "@/components/BackButton";
import { ChartNoAxesColumn, SquareLibrary, TableOfContents, User,ImagePlay   } from "lucide-react";
import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  {
    label: "Dashboard",
    icon: <ChartNoAxesColumn size={20} />,
    path: "dashboard",
  },
  {
    label: "Courses",
    icon: <SquareLibrary size={20} />,
    path: "course",
  },
   {
    label: "User Queries",
    icon: <TableOfContents size={20} />,
    path: "Queries",
  },
   {
    label: "Users",
    icon: <User size={20} />,
    path: "users",
  },
  {
    label: "All User Posts",
    icon: <ImagePlay size={20} />,
    path: "all-user-posts",
  }
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-[250px] sm:w-[280px] bg-white/90 dark:bg-gray-900/90 backdrop-blur border-r border-gray-200 dark:border-gray-700 shadow-lg p-6 sticky top-0 transition-all transform hover:scale-105 duration-300">
        
        {/* Centering the Admin text */}
        <div className="flex items-center justify-center mb-8">
        <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center text-4xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md "
      >
        Admin
      </motion.h1>
        </div>

        <nav className="space-y-6">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link
                to={item.path}
                key={item.path}
                className={`flex items-center gap-4 px-5 py-3 rounded-lg transition-all duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105 
                  ${isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-white dark:hover:text-blue-400"
                  }
                `}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-12 text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} EduAdmin. All rights reserved.
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 sm:p-10 bg-gray-50 dark:bg-gray-950 transition-all">
        <Outlet />
      </main>
      <BackButton/>
    </div>
  );
};

export default Sidebar;
