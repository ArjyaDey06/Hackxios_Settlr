// backend/models/Property.js
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

// 🌍 2dsphere index for nearby search
propertySchema.index({ location: "2dsphere" });

// ✅ Virtual to get BHK info from roomType for AI search
propertySchema.virtual('bhk').get(function() {
  if (!this.propertyDetails?.roomType) return null;
  const roomType = this.propertyDetails.roomType.toLowerCase();
  
  // Map common room types to BHK format
  if (roomType.includes('1 rk') || roomType.includes('1rk')) return '1rk';
  if (roomType.includes('1 bhk') || roomType.includes('1bhk')) return '1bhk';
  if (roomType.includes('2 bhk') || roomType.includes('2bhk')) return '2bhk';
  if (roomType.includes('3 bhk') || roomType.includes('3bhk')) return '3bhk';
  if (roomType.includes('4 bhk') || roomType.includes('4bhk')) return '4bhk';
  if (roomType.includes('shared') || roomType.includes('sharing')) return 'shared';
  if (roomType.includes('single') || roomType.includes('private')) return 'single';
  
  return null;
});

// ✅ Helper method to check if property is available
propertySchema.methods.isAvailable = function() {
  return this.verification?.listingStatus === 'Verified';
};

// Ensure virtuals are included in JSON
propertySchema.set('toJSON', { virtuals: true });
propertySchema.set('toObject', { virtuals: true });

export default mongoose.model("Property", propertySchema);
