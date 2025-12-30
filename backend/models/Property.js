import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: String,
      ref: "User",
      required: true
    },

    ownerName: String,
    ownerPhone: String,

    title: String,

    propertyType: {
      type: String,
      enum: ["PG", "Shared Flat", "Rented Apartment"]
    },

    city: String,
    address: String,

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0]
      }
    },

    propertyDetails: {
      roomType: String,
      furnishing: {
        type: String,
        enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"]
      },
      availableFrom: Date
    },

    preferredTenant: {
      type: String,
      enum: ["Student", "Working Professional", "Family", "Anyone"]
    },

    preferredGender: {
      type: String,
      enum: ["Male", "Female", "Any"],
      default: "Any"
    },

    pricing: {
      rent: Number,
      deposit: Number,

      maintenance: {
        type: String,
        amount: Number
      },

      electricity: {
        type: String
      },

      water: {
        type: String
      }
    },

    amenities: [String],

    rules: {
      smoking: Boolean,
      alcohol: Boolean,
      pets: Boolean,
      visitors: Boolean,
      curfewNote: String
    },

    images: [
      {
        url: String,
        hash: String
      }
    ],

    verification: {
      imagesVerified: {
        type: Boolean,
        default: false
      },
      listingStatus: {
        type: String,
        enum: ["Pending", "Verified", "Flagged"],
        default: "Pending"
      }
    },

    description: String
  },
  { timestamps: true }
);

// 🌍 2dsphere index for nearby search (ADDED)
propertySchema.index({ location: "2dsphere" });

export default mongoose.model("Property", propertySchema);
