"use client";

import React from "react";
import {
  ArrowLeft,
  Leaf,
  Lock,
  Mail,
  EyeOff,
  EyeIcon,
  LogIn,
  Loader2,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import googleLogo from "@/assets/google-logo.png";
import axios from "axios";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";


const LoginForm = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();   
  const session = useSession();
  console.log(session);
 

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  const response = await signIn("credentials", {
    redirect: false,
    email,
    password,
  });

  console.log("Login response:", response);

  if (response?.ok) {
    router.push("/");
  } else {
    console.error("Login failed");
  }

  setLoading(false);
};


  const formValidation = email !== "" && password !== "";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
     

      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Welcome Back
      </motion.h1>

      <p className="text-gray-600 mb-8 flex items-center gap-1">
        Login to Snapcart <Leaf className="w-5 h-5 text-green-600" />
      </p>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-5 w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Email Address"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <EyeOff
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <EyeIcon
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!formValidation || loading}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 ${
            formValidation
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
        </button>

        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200"></span>
          OR
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        <button className="cursor-pointer w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200"
          onClick={() => signIn("google", { callbackUrl: "/" })}>
          <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
          Continue with Google
        </button>
      </motion.form>

      <p className="cursor-pointer text-gray-600 mt-6 text-sm flex items-center gap-1" 
        onClick={() => router.push("/auth/register")}>
        Don&apos;t have an account? <UserPlus className="w-4 h-4" />
        <span className="text-green-600 font-semibold hover:underline">
          Register
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
