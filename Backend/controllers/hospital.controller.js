import express from "express";
import { Hospital } from "../models/hospital.model.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // GET THE NAME,EMAIL,PASSWORD FROM REQ.BODY
    // CHECK ALL DATA IS COMING FROM REQ.BODY

    const { name, email, password} = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    // Check if the email is already registered
    const hospital = await Hospital.findOne({ email });
    if (hospital) {
      return res.status(400).json({
        message: "Email already registered",
        success: false,
      });
    }
    // Create the hospital
    await Hospital.create({
      name,
      email,
      password,
    });
    return res.status(201).json({
      message: "Hospital registered successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    // GET THE EMAIL AND PASSWORD FROM REQ.BODY
    // CHECK ALL DATA IS COMING FROM REQ.BODY
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    // CHECK IN DATABASE IF USER IS EXIT OR NOT BY EMAIL
    // IF NOT THEN THROW THE ERROR
    let hospital = await Hospital.findOne({ email });
    if (!hospital) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    // CHECK THE PASSWORD BY USING BCRYPT COMPARE FUNCTION
    // IF PASSWORD IS NOT MATCH THEN THROW THE ERROR

    const isMatch = await hospital.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
        success: false,
      });
    }
    // IF PASSWORD IS MATCH THEN CREATE THE JWT TOKEN AND SEND IT TO THE USER
    // AND RETURN THE USER DATA EXCEPT PASSWORD
    const tokenData = {
      id: hospital._id,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    hospital = {
      _id: hospital._id,
      email: hospital.email,
      name: hospital.name,
    };
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${hospital.name}`,
        success: true,
        hospital,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        maxAge: 0,
        sameSite: "strict",
      })
      .json({
        message: "Logout successfully",
        success: true,
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

export const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({}).select("-password");
    return res.status(200).json({
      message: "All hospitals",
      success: true,
      hospitals,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
export const getHospitalById = async (req, res) => {
  try {
    const { id } = req.params;
    const hospital = await Hospital.findById(id).select("-password");
    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Hospital found",
      success: true,
      hospital,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
export const UpdateBloodBank = async (req, res) => {
  try {
    const { id } = req.params;
    const { A_pos, A_neg, B_pos, B_neg, AB_pos, AB_neg, O_pos, O_neg } =
      req.body;

    // Find the hospital by ID
    const hospital = await Hospital.findById(id);
    if (!hospital) {
      return res.status(404).json({
        message: "Hospital not found",
        success: false,
      });
    }

    // Update the blood bank details
    hospital.bloodBank = {
      A_pos,
      A_neg,
      B_pos,
      B_neg,
      AB_pos,
      AB_neg,
      O_pos,
      O_neg,
    };
    await hospital.save();

    return res.status(200).json({
      hospital,
      message: "Blood bank updated successfully",
      success: true,
    });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
    
  }
}
