🏠 **Settlr – AI-Powered Rental Platform**

✨ rent smart, Live Better.

Settlr is a modern, AI-powered rental platform that connects property owners directly with tenants, eliminating broker fees and enabling intelligent property discovery through conversational AI.
The platform delivers a seamless and transparent experience for both listing properties and finding rentals.

🚀 **Overview**

Finding rental properties often involves brokers, hidden fees, and inefficient filters.
Settlr solves this by allowing tenants to search using natural language and communicate directly with verified property owners.

🏡 Owners can list and manage properties effortlessly while reaching genuine tenants without intermediaries.

✨ **Key Features**

👤 For Tenants:

🤖 AI-powered natural language property search

💬 Direct chat with property owners

✅ Verified and authentic property listings

🎯 Personalized property recommendations

🧠 Interactive, chat-based discovery experience

🏡 **For Property Owners:**

Easy Property Listing: Multi-step form with image uploads

Instant Verification: Quick owner verification process

Direct Tenant Access: Connect with verified tenants directly

Property Management: Add, edit, and delete listings

Image Hosting: Cloudinary integration for property photos

🛠️ **Tech Stack**

🎨 Frontend

⚛️ React 19 - Modern React framework

⚡ Vite - Fast development tool and dev server

🧭 React Router - Client-side routing

🔐 Firebase Authentication

🎬 GSAP & Framer Motion - Smooth animations

📝 React Markdown Rich text rendering

🎯 Lucide React  - Icon library

⚙️ **Backend**

🟢 Node.js & Express

🍃 MongoDB & Mongoose

🔑 Firebase Admin SDK

☁️ Cloudinary

🤖 Deepseek API - AI-powered property search

📦 Multer - File upload handling

🧩 **Getting Started**

✅ Prerequisites

Make sure you have the following installed or configured:

Node.js (v18 or higher)

npm or yarn

MongoDB

Firebase project

Cloudinary account

Deepseek API key

📦 **Installation**

1️⃣ Clone the Repository

git clone https://github.com/yourusername/Hackxios_Settlr.git

cd Hackxios_Settlr

2️⃣ Install Dependencies
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

🔐 Environment Configuration

Create .env files in both backend and frontend directories.

📁 Backend .env

MONGODB_URI=mongodb://localhost:27017/settlr

FIREBASE_PROJECT_ID=your_firebase_project_id

FIREBASE_PRIVATE_KEY=your_firebase_private_key

FIREBASE_CLIENT_EMAIL=your_firebase_client_email

CLOUDINARY_CLOUD_NAME=your_cloudinary_name

CLOUDINARY_API_KEY=your_cloudinary_key

CLOUDINARY_API_SECRET=your_cloudinary_secret

DEEPSEEK_API_KEY=your_deepseek_api_key

PORT=5000

📁 Frontend .env

VITE_FIREBASE_API_KEY=your_firebase_api_key

VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=your_firebase_project_id

VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id

VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_LOCATIONIQ_KEY=your_location_iq_key

**To run the project altogether locally**

cd frontend/ npm run dev

cd backend/ node app.js

🌱 Project Status

🚧 Active development

New features, UI improvements, and AI enhancements are continuously being added.
