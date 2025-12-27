import mongoose from "mongoose";
export interface IDeliveryAssignment {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  broadcastedTo: mongoose.Types.ObjectId[];
  assignedTo: mongoose.Types.ObjectId | null;
  status: "broadCasted" | "assigned" | "completed";
  acceptedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const deliveryAssignmentSchema = new mongoose.Schema<IDeliveryAssignment>(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    broadcastedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["broadCasted", "assigned", "completed"],
      default: "broadCasted",
    },
    acceptedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.DeliveryAssignment ||
  mongoose.model<IDeliveryAssignment>(
    "DeliveryAssignment",
    deliveryAssignmentSchema
  );
