// "use client";
// import React from "react";
// import {
//   Apple,
//   Milk,
//   Wheat,
//   Cookie,
//   Flame,
//   Coffee,
//   Heart,
//   Home,
//   Box,
//   Baby,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"; // Lucide icons used for category UI icons
// import { motion } from "motion/react"; // Motion library for animations
// import { useRef, useState, useEffect } from "react"; // React hooks for state, refs, lifecycle effects

// // Category Slider Component
// const CategorySlider = () => {
//   // List of categories with IDs, labels, icons, and background colors
//   const categories = [
//     { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
//     { id: 2, name: "Dairy & Eggs", icon: Milk, color: "bg-yellow-100" },
//     { id: 3, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },
//     { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },
//     { id: 5, name: "Spices & Masalas", icon: Flame, color: "bg-red-100" },
//     { id: 6, name: "Beverages & Drinks", icon: Coffee, color: "bg-blue-100" },
//     { id: 7, name: "Personal Care", icon: Heart, color: "bg-purple-100" },
//     { id: 8, name: "Household Essentials", icon: Home, color: "bg-lime-100" },
//     { id: 9, name: "Instant & Packaged Food", icon: Box, color: "bg-teal-100" },
//     { id: 10, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100" },
//   ];

//   // State to show/hide scroll arrows depending on scroll position
//   const [showLeftArrow, setShowLeftArrow] = React.useState(true);
//   const [showRightArrow, setShowRightArrow] = React.useState(true);

//   // Ref for horizontal scroll container
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Function to auto-scroll slider left/right manually
//   const scroll = (direction: "left" | "right") => {
//     if (!scrollRef.current) return; // Return if ref not ready
//     const scrollAmount = direction == "left" ? -300 : 300; // Default scroll value
//     scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" }); // Perform scroll
//   };

//   // Function to detect start/end scroll position and hide arrows accordingly
//   const checkScroll = () => {
//     if (!scrollRef.current) return; // Safety check
//     const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current; // Extract values from ref

//     setShowLeftArrow(scrollLeft > 0); // Show left arrow only if not at start
//     setShowRightArrow(scrollLeft + clientWidth <= scrollWidth - 5); // Show right only if space is left
//   };

//   // Add scroll event listener on mount and cleanup on unmount
//   useEffect(() => {
//     scrollRef.current?.addEventListener("scroll", checkScroll); // Track scroll movement
//     checkScroll(); // Run initially to set arrow visibility
//     return () => removeEventListener("scroll", checkScroll); // Cleanup listener
//   }, []);

//   // Auto-scroll functionality every 4 seconds
//   useEffect(() => {
//     const autoScroll = setInterval(() => {
//       if (!scrollRef.current) return; // Prevent runtime errors
//       const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

//       // When reaching end → loop back to start, else continue scrolling forward
//       if (scrollLeft + clientWidth >= scrollWidth - 5) {
//         scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
//       } else {
//         scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
//       }
//     }, 4000); // Auto scroll speed

//     return () => clearInterval(autoScroll); // Cleanup interval
//   }, []);

//   // Component Return UI
//   return (
//     <motion.div
//       className="w-[90%] md:w-[80%] mx-auto mt-10 relative" // container width and center layout
//       initial={{ opacity: 0, y: 50 }} // initial animation values
//       whileInView={{ opacity: 1, y: 0 }} // animate into view
//       transition={{ duration: 0.6 }} // animation duration
//       viewport={{ once: false, amount: 0.5 }} // animation trigger rules
//     >
//       <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
//         🛒 Shop by Category
//       </h2>

//       {/* Left scroll button */}
//       {showLeftArrow && (
//         <button
//           className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
//           onClick={() => scroll("left")}
//         >
//           <ChevronLeft className="w-6 h-6 text-green-700" />
//         </button>
//       )}

//       {/* Scrollable category container */}
//       <div
//         className="flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth"
//         ref={scrollRef} // assigned scroll reference
//       >
//         {/* Mapping category items */}
//         {categories.map((cat) => {
//           const Icon = cat.icon; // Extract icon for rendering
//           return (
//             <motion.div
//               key={cat.id}
//               className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl ${cat.color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
//             >
//               <div className="flex flex-col items-center justify-center p-5">
//                 <Icon className="w-10 h-10 text-green-700 mb-3" /> {/* Category Icon */}
//                 <p className="text-center text-sm md:text-base font-semibold text-gray-700">
//                   {cat.name} {/* Category Name */}
//                 </p>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Right scroll button */}
//       {showRightArrow && (
//         <button
//           className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
//           onClick={() => scroll("right")}
//         >
//           <ChevronRight className="w-6 h-6 text-green-700" />
//         </button>
//       )}
//     </motion.div>
//   );
// };

// export default CategorySlider;

"use client"; // Enables client-side rendering in Next.js

import React, { useRef, useState, useEffect, useCallback } from "react"; // Importing React and hooks
import {
  Apple,
  Milk,
  Wheat,
  Cookie,
  Flame,
  Coffee,
  Heart,
  Home,
  Box,
  Baby,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"; // Import category icons
import { motion } from "motion/react"; // Motion animation library

// Constant scroll distance for reusable scroll movement
const SCROLL_AMOUNT = 300;

// =========================== CATEGORY TILE COMPONENT =========================== //
// Separate component for individual category tile UI
// Type definition for CategoryTile props
interface CategoryTileProps {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  color: string;
}

const CategoryTile = ({ icon: Icon, name, color }: CategoryTileProps) => (
  <motion.div
    className={`min-w-[150px] md:min-w-[180px] flex flex-col items-center justify-center rounded-2xl ${color} shadow-md hover:shadow-xl transition-all cursor-pointer`}
  >
    <div className="flex flex-col items-center justify-center p-5">
      <Icon className="w-10 h-10 text-green-700 mb-3" />
      <p className="text-center text-sm md:text-base font-semibold text-gray-700">
        {name}
      </p>
    </div>
  </motion.div>
);

// =========================== MAIN CATEGORY SLIDER COMPONENT =========================== //
const CategorySlider = () => {
  // List of categories to display
  const categories = [
    { id: 1, name: "Fruits & Vegetables", icon: Apple, color: "bg-green-100" },
    { id: 2, name: "Dairy & Eggs", icon: Milk, color: "bg-yellow-100" },
    { id: 3, name: "Rice, Atta & Grains", icon: Wheat, color: "bg-orange-100" },
    { id: 4, name: "Snacks & Biscuits", icon: Cookie, color: "bg-pink-100" },
    { id: 5, name: "Spices & Masalas", icon: Flame, color: "bg-red-100" },
    { id: 6, name: "Beverages & Drinks", icon: Coffee, color: "bg-blue-100" },
    { id: 7, name: "Personal Care", icon: Heart, color: "bg-purple-100" },
    { id: 8, name: "Household Essentials", icon: Home, color: "bg-lime-100" },
    { id: 9, name: "Instant & Packaged Food", icon: Box, color: "bg-teal-100" },
    { id: 10, name: "Baby & Pet Care", icon: Baby, color: "bg-rose-100" },
  ];

  // State variables for arrow controls visibility
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Reference to scrollable container
  const scrollRef = useRef<HTMLDivElement>(null);

  // =========================== SCROLL HANDLER =========================== //
  // Handles left/right scroll based on direction
  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return; // Avoid null reference

    scrollRef.current.scrollBy({
      left: direction === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: "smooth", // Smooth scrolling
    });
  }, []);

  // =========================== SCROLL POSITION CHECKER =========================== //
  // Determines whether arrows should appear based on position
  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setShowLeftArrow(scrollLeft > 0); // Show left arrow if not at start
    setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 5); // Show right arrow if not at end
  }, []);

  // =========================== SCROLL EVENT LISTENER =========================== //
  useEffect(() => {
    const currentRef = scrollRef.current;
    if (!currentRef) return;

    currentRef.addEventListener("scroll", checkScroll); // Track scroll movement
    checkScroll(); // Run initially to set arrow visibility

    return () => currentRef.removeEventListener("scroll", checkScroll); // Cleanup
  }, [checkScroll]);

  // =========================== AUTO-SCROLL EFFECT =========================== //
  useEffect(() => {
    const interval = setInterval(() => {
      if (!scrollRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // If reached end → restart
      if (scrollLeft + clientWidth >= scrollWidth - 5) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: SCROLL_AMOUNT, behavior: "smooth" }); // Continue
      }
    }, 4000); // Auto scroll every 4 seconds

    return () => clearInterval(interval); // Cleanup timer
  }, []);

  // =========================== UI COMPONENT RENDER =========================== //
  return (
    <motion.div
      className="w-[90%] md:w-[80%] mx-auto mt-10 relative" // Layout and spacing
      initial={{ opacity: 0, y: 50 }} // Starting animation
      whileInView={{ opacity: 1, y: 0 }} // Play when visible
      transition={{ duration: 0.6 }}
      viewport={{ once: false, amount: 0.5 }} // Trigger rules
    >
      <h2 className="text-2xl md:text-3xl font-bold text-green-700 mb-6 text-center">
        🛒 Shop by Category
      </h2>

      {/* LEFT ARROW CONTROL */}
      {showLeftArrow && (
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="w-6 h-6 text-green-700" />
        </button>
      )}

      {/* SCROLLABLE CONTAINER */}
      <div
        className="flex gap-6 overflow-x-auto px-10 pb-4 scrollbar-hide scroll-smooth"
        ref={scrollRef} // Attach reference to scrollable area
      >
        {/* Render category tiles */}
        {categories.map((cat) => (
          <CategoryTile key={cat.id} {...cat} />
        ))}
      </div>

      {/* RIGHT ARROW CONTROL */}
      {showRightArrow && (
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg hover:bg-green-100 rounded-full w-10 h-10 flex items-center justify-center transition-all"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="w-6 h-6 text-green-700" />
        </button>
      )}
    </motion.div>
  );
};

export default CategorySlider; // Export default component