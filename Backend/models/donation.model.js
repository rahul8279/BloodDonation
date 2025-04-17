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
    }

  },
  { timestamps: true }
);

export const Donation =  mongoose.model("Donation", donationSchema);