import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // optional if you have a User model
  },
  type: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

export default mongoose.model("Data", DataSchema);
