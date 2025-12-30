// backend/scripts/addSampleProperties.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/Property.js';

dotenv.config();

const sampleProperties = [
  {
    ownerId: 'sample-owner-1',
    ownerName: 'Rajesh Kumar',
    ownerPhone: '+91 98765 43210',
    title: 'Spacious 2BHK near Electronic City',
    propertyType: 'Rented Apartment',
    city: 'Bengaluru',
    address: 'Electronic City Phase 1, Near Infosys Gate 1',
    location: {
      type: 'Point',
      coordinates: [77.6648, 12.8456]
    },
    propertyDetails: {
      roomType: '2 BHK',
      furnishing: 'Semi Furnished',
      availableFrom: new Date()
    },
    preferredTenant: 'Working Professional',
    preferredGender: 'Any',
    pricing: {
      rent: 15000,
      deposit: 30000,
      maintenance: {
        type: 'Included',
        amount: 0
      },
      electricity: 'As per usage',
      water: 'Included'
    },
    amenities: ['WiFi', 'Power Backup', 'Parking', 'Gym', 'Security'],
    rules: {
      smoking: false,
      alcohol: true,
      pets: false,
      visitors: true,
      curfewNote: 'No specific curfew'
    },
    images: [
      {
        url: 'https://via.placeholder.com/800x600/4CAF50/ffffff?text=Property+1',
        hash: 'sample-hash-1'
      }
    ],
    verification: {
      imagesVerified: true,
      listingStatus: 'Verified'
    },
    description: 'Well-maintained 2BHK apartment close to IT parks. Good connectivity to major tech companies.'
  },
  {
    ownerId: 'sample-owner-2',
    ownerName: 'Priya Sharma',
    ownerPhone: '+91 98765 43211',
    title: 'Modern 2BHK in Whitefield',
    propertyType: 'Rented Apartment',
    city: 'Bengaluru',
    address: 'Whitefield, Near Phoenix Marketcity',
    location: {
      type: 'Point',
      coordinates: [77.7499, 12.9698]
    },
    propertyDetails: {
      roomType: '2 BHK',
      furnishing: 'Fully Furnished',
      availableFrom: new Date()
    },
    preferredTenant: 'Working Professional',
    preferredGender: 'Any',
    pricing: {
      rent: 17000,
      deposit: 34000,
      maintenance: {
        type: 'Extra',
        amount: 2000
      },
      electricity: 'As per usage',
      water: 'Included'
    },
    amenities: ['WiFi', 'AC', 'Washing Machine', 'Security', 'Geyser'],
    rules: {
      smoking: false,
      alcohol: true,
      pets: true,
      visitors: true,
      curfewNote: 'None'
    },
    images: [
      {
        url: 'https://via.placeholder.com/800x600/2196F3/ffffff?text=Property+2',
        hash: 'sample-hash-2'
      }
    ],
    verification: {
      imagesVerified: true,
      listingStatus: 'Verified'
    },
    description: 'Modern 2BHK with all amenities. Close to metro station and shopping malls.'
  },
  {
    ownerId: 'sample-owner-3',
    ownerName: 'Suresh Reddy',
    ownerPhone: '+91 98765 43212',
    title: 'Premium 2BHK in HSR Layout',
    propertyType: 'Rented Apartment',
    city: 'Bengaluru',
    address: 'HSR Layout Sector 2, 27th Main Road',
    location: {
      type: 'Point',
      coordinates: [77.6387, 12.9116]
    },
    propertyDetails: {
      roomType: '2 BHK',
      furnishing: 'Semi Furnished',
      availableFrom: new Date()
    },
    preferredTenant: 'Working Professional',
    preferredGender: 'Any',
    pricing: {
      rent: 19000,
      deposit: 38000,
      maintenance: {
        type: 'Included',
        amount: 0
      },
      electricity: 'Extra',
      water: 'Included'
    },
    amenities: ['WiFi', 'Power Backup', 'Parking', 'Water 24/7', 'Lift'],
    rules: {
      smoking: false,
      alcohol: true,
      pets: false,
      visitors: true,
      curfewNote: 'No restrictions'
    },
    images: [
      {
        url: 'https://via.placeholder.com/800x600/FF9800/ffffff?text=Property+3',
        hash: 'sample-hash-3'
      }
    ],
    verification: {
      imagesVerified: true,
      listingStatus: 'Verified'
    },
    description: 'Prime location in HSR Layout. Great for professionals. Close to restaurants and cafes.'
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Optional: Clear existing sample data
    // await Property.deleteMany({ ownerId: /^sample-owner/ });
    
    const inserted = await Property.insertMany(sampleProperties);
    console.log('✅ Added', inserted.length, 'sample properties');
    console.log('📋 Property IDs:', inserted.map(p => p._id));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
