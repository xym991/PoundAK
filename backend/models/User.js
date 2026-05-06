import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    password: { type: String },
    discordId: { type: String, unique: true },

    info: {
      firstName: { type: String },
      lastName: { type: String },
      playerTag: { type: String },
      birthday: { type: String },
      country: { type: String },
      gender: { type: String, enum: ["male", "female", "non-binary"] },
      image: { type: String },
    },
    badges: [{ type: String }],
    metrics: {
      weight: {
        value: { type: String },
        unit: { type: String },
      },
      height: {
        value: { type: String },
        unit: { type: String },
      },
      weightGoal: { type: String, enum: ["lose", "gain", "maintain"] },
      physiqueGoal: {
        type: String,
        enum: ["tone up", "bulk up", "get stronger"],
      },
      activityLevel: {
        type: String,
        enum: ["not active", "active", "very active"],
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
