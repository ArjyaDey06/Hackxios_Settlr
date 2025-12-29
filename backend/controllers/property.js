import Property from "../models/Property.js";

export const createProperty = async (req, res) => {
  try {
    const ownerId = req.user.mongoId;

    const property = await Property.create({
      ownerId,
      ownerName: req.user.name,
      ownerPhone: req.user.phone,
      ...req.body
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      "verification.listingStatus": "Verified"
    }).sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPropertiesByCity = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProperty = async (req, res) => {
  try {
    const property = await Property.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.mongoId },
      req.body,
      { new: true }
    );

    if (!property) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
