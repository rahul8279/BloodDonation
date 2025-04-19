import mongoose from "mongoose";
import bcrypt from "bcryptjs";  

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
  },
  donationsReceived: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],

  requests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Request'
  }],
  bloodBank: {
    A_pos: { 
      type: Number, 
      default: 0 

    },
    A_neg: { 
      type: Number, 
      default: 0

     },
    B_pos: { 
      type: Number,
       default: 0

     },
    B_neg: { type: Number, 
      default: 0

     },
    AB_pos: { 
      type: Number,
       default: 0

     },
    AB_neg: {
       type: Number,
       default: 0

     },
    O_pos: { 
      type: Number, 
      default: 0 

    },
    O_neg: {
       type: Number,
       default: 0 

    },
  },
},{timestamps:true});

//save password
hospitalSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// comare the passsword
hospitalSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password,this.password)
}

export  const Hospital = mongoose.model("Hospital",hospitalSchema);