import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  address?: string;
  image?: string;
  role: "USER" | "ADMIN" | "DELIVERY";
  provider: "credentials" | "google";
  isVerified: boolean;
  location?: {
    type: {
        type: StringConstructor;
        enum: string[];
        default: string;
    };
    coordinates: {
        type: NumberConstructor[];
        default: number[];
    };
  };
}
const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    password: { type: String, required: false },  // optional for Google users

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
      enum: ["USER", "ADMIN", "DELIVERY"],
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
    }
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
