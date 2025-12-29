import mongoose from "mongoose";

const tenantProfileSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        age: Number,

        occupation: {
            type: String,
            enum: ["Student", "Working Professional"]
        },

        organization: String,

        budget: Number,

        preferredCity: String
    },
    { timestamps: true }
);

export default mongoose.model("TenantProfile", tenantProfileSchema);
