import mongoose from "mongoose";
 
type Reader = {
  name: string;
  email: string;
  phone: string;
  address:string
}

const readerSchema = new mongoose.Schema<Reader>({
  
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: [2, " name must be at least 2 characters long"],
    maxlength: [50, " name cannot exceed 50 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already registered"],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    minlength: [10, "Phone number must be at least 10 characters long"],
    trim: true,
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    minlength: [5, "Address must be at least 5 characters long"],
    trim: true,
  },
})

export const ReaderModel = mongoose.model("Reader", readerSchema)
