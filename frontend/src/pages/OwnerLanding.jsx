import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function OwnerLanding() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [verificationData, setVerificationData] = useState({
    ownerName: user?.name || '',
    phoneNumber: ''
  });
  const [propertyData, setPropertyData] = useState({
    propertyTitle: '',
    propertyType: '',
    city: '',
    address: '',
    bhkType: '',
    furnishing: '',
    availableFrom: '',
    preferredTenant: '',
    preferredGender: ''
  });
  const [pricingData, setPricingData] = useState({
    monthlyRent: '',
    securityDeposit: '',
    maintenanceCharges: 'included',
    maintenanceAmount: '',
    electricity: 'included',
    electricityAmount: '',
    waterCharges: 'included'
  });
  const [amenities, setAmenities] = useState({
    wifi: false,
    powerBackup: false,
    lift: false,
    parking: false,
    washingMachine: false,
    fridge: false,
    ac: false,
    geyser: false,
    housekeeping: false,
    security: false
  });
  const [rules, setRules] = useState({
    smokingAllowed: false,
    alcoholAllowed: false,
    petsAllowed: false,
    visitorRestrictions: false,
    curfewRestrictions: ''
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Login First</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to access the owner dashboard</p>
          <button 
            onClick={() => navigate('/login')}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Animation variants
  const formVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.05
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  const stageVariants = {
    hidden: { 
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2
      }
    },
    visible: { 
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  // Selection card data
  const propertyTypes = [
    { id: 'pg', label: 'PG', icon: '🏢' },
    { id: 'shared-flat', label: 'Shared Flat', icon: '👥' },
    { id: 'rented-apartment', label: 'Rented Apartment', icon: '🏠' }
  ];

  const bhkTypes = [
    { id: '1rk', label: '1RK', icon: '🚪' },
    { id: '1bhk', label: '1BHK', icon: '🏠' },
    { id: '2bhk', label: '2BHK', icon: '🏘️' },
    { id: 'shared', label: 'Shared', icon: '👥' },
    { id: 'single', label: 'Single', icon: '🚪' }
  ];

  const furnishingTypes = [
    { id: 'fully', label: 'Fully Furnished', icon: '🛋️' },
    { id: 'semi', label: 'Semi Furnished', icon: '🪑' },
    { id: 'unfurnished', label: 'Unfurnished', icon: '🏗️' }
  ];

  const SelectionCard = ({ option, selected, onClick, icon }) => (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        selected 
          ? 'bg-emerald-50 border-emerald-500 shadow-md' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      {selected && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
      <div className="text-center">
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-sm font-medium text-gray-700">{option.label}</div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-white relative">
      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => navigate("/landing")}
          className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>
      </div>
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Welcome, {user?.name || 'Property Owner'}!
            </h1>
            <p className="text-xl font-bold text-black mb-8">
              Fill out the form and list your property in no time. Safe, secured and genuine!
            </p>
            
            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowVerificationForm(!showVerificationForm)}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg"
              >
                {showVerificationForm ? 'Hide Form' : 'List Your Property'}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Form Dropdown Section */}
      <AnimatePresence mode="wait">
        {showVerificationForm && (
          <motion.div
            key="form-container"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-4xl mx-auto px-4 pb-8"
          >
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
              
              {/* Form Stages */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Stage 1: Verification Form */}
                  {currentStage === 1 && (
                    <motion.div
                      key="stage-1"
                      variants={stageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">Owner Verification</h3>
                      <p className="text-gray-600 mb-6">Please verify your details to proceed with property listing</p>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={verificationData.ownerName}
                            onChange={(e) => setVerificationData({...verificationData, ownerName: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            placeholder="Auto-filled from your account"
                          />
                          <p className="text-sm text-gray-500 mt-1">This will be auto-filled from your account details</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="tel"
                            value={verificationData.phoneNumber}
                            onChange={(e) => setVerificationData({...verificationData, phoneNumber: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            placeholder="Enter your phone number for verification"
                          />
                          <p className="text-sm text-gray-500 mt-1">For legitimate verification and tenant contact</p>
                        </div>
                        
                        <div className="flex gap-4">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                            onClick={() => {
                              console.log('Verification data:', verificationData);
                              setCurrentStage(2);
                            }}
                          >
                            Verify & Continue
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Stage 2: Property Details Form */}
                  {currentStage === 2 && (
                    <motion.div
                      key="stage-2"
                      variants={stageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">Property Details</h3>
                      <p className="text-gray-600 mb-6">Tell us about your property</p>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={propertyData.propertyTitle}
                            onChange={(e) => setPropertyData({...propertyData, propertyTitle: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            placeholder="e.g., 3 BHK apartment in xyz place"
                          />
                          <p className="text-sm text-gray-500 mt-1">A descriptive title for your property</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4">Property Type *</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {propertyTypes.map((type) => (
                              <SelectionCard
                                key={type.id}
                                option={type}
                                selected={propertyData.propertyType === type.id}
                                onClick={() => setPropertyData({...propertyData, propertyType: type.id})}
                                icon={type.icon}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={propertyData.city}
                            onChange={(e) => setPropertyData({...propertyData, city: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            placeholder="Enter city name"
                          />
                          <p className="text-sm text-gray-500 mt-1">City where your property is located</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                          <motion.textarea
                            whileFocus={{ scale: 1.01 }}
                            value={propertyData.address}
                            onChange={(e) => setPropertyData({...propertyData, address: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            rows="3"
                            placeholder="Complete address including area, landmark, etc."
                          />
                          <p className="text-sm text-gray-500 mt-1">Full address for tenants to locate your property</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4">BHK / Room Type *</label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {bhkTypes.map((type) => (
                              <SelectionCard
                                key={type.id}
                                option={type}
                                selected={propertyData.bhkType === type.id}
                                onClick={() => setPropertyData({...propertyData, bhkType: type.id})}
                                icon={type.icon}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-4">Furnishing *</label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {furnishingTypes.map((type) => (
                              <SelectionCard
                                key={type.id}
                                option={type}
                                selected={propertyData.furnishing === type.id}
                                onClick={() => setPropertyData({...propertyData, furnishing: type.id})}
                                icon={type.icon}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Available From *</label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="date"
                            value={propertyData.availableFrom}
                            onChange={(e) => setPropertyData({...propertyData, availableFrom: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          />
                          <p className="text-sm text-gray-500 mt-1">When the property will be available for tenants</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Tenant *</label>
                          <motion.select
                            whileFocus={{ scale: 1.01 }}
                            value={propertyData.preferredTenant}
                            onChange={(e) => setPropertyData({...propertyData, preferredTenant: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          >
                            <option value="">Select Preferred Tenant</option>
                            <option value="student">Student</option>
                            <option value="working-professional">Working Professional</option>
                            <option value="family">Family</option>
                            <option value="anyone">Anyone</option>
                          </motion.select>
                          <p className="text-sm text-gray-500 mt-1">Who would you prefer as tenants?</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Gender (Optional)</label>
                          <motion.select
                            whileFocus={{ scale: 1.01 }}
                            value={propertyData.preferredGender}
                            onChange={(e) => setPropertyData({...propertyData, preferredGender: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          >
                            <option value="">No Preference</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="any">Any</option>
                          </motion.select>
                          <p className="text-sm text-gray-500 mt-1">Optional gender preference for tenants</p>
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                            onClick={() => {
                              console.log('Property data:', propertyData);
                              setCurrentStage(3);
                            }}
                          >
                            Continue to Pricing
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            onClick={() => setCurrentStage(1)}
                          >
                            Back
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Stage 3: Pricing Details Form */}
                  {currentStage === 3 && (
                    <motion.div
                      key="stage-3"
                      variants={stageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">Pricing Details</h3>
                      <p className="text-gray-600 mb-6">Set your pricing and charges with absolute clarity</p>
                      
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (₹) *</label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="number"
                            value={pricingData.monthlyRent}
                            onChange={(e) => setPricingData({...pricingData, monthlyRent: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            placeholder="Enter monthly rent amount"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit (₹) *</label>
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="number"
                            value={pricingData.securityDeposit}
                            onChange={(e) => setPricingData({...pricingData, securityDeposit: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            placeholder="Enter security deposit amount"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Charges *</label>
                          <motion.select
                            whileFocus={{ scale: 1.01 }}
                            value={pricingData.maintenanceCharges}
                            onChange={(e) => setPricingData({...pricingData, maintenanceCharges: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          >
                            <option value="included">Included</option>
                            <option value="extra">Extra</option>
                          </motion.select>
                          {pricingData.maintenanceCharges === 'extra' && (
                            <motion.input
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileFocus={{ scale: 1.01 }}
                              type="number"
                              value={pricingData.maintenanceAmount}
                              onChange={(e) => setPricingData({...pricingData, maintenanceAmount: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition mt-2"
                              placeholder="Enter maintenance amount (₹)"
                            />
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Electricity *</label>
                          <motion.select
                            whileFocus={{ scale: 1.01 }}
                            value={pricingData.electricity}
                            onChange={(e) => setPricingData({...pricingData, electricity: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          >
                            <option value="included">Included</option>
                            <option value="metered">Metered</option>
                            <option value="fixed">Fixed per month</option>
                          </motion.select>
                          {pricingData.electricity === 'fixed' && (
                            <motion.input
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              whileFocus={{ scale: 1.01 }}
                              type="number"
                              value={pricingData.electricityAmount}
                              onChange={(e) => setPricingData({...pricingData, electricityAmount: e.target.value})}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition mt-2"
                              placeholder="Enter fixed electricity amount (₹)"
                            />
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Water Charges *</label>
                          <motion.select
                            whileFocus={{ scale: 1.01 }}
                            value={pricingData.waterCharges}
                            onChange={(e) => setPricingData({...pricingData, waterCharges: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                          >
                            <option value="included">Included</option>
                            <option value="extra">Extra</option>
                          </motion.select>
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                            onClick={() => {
                              console.log('Pricing data:', pricingData);
                              setCurrentStage(4);
                            }}
                          >
                            Continue to Amenities
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            onClick={() => setCurrentStage(2)}
                          >
                            Back
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Stage 4: Amenities */}
                  {currentStage === 4 && (
                    <motion.div
                      key="stage-4"
                      variants={stageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">Amenities</h3>
                      <p className="text-gray-600 mb-6">Select all the amenities available with your property</p>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { id: 'wifi', label: 'Wi-Fi' },
                            { id: 'powerBackup', label: 'Power Backup' },
                            { id: 'lift', label: 'Lift' },
                            { id: 'parking', label: 'Parking' },
                            { id: 'washingMachine', label: 'Washing Machine' },
                            { id: 'fridge', label: 'Fridge' },
                            { id: 'ac', label: 'Air Conditioning' },
                            { id: 'geyser', label: 'Geyser' },
                            { id: 'housekeeping', label: 'Housekeeping' },
                            { id: 'security', label: 'Security / CCTV' }
                          ].map(({ id, label }, index) => (
                            <motion.label 
                              key={id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                            >
                              <input
                                type="checkbox"
                                checked={amenities[id]}
                                onChange={(e) => setAmenities({...amenities, [id]: e.target.checked})}
                                className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 focus:ring-2"
                              />
                              <span className="text-gray-700">{label}</span>
                            </motion.label>
                          ))}
                        </div>
                        
                        <div className="flex gap-4 mt-8">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                            onClick={() => {
                              console.log('Amenities:', amenities);
                              setCurrentStage(5);
                            }}
                          >
                            Continue to Rules
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            onClick={() => setCurrentStage(3)}
                          >
                            Back
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Stage 5: Rules & Preferences */}
                  {currentStage === 5 && (
                    <motion.div
                      key="stage-5"
                      variants={stageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">Rules & Preferences</h3>
                      <p className="text-gray-600 mb-6">Set house rules and preferences for your property</p>
                      
                      <div className="space-y-6">
                        {[
                          { id: 'smokingAllowed', label: 'Smoking Allowed' },
                          { id: 'alcoholAllowed', label: 'Alcohol Allowed' },
                          { id: 'petsAllowed', label: 'Pets Allowed' },
                          { id: 'visitorRestrictions', label: 'Visitor Restrictions' }
                        ].map(({ id, label }, index) => (
                          <motion.div 
                            key={id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                          >
                            <span className="text-gray-700">{label}</span>
                            <button
                              type="button"
                              className={`${
                                rules[id] ? 'bg-green-500' : 'bg-gray-200'
                              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                              onClick={() => setRules({...rules, [id]: !rules[id]})}
                            >
                              <span className="sr-only">{label}</span>
                              <span
                                className={`${
                                  rules[id] ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200`}
                              />
                            </button>
                          </motion.div>
                        ))}
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Curfew / Time Restrictions (Optional)
                          </label>
                          <motion.textarea
                            whileFocus={{ scale: 1.01 }}
                            value={rules.curfewRestrictions}
                            onChange={(e) => setRules({...rules, curfewRestrictions: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            rows="2"
                            placeholder="e.g., No entry after 10 PM, No visitors after 9 PM, etc."
                          />
                          <p className="text-sm text-gray-500 mt-1">Any specific timing restrictions for your property</p>
                        </div>
                        
                        <div className="flex gap-4 pt-4">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md"
                            onClick={() => {
                              console.log('Rules & Preferences:', rules);
                              setCurrentStage(6);
                            }}
                          >
                            Next: Upload Images
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            onClick={() => setCurrentStage(4)}
                          >
                            Back
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Stage 6: Image Upload */}
                  {currentStage === 6 && (
                    <motion.div
                      key="stage-6"
                      variants={stageVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">Upload Property Images</h3>
                      <p className="text-gray-600 mb-6">Upload up to 10 high-quality images of your property</p>
                      
                      <div className="space-y-6">
                        <motion.div 
                          whileHover={{ scale: 1.01 }}
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${isDragging ? 'border-green-500 bg-green-50 scale-105' : 'border-gray-300 hover:border-green-400'}`}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(true);
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(false);
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsDragging(false);
                            
                            const files = Array.from(e.dataTransfer.files);
                            if (files && files.length > 0) {
                              const imageFiles = files.filter(file => file.type.startsWith('image/'));
                              const newImages = [...(images || []), ...imageFiles].slice(0, 10);
                              setImages(newImages);
                            }
                          }}
                          onClick={() => document.getElementById('property-images').click()}
                        >
                          <input
                            type="file"
                            id="property-images"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              const newImages = [...(images || []), ...files].slice(0, 10);
                              setImages(newImages);
                              e.target.value = '';
                            }}
                          />
                          <div className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer">
                            <svg
                              className={`w-16 h-16 ${isDragging ? 'text-green-500' : 'text-gray-400'} mb-2 transition-colors`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              ></path>
                            </svg>
                            <p className="text-gray-600 mb-1">
                              <span className="font-medium text-green-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">
                              {isDragging ? 'Drop your images here' : 'Upload up to 10 images (JPG, PNG, WEBP) up to 5MB each'}
                            </p>
                          </div>
                        </motion.div>
                        
                        {/* Image preview grid */}
                        <AnimatePresence>
                          {images?.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Selected Images ({images.length}/10)
                              </h3>
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                <AnimatePresence>
                                  {images.map((file, index) => (
                                    <motion.div 
                                      key={index}
                                      layout
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.8 }}
                                      className="relative group"
                                    >
                                      <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-32 object-cover rounded-lg shadow-sm"
                                      />
                                      <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={() => {
                                          const newImages = [...images];
                                          newImages.splice(index, 1);
                                          setImages(newImages);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                                        aria-label="Remove image"
                                      >
                                        <svg
                                          className="w-4 h-4"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                          ></path>
                                        </svg>
                                      </motion.button>
                                    </motion.div>
                                  ))}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        <div className="flex gap-4 pt-4">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => {
                              console.log('Uploading images:', images);
                              console.log('All form data:', { 
                                verificationData, 
                                propertyData, 
                                pricingData, 
                                amenities, 
                                rules,
                                images: images?.length || 0
                              });
                              alert('Property listing and images submitted successfully!');
                            }}
                            disabled={!images?.length}
                          >
                            Submit Property Listing
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            onClick={() => setCurrentStage(5)}
                          >
                            Back
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OwnerLanding;