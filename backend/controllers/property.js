import Property from "../models/Property.js";

// ✅ Create a new property
export const createProperty = async (req, res) => {
  try {
    const ownerId = req.user.uid;  // Firebase UID from token

    console.log('🏗️ Creating property for owner:', ownerId);
    console.log('📧 Owner email:', req.user.email);
    console.log('📦 Request body:', req.body);

    const property = await Property.create({
      ownerId,
      ownerName: req.user.name,
      ownerPhone: req.user.phone,
      ...req.body
    });

    console.log('✅ Property created:', property._id);
    console.log('✅ Saved with ownerId:', property.ownerId);

    res.status(201).json(property);
  } catch (error) {
    console.error('❌ Error creating property:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all verified properties (public listing)
export const getAllProperties = async (req, res) => {
  try {
    console.log('📋 Fetching all verified properties');

    const properties = await Property.find({
      "verification.listingStatus": "Verified"
    }).sort({ createdAt: -1 });

    console.log('✅ Found verified properties:', properties.length);

    res.status(200).json(properties);
  } catch (error) {
    console.error('❌ Error fetching all properties:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get properties owned by the authenticated user
export const getOwnerProperties = async (req, res) => {
  try {
    const ownerId = req.user.uid;  // Firebase UID from token
    
    console.log('🔍 Fetching properties for Firebase UID:', ownerId);
    console.log('👤 User email:', req.user.email);
    
    const properties = await Property.find({ ownerId }).sort({ createdAt: -1 });
    
    console.log('📦 Found properties:', properties.length);
    
    if (properties.length > 0) {
      console.log('📝 Sample property:', {
        _id: properties[0]._id,
        title: properties[0].title,
        ownerId: properties[0].ownerId
      });
    }
    
    res.status(200).json(properties);
  } catch (error) {
    console.error("❌ Error fetching owner properties:", error);
    res.status(500).json({ 
      message: "Failed to fetch properties", 
      error: error.message 
    });
  }
};

// ✅ Get single property by ID (for property details page)
export const getPropertyById = async (req, res) => {
  try {
    console.log('🔍 Fetching property by ID:', req.params.id);

    const property = await Property.findById(req.params.id);

    if (!property) {
      console.log('❌ Property not found:', req.params.id);
      return res.status(404).json({ message: "Property not found" });
    }

    console.log('✅ Property found:', property.title);

    res.status(200).json(property);
  } catch (error) {
    console.error('❌ Error fetching property by ID:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get properties by city (for search/filter)
export const getPropertiesByCity = async (req, res) => {
  try {
    const { city } = req.query;
    
    console.log('🔍 Fetching properties by city:', city);

    if (!city) {
      return res.status(400).json({ message: "City parameter is required" });
    }

    const properties = await Property.find({
      city: new RegExp(city, 'i'), // Case-insensitive search
      "verification.listingStatus": "Verified"
    }).sort({ createdAt: -1 });

    console.log('✅ Found properties in', city, ':', properties.length);

    res.status(200).json(properties);
  } catch (error) {
    console.error('❌ Error fetching properties by city:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update property (owner only)
export const updateProperty = async (req, res) => {
  try {
    const ownerId = req.user.uid;  // Firebase UID from token

    console.log('🔄 Updating property:', req.params.id);
    console.log('🔑 Owner Firebase UID:', ownerId);
    console.log('📦 Update data:', req.body);

    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, ownerId: ownerId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      console.log('❌ Property not found or unauthorized');
      return res.status(403).json({ 
        message: "Property not found or you don't have permission to update it" 
      });
    }

    console.log('✅ Property updated:', property._id);

    res.status(200).json(property);
  } catch (error) {
    console.error('❌ Error updating property:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete a property (owner only)
export const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const ownerId = req.user.uid;  // Firebase UID from token

    console.log('🗑️ Deleting property:', id);
    console.log('🔑 Owner Firebase UID:', ownerId);

    // Find property and verify ownership
    const property = await Property.findOne({ 
      _id: id, 
      ownerId: ownerId 
    });

    if (!property) {
      console.log('❌ Property not found or unauthorized');
      return res.status(404).json({ 
        message: "Property not found or you don't have permission to delete it" 
      });
    }

    console.log('🗑️ Found property to delete:', property.title);

    // Delete the property
    await Property.findByIdAndDelete(id);

    console.log('✅ Property deleted successfully');

    res.status(200).json({ 
      message: "Property deleted successfully",
      deletedPropertyId: id
    });
  } catch (error) {
    console.error("❌ Error deleting property:", error);
    res.status(500).json({ 
      message: "Failed to delete property", 
      error: error.message 
    });
  }
};

// ✅ Search properties with filters (optional - for advanced search)
export const searchProperties = async (req, res) => {
  try {
    const { 
      city, 
      propertyType, 
      bhkType, 
      minRent, 
      maxRent,
      furnishing,
      preferredTenant 
    } = req.query;

    console.log('🔍 Searching properties with filters:', req.query);

    // Build query
    let query = {
      "verification.listingStatus": "Verified"
    };

    if (city) {
      query.city = new RegExp(city, 'i');
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (bhkType) {
      query.bhkType = bhkType;
    }

    if (furnishing) {
      query.furnishing = furnishing;
    }

    if (preferredTenant) {
      query.preferredTenant = preferredTenant;
    }

    if (minRent || maxRent) {
      query['pricing.rent'] = {};
      if (minRent) query['pricing.rent'].$gte = Number(minRent);
      if (maxRent) query['pricing.rent'].$lte = Number(maxRent);
    }

    const properties = await Property.find(query).sort({ createdAt: -1 });

    console.log('✅ Found properties:', properties.length);

    res.status(200).json(properties);
  } catch (error) {
    console.error('❌ Error searching properties:', error);
    res.status(500).json({ message: error.message });
  }
};
