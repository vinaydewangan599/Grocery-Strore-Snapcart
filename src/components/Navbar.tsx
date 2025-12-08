"use client"; // This component will run on the client side (not server)

import React, { use, useRef } from "react";
import Link from "next/link";
import { Search, ShoppingCartIcon, User, Package, LogOut, X } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

interface IUser {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  address?: string;
  image?: string;
  role: "USER" | "ADMIN" | "DELIVERY";
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

  // State to toggle mobile search bar
  const [searchBarOpen, setSearchBarOpen] = React.useState(false);

  // Close dropdown when user clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropDown.current &&
        !profileDropDown.current.contains(e.target as Node)
      ) {
        setOpen(false); // close dropdown
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500
      to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4
      md:px-8 z-50"
    >
      {/* Brand Logo / Home Link */}
      <Link
        href={"/"}
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide
        hover:scale-105 transition-transform"
      >
        Snapcart
      </Link>

      {/* Desktop Search Bar */}
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

      <div className="flex items-center gap-3 md:gap-6 relative">

        {/* Mobile Search Toggle */}
        <div
          onClick={() => setSearchBarOpen((prev) => !prev)}
          className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md
            hover:scale-105 transition md:hidden"
        >
          <Search className="text-green-600 w-6 h-6" />
        </div>

        {/* Cart Button */}
        <Link
          href={""}
          className="relative bg-white rounded-full w-11 h-11 flex items-center
            justify-center shadow-md hover:scale-105 transition"
        >
          <ShoppingCartIcon className="text-green-600 w-6 h-6" />
          {/* Static cart count */}
          <span
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex
            items-center justify-center rounded-full font-semibold shadow"
          >
            0
          </span>
        </Link>

        {/* Profile Dropdown */}
        <div className="relative " ref={profileDropDown}>
          <div
            className="relative bg-white rounded-full w-11 h-11 flex items-center
                justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer"
            onClick={() => setOpen((prev) => !prev)}
          >
            {/* If user has image show image otherwise icon */}
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
                {/* User Info section */}
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
                      {user.name?.split(" ")[0]} {/* First name only */}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role} {/* USER / ADMIN / DELIVERY */}
                    </div>
                  </div>
                </div>

                {/* Orders Link */}
                <Link
                  href={""}
                  className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium"
                  onClick={() => setOpen(false)}
                >
                  <Package className="w-5 h-5 text-green-600" />
                  My Orders
                </Link>

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

          {/* Mobile search input pop-up */}
          <AnimatePresence>
            {searchBarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2"
              >
                <Search className='text-gray-500 w-5 h-5 mr-2'/>
                <form className='grow'>
                  <input 
                    type="text" 
                    className='w-full outline-none text-gray-700' 
                    placeholder='search groceries...'
                  />
                </form>
                <button onClick={() => setSearchBarOpen(false)}>
                  <X className='text-gray-500 w-5 h-5'/>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
