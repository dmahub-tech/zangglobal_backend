// models/Attendant.js

import mongoose, {Schema} from "mongoose";
const attendantSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
      default: "",
    },
    position: {
      type: String,
      trim: true,
      default: "",
    },
    residence: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Guest / Attendee",
        "Exhibitor",
        "Sponsor / Partner",
        "Media Representative",
      ],
    },
    attendance: {
      type: String,
      required: true,
      enum: ["In Person", "Virtual (Livestream Access)"],
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    updates: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const  Attendant =  mongoose.model("Attendant", attendantSchema);
export default Attendant;