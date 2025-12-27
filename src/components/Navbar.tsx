"use client"; // This component will run on the client (not the server)

import React, { use, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCartIcon,
  User,
  Package,
  LogOut,
  X,
  PlusCircle,
  Boxes,
  ClipboardCheck,
  Menu,
} from "lucide-react"; // Importing icons
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react"; // Animation library for transitions
import { signOut } from "next-auth/react"; // NextAuth logout function
import { useEffect } from "react";
import { createPortal } from "react-dom"; // Used to render sidebar outside normal DOM hierarchy
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // RootState type for Redux store

// User interface type
interface IUser {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  address?: string;
  image?: string;
  role: "USER" | "ADMIN" | "DELIVERY"; // User roles
  provider: "credentials" | "google";
  isVerified: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * Navbar Component
 * @param user -> logged in user data
 */
const Navbar = ({ user }: { user: IUser }) => {
  // State to toggle profile dropdown
  const [open, setOpen] = React.useState(false);

  // Ref to track dropdown for outside click detection
  const profileDropDown = useRef<HTMLDivElement>(null);

  // Ref for sidebar to detect outside clicks
  const sideBarRef = useRef<HTMLDivElement>(null);

  // State to toggle mobile search bar
  const [searchBarOpen, setSearchBarOpen] = React.useState(false);

  // State to toggle mobile menu
  const [menuOpen, setMenuOpen] = React.useState(false);

  //cart count from redux store
  const { cartData } = useSelector((state: RootState) => state.cart);

  // Close dropdown when user clicks outside element
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Close profile dropdown
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }

      // Close sidebar when clicking outside
      if (
        sideBarRef.current &&
        !sideBarRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on component unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sidebar for mobile view (Admin menu)
  const sideBar = menuOpen
    ? createPortal(
        // AnimatePresence enables exit animation
        <AnimatePresence>
          <motion.div
            ref={sideBarRef}
            initial={{ x: -100, opacity: 0 }} // Start hidden off-screen
            animate={{ x: 0, opacity: 1 }} // Slide in
            exit={{ x: -100, opacity: 0 }} // Slide out
            transition={{ type: "spring", stiffness: 100, damping: 14 }}
            className="fixed top-0 left-0 h-full w-[75%] sm:w-[60%] z-9999
            bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/90
            backdrop-blur-xl border-r border-green-400/20
            shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)]
            flex flex-col p-6 text-white"
          >
            {/* Admin Sidebar Header */}
            <div className="flex justify-between items-center mb-2">
              <h1 className="font-extrabold text-2xl tracking-wide text-white/90">
                Admin Panel
              </h1>
              <button
                className="text-white/80 hover:text-red-400 text-2xl font-bold transition"
                onClick={() => setMenuOpen(false)} // Close sidebar
              >
                X
              </button>
            </div>

            {/* User section inside sidebar */}
            <div className="flex items-center gap-3 p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-green-400/60 shadow-lg">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt="user"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <User /> // Default icon if image missing
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white">
                  {user.name?.split(" ")[0]} {/* Only first name */}
                </h2>
                <p className="text-xs text-green-200 capitalize tracking-wide">
                  {user.role} {/* Show role e.g., ADMIN */}
                </p>
              </div>
            </div>

            {/* Admin Navigation Links */}
            <div className="flex flex-col gap-3 font-medium mt-6">
              <Link
                href={"/admin/add-grocery"}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <PlusCircle className="w-5 h-5" /> Add Grocery
              </Link>
              <Link
                href={""}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <Boxes className="w-5 h-5" /> view Grocery
              </Link>
              <Link
                href={"/admin/manage-orders"}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
              >
                <ClipboardCheck className="w-5 h-5" /> Manage Orders
              </Link>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-white/20"></div>

            {/* Logout Button */}
            <div
              className="flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all cursor-pointer"
              onClick={async () => await signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-5 h-5 text-red-300" />
              Logout
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )
    : null;

  return (
    <div
      className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500
      to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4
      md:px-8 z-50"
    >
      {/* Brand Logo */}
      <Link
        href={"/"}
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide
        hover:scale-105 transition-transform"
      >
        Snapcart
      </Link>

      {/* Desktop Search input visible only for USER role */}
      {user.role === "USER" && (
        <form
          className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg
        shadow-md"
        >
          <Search className="text-gray-500 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search groceries..."
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </form>
      )}

      <div className="flex items-center gap-3 md:gap-6 relative">
        {/* Mobile Search Toggle Button */}
        {user.role === "USER" && (
          <>
            <div
              onClick={() => setSearchBarOpen((prev) => !prev)}
              className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md
              hover:scale-105 transition md:hidden"
            >
              <Search className="text-green-600 w-6 h-6" />
            </div>

            {/* Cart Button */}
            <Link
              href={"/user/cart"}
              className="relative bg-white rounded-full w-11 h-11 flex items-center
              justify-center shadow-md hover:scale-105 transition"
            >
              <ShoppingCartIcon className="text-green-600 w-6 h-6" />
              {/* Static cart count */}
              <span
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex
              items-center justify-center rounded-full font-semibold shadow"
              >
                {cartData.length}
              </span>
            </Link>
          </>
        )}

        {/* Admin Desktop Navigation */}
        {user.role == "ADMIN" && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href={"/admin/add-grocery"}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
              >
                <PlusCircle className="w-5 h-5" /> Add Grocery
              </Link>
              <Link
                href={""}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
              >
                <Boxes className="w-5 h-5" /> view Grocery
              </Link>
              <Link
                href={"/admin/manage-orders"}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
              >
                <ClipboardCheck className="w-5 h-5" /> Manage Orders
              </Link>
            </div>

            {/* Mobile admin menu button */}
            <div
              className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <Menu className="text-green-600 w-6 h-6" />
            </div>
          </>
        )}

        {/* Profile Dropdown */}
        <div className="relative " ref={profileDropDown}>
          <div
            className="relative bg-white rounded-full w-11 h-11 flex items-center
                justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setOpen((prev) => !prev)} // Toggle dropdown
          >
            {/* Show profile image or default icon */}
            {user?.image ? (
              <Image
                src={user.image}
                alt="user"
                fill
                sizes="44px"
                className="object-cover rounded-full"
              />
            ) : (
              <User className="text-gray-600 w-6 h-6" />
            )}
          </div>

          {/* Dropdown Animation */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-50"
              >
                {/* User Info */}
                <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                  <div
                    className="w-10 h-10 relative rounded-full bg-green-100 flex items-center justify-center
                    overflow-hidden"
                  >
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt="user"
                        fill
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <User className="text-green-600 w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="text-gray-800 font-semibold">
                      {user.name?.split(" ")[0]}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>

                {/* Orders for USER account only */}
                {user.role === "USER" && (
                  <Link
                    href={"/user/my-orders"}
                    className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium"
                    onClick={() => setOpen(false)}
                  >
                    <Package className="w-5 h-5 text-green-600" />
                    My Orders
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg
                  text-gray-700 font-medium cursor-pointer"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/auth/login" });
                  }}
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile search popup */}
          <AnimatePresence>
            {searchBarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2"
              >
                <Search className="text-gray-500 w-5 h-5 mr-2" />
                <form className="grow">
                  <input
                    type="text"
                    className="w-full outline-none text-gray-700"
                    placeholder="search groceries..."
                  />
                </form>
                <button onClick={() => setSearchBarOpen(false)}>
                  <X className="text-gray-500 w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sidebar portal output */}
          {sideBar}
        </div>
      </div>
    </div>
  );
};

export default Navbar; // Export component
