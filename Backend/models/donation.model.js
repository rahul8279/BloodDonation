import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hospital",
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    healthInfo: {
        occupation: String,
        isMarried: Boolean,
        weight: Number,
        anyMedications: String,
        allergies: String
    },
    lastDonationDate: {
      type: Date,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1, // units of blood
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },  
    
  },
  { timestamps: true }
);

export const Donation =  mongoose.model("Donation", donationSchema);