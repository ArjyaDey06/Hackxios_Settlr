import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },

    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    messages: [
      {
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        text: String,
        timestamp: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
