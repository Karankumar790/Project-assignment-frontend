import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "framer-motion";
import {
  User,
  LogOut,
  BookOpenText,
  LayoutDashboard,
  SquarePlus,
} from "lucide-react";
import DarkMode from "@/DarkMode";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const hideSearchRoutes = ["/", "/login", "/signup"];
  const shouldHideSearch = hideSearchRoutes.includes(location.pathname);

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Logged out successfully.");
      navigate("/login");
    }
  }, [isSuccess]);

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/course/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/contact", label: "Contact Us" },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 70 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-gradient-to-r from-blue-50 via-white to-blue-50 dark:from-zinc-800 dark:to-zinc-900 shadow-md border-b border-zinc-200 dark:border-zinc-700"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center h-16 px-4 md:px-8">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-blue-700 dark:text-white hover:scale-105 transition-transform duration-300"
        >
          <img
            src="/Book2.png"
            alt="logo"
            className=" w-8 h-8 transition duration-300 dark:invert dark:brightness-200"
          />
          <span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold text-lg hover:drop-shadow-md transition duration-300"
          >
            Alpha-Task
          </span>
        </Link>

        {/* Right Side: Navigation + Search + Profile + Dark Mode */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6 text-[15px] font-semibold">
            {navLinks.map(({ to, label }) => {
              const isActive =
                to === "/course/search"
                  ? location.pathname.startsWith("/course/search")
                  : location.pathname === to;

              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative transition duration-300 ${
                    isActive
                      ? "text-purple-500 after:w-full font-bold"
                      : "text-gray-800 dark:text-gray-200 hover:text-purple-500  after:w-0"
                  } after:content-[''] after:absolute after:h-[2px] after:bg-purple-500 after:left-0 after:-bottom-1 after:transition-all after:duration-300`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Search */}
          {!shouldHideSearch && (
            <motion.form
              onSubmit={searchHandler}
              whileHover={{ scale: 1.02 }}
              className="hidden sm:flex items-center justify-end bg-white dark:bg-zinc-800 border rounded-full overflow-hidden shadow-sm"
            >
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search courses..."
                className="w-[160px] text-sm bg-transparent px-4 py-2 dark:text-white border-none"
              />
              <Button
                type="submit"
                className="rounded-none rounded-r-full bg-blue-600 hover:bg-blue-700 text-white px-5 text-sm transition"
              >
                Go
              </Button>
            </motion.form>
          )}

          {/* Auth / Profile */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform">
                  <Avatar>
                    <AvatarImage src={user.photoUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <motion.span
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="hidden md:block bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-extrabold text-lg hover:drop-shadow-md transition duration-300"
                  >
                    Hi 👋 {user.name}
                    <span className="ml-1 animate-ping text-pink-500 text-[10px]">
                      ★
                    </span>
                  </motion.span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-md">
                <DropdownMenuLabel className="text-center font-semibold">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/my-learning"
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    <BookOpenText size={16} />
                    My Learning
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    <User size={16} />
                    Edit Profile
                  </Link>
                </DropdownMenuItem>
                {user.role === "user" && (
                  <DropdownMenuItem asChild>
                    <Link
                      to="/posts"
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      <SquarePlus size={16} />
                      My Posts
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={logoutUser}
                  className="text-red-500 hover:text-red-600 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </DropdownMenuItem>
                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 hover:text-blue-600"
                      >
                        <LayoutDashboard size={16} />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="hover:bg-blue-100 hover:text-blue-600 transition"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow hover:scale-105 hover:shadow-lg transition-transform"
                onClick={() => navigate("/login")}
              >
                Signup
              </Button>
            </div>
          )}

          {/* Dark Mode Toggle */}
          <DarkMode />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
