import mongoose, { Schema, Document } from "mongoose";

export interface IBusinessOwner extends Document {
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessOwnerSchema = new Schema<IBusinessOwner>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const BusinessOwner = mongoose.model<IBusinessOwner>(
  "BusinessOwner",
  BusinessOwnerSchema
);
