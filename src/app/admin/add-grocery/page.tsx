"use client";
import React from "react";
import { ArrowLeft, PlusCircle, Upload,Loader} from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import axios from "axios";


const categories = [
  "Fruits & Vegetables",
  "Dairy & Eggs",
  "Rice, Atta & Grains",
  "Snacks & Biscuits",
  "Spices & Masalas",
  "Beverages & Drinks",
  "Personal Care",
  "Household Essentials",
  "Instant & Packaged Food",
  "Baby & Pet Care",
];

const units = ["kg", "grams", "litre", "piece", "ml", "pack"];

const AddGrocery = () => {
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);
  const [backendImage, setBackendImage] = React.useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setBackendImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("unit", unit);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      const response = await axios.post("/api/admin/add-grocery", formData);
      console.log(response.data);

      alert("Grocery Added Successfully!");
      setLoading(false);

      setName("");
      setCategory("");
      setPrice("");
      setUnit("");
      setPreviewImage(null);
      setBackendImage(null);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white py-16 px-4 relative">
      <Link
        href={"/"}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:flex">Back to home</span>
      </Link>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <PlusCircle className="text-green-600 w-8 h-8" />
            <h1 className="text-2xl font-semibold">Add Your Grocery</h1>
          </div>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Fill out the details below to add a new grocery item.
          </p>
        </div>

        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Grocery Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="eg: sweets, Milk ..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all *:bg-white"
              >
                <option value="">Select Category</option>
                {categories.map((cat,i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Unit <span className="text-red-500">*</span>
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all *:bg-white"
              >
                <option value="">Select Unit</option>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="price" className="block text-gray-700 font-medium mb-1">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="price"
              placeholder="eg. 100"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <label
              htmlFor="image"
              className="cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 transition-all w-full sm:w-auto"
            >
              <Upload className="w-5 h-5" /> Upload Image
            </label>

            <input type="file" id="image" accept="image/*" hidden onChange={handleImageChange} />

            {previewImage && (
              <Image
                src={previewImage}
                width={100}
                height={100}
                alt="image"
                className="rounded-xl shadow-md border border-gray-200 object-cover"
              />
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled = {loading}
            className="mt-4 w-full bg-linear-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-60 transition-all flex items-center justify-center gap-2"
          >
            {loading? <Loader className="w-5 h-5 animate-spin"/>:"Add Grocery"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGrocery;
