import express from "express";
import { BloodRequest } from "../models/bloodRequest.model.js";
import { User } from "../models/user.model.js";
import { Hospital } from "../models/hospital.model.js";

export const createBloodRequest = async (req, res) => {
  try {
    const { bloodGroup, units, hospital, message } = req.body;
    if (!bloodGroup || !units || !hospital) {
      return res.status(400).json({
        message: "Blood group, units, and hospital are required",
        success: false,
      });
    }
    const requester = req.id; // Assuming you have middleware to set req.user
    const user = await User.findById(requester);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const bloodRequest = new BloodRequest({
      requester: requester,
      bloodGroup,
      units,
      hospital,
      message,
    });

    await bloodRequest.save();
    return res.status(201).json({
      message: "Blood request created successfully",
      success: true,
      bloodRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getBloodRequests = async (req, res) => {
  try {
    const bloodRequests = await BloodRequest.find()
      .populate("requester", "name email")
      .populate("hospital", "name location");
      if(!bloodRequests || bloodRequests.length === 0) {
        return res.status(404).json({
          message: "No blood requests found",
          success: false,
        });
      }
    return res.status(200).json({
      message: "Blood requests fetched successfully",
      success: true,
      bloodRequests,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const updateBloodRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["Fulfilled", "Cancelled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        success: false,
      });
    }

    const bloodRequest = await BloodRequest.findById(id);
    if (!bloodRequest) {
      return res.status(404).json({
        message: "Blood request not found",
        success: false,
      });
    }
    if (bloodRequest.hospital.toString() !== req.id.toString()) {
        return res.status(403).json({ 
          message: "Unauthorized",
          success: false,
          });
      }

    bloodRequest.status = status;
    await bloodRequest.save();
    // If approved, update hospital blood bank
        if (status === "Fulfilled") {
          const hospital = await Hospital.findById(bloodRequest.hospital);
          const bloodKey = convertToBloodKey(bloodRequest.bloodGroup);
          hospital.bloodBank[bloodKey] += bloodRequest.units;
          await hospital.save();
        }
    

    return res.status(200).json({
      message: "Blood request status updated successfully",
      success: true,
      bloodRequest,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
}
// 🔹 Utility: Convert A+ => A_pos, etc.
const convertToBloodKey = (bloodGroup) => {
    return bloodGroup.replace("+", "_pos").replace("-", "_neg");
  };
  