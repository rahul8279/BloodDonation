import express from "express"
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const register = async (req,res) => {
    // GET THE NAME,EMAIL,PASSWORD FROM REQ.BODY
    // CHECK ALL DATA IS COMING FROM REQ.BODY
    // CHECK BY EMAIL IN DATABASE IF USER ALREADY EXIT THEN THROW THE ERROR
    // IF NOT THEN CREATE THE USER

    try {
        const {name,email,password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message:"All fields are required",
                success:false
            })
        }
        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({
                message:"User is already registered with this email",
                success:false
            })
        };
        await User.create({
            name,
            email,
            password
        });
        return res.status(201).json({
            message:"User registered successfully",
            success:true
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const login = async (req,res) => {
    //GET THE EMAIL AND PASSWORD FROM REQ.BODY
    //CHECK ALL DATA IS COMING FROM REQ.BODY
    //CHECK IN DATABASE IF USER IS EXIT OR NOT BY EMAIL
    //IF NOT THEN THROW THE ERROR
    //IF YES THEN CHECK THE PASSWORD BY USING BCRYPT COMPARE FUNCTION
    //IF PASSWORD IS NOT MATCH THEN THROW THE ERROR
    //IF PASSWORD IS MATCH THEN CREATE THE JWT TOKEN AND SEND IT TO THE USER
    //AND RETURN THE USER DATA EXCEPT PASSWORD
    try {
        const {email,password} = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message:"All fields are required",
                success:false
            })
        };
        let user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({
                message:"user email and password is wrong.",
                success:false
            })
        };
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Incorrect password.",
                success: false
            });
        }
        const tokenData = {
            userId: user._id,
        }
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{
            expiresIn: "1d"
        });

        user = {
            _id: user._id,
            email: user.email,
            name: user.name,
        }
          return res.status(200).cookie("token",token,{
            httpOnly:true,
            maxAge: 1 * 24 * 60 * 60 * 1000,
            sameSite:"strict",
        }).json({
            message:`welcome back ${user.name}`,
            success:true,
            user,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
        
    }
}

export const logout = async (req,res) => {
    //CLEAR THE COOKIE AND SEND THE RESPONSE TO THE USER
    try {
        return res.status(200).cookie("token","",{maxAge: 0}).json({
            message:"Logout successfully",
            success:true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
        
    }
}

export const updateProfile = async (req,res) => {
    //
    try {
        const{name,email,bloodGroup,gender,phoneNumber} = req.body;
        // const userId = req.id;
        // console.log(userId);
        
        let user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({
                message:"User not found",
                success:false
            })
        };
        if (name) user.name = name;
        if (email) user.email = email;  
        if (bloodGroup) user.bloodGroup = bloodGroup;
        if (gender) user.gender = gender;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        await user.save();
         user = {
            _id: user._id,
            email: user.email,
            name: user.name,
            bloodGroup: user.bloodGroup,
            gender: user.gender,
            phoneNumber: user.phoneNumber
         }        
         return res.status(200).json({
            message:"Profile updated successfully",
            success:true,
            user,
         });
 
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}