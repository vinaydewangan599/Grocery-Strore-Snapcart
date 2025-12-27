// ✅ CORRECTED User Model
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  address?: string;
  image?: string;
  role: "USER" | "ADMIN" | "DELIVERY_BOY";
  provider: "credentials" | "google";
  isVerified: boolean;
  
  // ✅ FIX: Correct GeoJSON interface
  location?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };

  socketId?: string;
  isOnline?: boolean;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    provider: {
      type: String,
      enum: ["credentials", "google"],
      default: "credentials",
    },
    mobile: String,
    address: String,
    image: String,
    role: {
      type: String,
      enum: ["USER", "ADMIN", "DELIVERY_BOY"],
      default: "USER",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0]
      }
    },
    socketId: {
      type: String,
      default: null
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.index({ location: "2dsphere" });

// Hash password before saving
UserSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;