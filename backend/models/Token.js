import mongoose from "mongoose";

// Define the schema for storing verification codes and tokens
const verificationTokenSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    verificationCode: {
      type: String,
      required: false,
      default: "", // Optional field to store the code
    },
    token: {
      type: String,
      required: false,
      default: "", // Optional field to store the token
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create a TTL index that expires documents after 1 hour (3600 seconds)
verificationTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

const VerificationToken = mongoose.model(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationToken;
