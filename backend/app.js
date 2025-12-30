import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";

import mongoose from "mongoose";


// ✅ Import routes ONCE - Remove the duplicate import on line 4
import authRoutes from "./routes/auth.js";
import propertyRoutes from "./routes/property.js";  // ✅ Only import once!
import tenantRoutes from "./routes/tenant.js";
import chatRoutes from "./routes/chatRoutes.js";

const app = express();

/* =====================
   Global Middleware
===================== */
app.use(
    cors({
        origin: "http://localhost:5173", // Vite frontend
        credentials: true
    })
);

app.use(express.json());

/* =====================
   API Routes
===================== */
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);  // ✅ This registers /api/properties/my-properties
app.use("/api/tenant", tenantRoutes);
app.use("/api", chatRoutes); 

/* =====================
   Health Check
===================== */
app.get("/", (req, res) => {
    res.send("🚀 Settlr API is running");
});

/* =====================
   MongoDB Connection
===================== */
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () =>
            console.log(`🚀 Server running on port ${PORT}`)
        );
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        process.exit(1);
    });
