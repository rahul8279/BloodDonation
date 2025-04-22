import express from 'express';
import { Donation } from '../models/donation.model.js';
import { Hospital } from '../models/hospital.model.js';


// Create a new donation (User)
export const createDonation = async (req, res) => {
  try {
    const { bloodGroup, hospital, healthInfo } = req.body;
      
    
    const userId = req.id
    
    const donation = new Donation({
      donor: userId,
      hospital,
      bloodGroup,
      healthInfo,
      status: "pending", // default
    });

    const savedDonation = await donation.save();

    // Add donation to hospital record
    await Hospital.findByIdAndUpdate(hospital, {
      $push: { donationsReceived: savedDonation._id }
    });

    res.status(201).json({
         message: "Donation requested successfully", 
         donation: savedDonation ,
         success: true,
        });
  } catch (err) {
    console.error(err);
    res.status(500).json({
         message: "Error creating donation",
         success: false,
        });
  }
};


// 🔸 Get all donations (hospital)
export const getAllDonations = async (req, res) => {
  try {
    const donations = await Donation.find()
      .populate("donor", "-password")
      .populate("hospital");
      
    res.status(200).json({
        message: "All donations fetched successfully",
        donations,
        success: true,
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({
         message: "Error fetching donations", 
         success: false,
        });
  }
};


// // 🔸 Get donations by hospital (Pending or all)
// export const getHospitalDonations = async (req, res) => {
//   try {
//     const { hospitalId } = req.params;
//     const { status } = req.query;

//     const filter = { hospital: hospitalId };
//     if (status) filter.status = status;

//     const donations = await Donation.find(filter)
//       .populate("donor", "-password");

//     res.status(200).json(donations);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching hospital donations", error: err.message });
//   }
// };


// 🔸 Hospital accepts or rejects a donation
export const updateDonationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    console.log(req.id);
    

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
         message: "Invalid status" ,
        success: false,
        });
    }

    const donation = await Donation.findById(id);
    if (!donation) {
        return res.status(404).json({ 
        message: "Donation not found" });
        }
        
    // Check if current hospital matches
    if (donation.hospital.toString() !== req.id.toString()) {
      return res.status(403).json({ 
        message: "Unauthorized",
        success: false,
        });
    }

    donation.status = status;
    await donation.save();

    // If approved, update hospital blood bank
    if (status === "approved") {
      const hospital = await Hospital.findById(donation.hospital);
      const bloodKey = convertToBloodKey(donation.bloodGroup);
      hospital.bloodBank[bloodKey] += donation.quantity;
      await hospital.save();
    }

    res.status(200).json({
       message: `Donation ${status}`, 
       donation ,
       success: true,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
       message: "Error updating status", 
       success: false,
      });
  }
};

// 🔹 Utility: Convert A+ => A_pos, etc.
const convertToBloodKey = (bloodGroup) => {
  return bloodGroup.replace("+", "_pos").replace("-", "_neg");
};
