import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        profilePic: String,

        role: {
            type: String,
            enum: ["tenant", "owner", "both"],
            default: "tenant"
        },

        phone: String,

        verification: {
            googleVerified: {
                type: Boolean,
                default: true
            },
            phoneProvided: {
                type: Boolean,
                default: false
            }
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
