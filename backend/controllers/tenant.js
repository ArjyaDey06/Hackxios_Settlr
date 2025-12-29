import TenantProfile from "../models/TenantProfile.js";

export const createOrUpdateTenant = async (req, res) => {
    try {
        const userId = req.user.mongoId;

        const {
            age,
            profession,
            budget,
            organisation,
            preferredCity,
            preferences
        } = req.body;

        const tenant = await TenantProfile.findOneAndUpdate(
            { userId },
            {
                userId,
                age,
                profession,
                budget,
                organisation,
                preferredCity,
                preferences
            },
            { new: true, upsert: true }
        );

        res.status(200).json(tenant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const getTenantProfile = async (req, res) => {
    try {
        const userId = req.user.mongoId;

        const tenant = await TenantProfile.findOne({ userId }).populate(
            "userId",
            "name email"
        );

        if (!tenant) {
            return res.status(404).json({ message: "Tenant profile not found" });
        }

        res.status(200).json(tenant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};