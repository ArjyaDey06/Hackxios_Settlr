import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebase"; // ✅ Adjust path to your firebase config
import { motion } from "framer-motion";

function OwnerLanding() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isFormAnimating, setIsFormAnimating] = useState(false);

  const [verificationData, setVerificationData] = useState({
    ownerName: user?.name || "",
    phoneNumber: "",
  });

  const [propertyData, setPropertyData] = useState({
    propertyTitle: "",
    propertyType: "",
    city: "",
    address: "",
    bhkType: "",
    furnishing: "",
    availableFrom: "",
    preferredTenant: "",
    preferredGender: "",
  });

  const [pricingData, setPricingData] = useState({
    monthlyRent: "",
    securityDeposit: "",
    maintenanceCharges: "included",
    maintenanceAmount: "",
    electricity: "included",
    electricityAmount: "",
    waterCharges: "included",
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
    security: false,
  });

  const [rules, setRules] = useState({
    smokingAllowed: false,
    alcoholAllowed: false,
    petsAllowed: false,
    visitorRestrictions: false,
    curfewRestrictions: "",
  });

  // LocationIQ Autocomplete state
  const [cityQuery, setCityQuery] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [addressQuery, setAddressQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const cityAbortRef = useRef(null);
  const addressAbortRef = useRef(null);

  const canUseLocationIQ = useMemo(() => {
    return Boolean(LOCATIONIQ_KEY && String(LOCATIONIQ_KEY).trim().length > 0);
  }, [LOCATIONIQ_KEY]);

  // Debounced city autocomplete
  useEffect(() => {
    if (!showVerificationForm || currentStage !== 2) return;

    const q = cityQuery.trim();
    if (!canUseLocationIQ || q.length < 2) {
      setCitySuggestions([]);
      setCityLoading(false);
      return;
    }

    setCityLoading(true);

    if (cityAbortRef.current) cityAbortRef.current.abort();
    const controller = new AbortController();
    cityAbortRef.current = controller;

    const t = setTimeout(async () => {
      try {
        const url = new URL("https://api.locationiq.com/v1/autocomplete");
        url.searchParams.set("key", LOCATIONIQ_KEY);
        url.searchParams.set("q", q);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "6");
        url.searchParams.set("countrycodes", "in");
        url.searchParams.set("normalizecity", "1");
        url.searchParams.set("tag", "place:city");

        const res = await fetch(url.toString(), { signal: controller.signal });
        const data = res.ok ? await res.json() : [];
        setCitySuggestions(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.name !== "AbortError") setCitySuggestions([]);
      } finally {
        setCityLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [cityQuery, canUseLocationIQ, LOCATIONIQ_KEY, showVerificationForm, currentStage]);

  // Debounced address autocomplete
  useEffect(() => {
    if (!showVerificationForm || currentStage !== 2) return;

    const q = addressQuery.trim();
    if (!canUseLocationIQ || q.length < 2) {
      setAddressSuggestions([]);
      setAddressLoading(false);
      return;
    }

    setAddressLoading(true);

    if (addressAbortRef.current) addressAbortRef.current.abort();
    const controller = new AbortController();
    addressAbortRef.current = controller;

    const t = setTimeout(async () => {
      try {
        const url = new URL("https://api.locationiq.com/v1/autocomplete");
        url.searchParams.set("key", LOCATIONIQ_KEY);
        url.searchParams.set("q", q);
        url.searchParams.set("format", "json");
        url.searchParams.set("limit", "6");
        url.searchParams.set("countrycodes", "in");
        url.searchParams.set("normalizecity", "1");

        const res = await fetch(url.toString(), { signal: controller.signal });
        const data = res.ok ? await res.json() : [];
        setAddressSuggestions(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e?.name !== "AbortError") setAddressSuggestions([]);
      } finally {
        setAddressLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [addressQuery, canUseLocationIQ, LOCATIONIQ_KEY, showVerificationForm, currentStage]);

  const pickCity = (place) => {
    const name =
      place?.address?.city ||
      place?.address?.town ||
      place?.address?.village ||
      (place?.display_name ? String(place.display_name).split(",")[0].trim() : "");

    setPropertyData((prev) => ({ ...prev, city: name }));
    setCityQuery("");
    setCitySuggestions([]);
    setShowCityDropdown(false);
  };

  const pickAddress = (place) => {
    const full = place?.display_name ? String(place.display_name) : "";
    const inferredCity =
      place?.address?.city || place?.address?.town || place?.address?.village || "";

    setPropertyData((prev) => ({
      ...prev,
      address: full,
      city: inferredCity || prev.city,
    }));

    setAddressQuery("");
    setAddressSuggestions([]);
    setShowAddressDropdown(false);
  };

  const toggleForm = () => {
    if (showVerificationForm) {
      setIsFormAnimating(true);
      setTimeout(() => {
        setShowVerificationForm(false);
        setIsFormAnimating(false);
      }, 300);
    } else {
      setShowVerificationForm(true);
      setTimeout(() => {
        setIsFormAnimating(false);
      }, 50);
    }
  };

  // Selection card data
  const propertyTypes = [
    { id: 'PG', label: 'PG', icon: '🏢' },
    { id: 'Shared Flat', label: 'Shared Flat', icon: '👥' },
    { id: 'Rented Apartment', label: 'Rented Apartment', icon: '🏠' }
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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
        selected 
          ? 'bg-emerald-50 border-emerald-500' 
          : 'bg-white border-gray-200 hover:border-gray-300'
      }`}
    >
      {selected && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      <div className="text-center">
        <div className="text-2xl mb-2">{icon}</div>
        <div className="text-sm font-medium text-gray-700">{option.label}</div>
      </div>
    </motion.div>
  );

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
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Progress Bar */}
      {showVerificationForm && (
        <div className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Progress</span>
              <span className="text-sm font-medium text-emerald-600">{currentStage}/6</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-emerald-500 h-2 rounded-full"
                initial={{ width: `${((currentStage - 1) / 6) * 100}%` }}
                animate={{ width: `${(currentStage / 6) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <button
          onClick={() => navigate("/landing")}
          className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-200 hover:scale-105"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
      
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Welcome, {user?.name || 'Property Owner'}!
            </h1>
            <p className="text-xl font-bold text-black mb-8">
              Fill out the form and list your property in no time. Safe, secured and genuine!
            </p>
            
            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                onClick={toggleForm}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {showVerificationForm ? 'Hide Form' : 'List Your Property'}
              </button>
            </div>

            {!canUseLocationIQ && (
              <p className="text-sm text-amber-700">
                LocationIQ autocomplete is disabled (missing VITE_LOCATIONIQ_KEY).
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stage 1: Verification Form */}
      {showVerificationForm && currentStage === 1 && (
        <div className={`max-w-2xl mx-auto px-4 py-8 ${
          isFormAnimating ? (showVerificationForm ? 'form-exit' : 'form-enter') : 'form-enter'
        }`}>
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 1: Owner Verification</h2>
            <p className="text-gray-600 mb-6">Please verify your details to proceed with property listing</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                <input
                  type="text"
                  value={verificationData.ownerName}
                  onChange={(e) => setVerificationData({...verificationData, ownerName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Auto-filled from your account"
                />
                <p className="text-sm text-gray-500 mt-1">This will be auto-filled from your account details</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={verificationData.phoneNumber}
                  onChange={(e) => setVerificationData({...verificationData, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your phone number for verification"
                />
                <p className="text-sm text-gray-500 mt-1">For legitimate verification and tenant contact</p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  onClick={() => setCurrentStage(2)}
                >
                  Verify & Continue
                </button>
                <button 
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => setShowVerificationForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 2: Property Details Form */}
      {showVerificationForm && currentStage === 2 && (
        <div className={`max-w-2xl mx-auto px-4 py-8 ${
          isFormAnimating ? (showVerificationForm ? 'form-exit' : 'form-enter') : 'form-enter'
        }`}>
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 2: Property Details</h2>
            <p className="text-gray-600 mb-6">Tell us about your property</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
                <input
                  type="text"
                  value={propertyData.propertyTitle}
                  onChange={(e) => setPropertyData({...propertyData, propertyTitle: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              
              {/* City autocomplete */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  value={propertyData.city}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPropertyData({ ...propertyData, city: v });
                    setCityQuery(v);
                    setShowCityDropdown(true);
                  }}
                  onFocus={() => setShowCityDropdown(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Start typing city name"
                />
                {canUseLocationIQ && cityLoading && (
                  <p className="text-xs text-gray-500 mt-1">Searching…</p>
                )}

                {canUseLocationIQ && showCityDropdown && citySuggestions.length > 0 && (
                  <div className="mt-2 border border-gray-200 bg-white rounded-lg max-h-56 overflow-auto shadow-lg absolute z-10 w-full">
                    {citySuggestions.map((place) => (
                      <button
                        type="button"
                        key={place.place_id || place.osm_id || place.display_name}
                        onClick={() => pickCity(place)}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-sm font-medium">
                          {place.address?.city ||
                            place.address?.town ||
                            place.address?.village ||
                            String(place.display_name || "").split(",")[0]}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{place.display_name}</div>
                      </button>
                    ))}
                  </div>
                )}
                <p className="text-sm text-gray-500 mt-1">City where your property is located</p>
              </div>
              
              {/* Address autocomplete */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                <input
                  type="text"
                  value={propertyData.address}
                  onChange={(e) => {
                    const v = e.target.value;
                    setPropertyData({ ...propertyData, address: v });
                    setAddressQuery(v);
                    setShowAddressDropdown(true);
                  }}
                  onFocus={() => setShowAddressDropdown(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Start typing address"
                />
                {canUseLocationIQ && addressLoading && (
                  <p className="text-xs text-gray-500 mt-1">Searching…</p>
                )}

                {canUseLocationIQ && showAddressDropdown && addressSuggestions.length > 0 && (
                  <div className="mt-2 border border-gray-200 bg-white rounded-lg max-h-60 overflow-auto shadow-lg absolute z-10 w-full">
                    {addressSuggestions.map((place) => (
                      <button
                        type="button"
                        key={place.place_id || place.osm_id || place.display_name}
                        onClick={() => pickAddress(place)}
                        className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="text-sm font-medium truncate">{place.display_name}</div>
                        <div className="text-xs text-gray-500">
                          {place.address?.city || place.address?.town || place.address?.village || ""}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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
                <input
                  type="date"
                  value={propertyData.availableFrom}
                  onChange={(e) => setPropertyData({...propertyData, availableFrom: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-sm text-gray-500 mt-1">When the property will be available for tenants</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Tenant *</label>
                <select
                  value={propertyData.preferredTenant}
                  onChange={(e) => setPropertyData({...propertyData, preferredTenant: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Preferred Tenant</option>
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Family">Family</option>
                  <option value="Anyone">Anyone</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Who would you prefer as tenants?</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Gender (Optional)</label>
                <select
                  value={propertyData.preferredGender}
                  onChange={(e) => setPropertyData({...propertyData, preferredGender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">No Preference</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Any">Any</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Optional gender preference for tenants</p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  onClick={() => setCurrentStage(3)}
                >
                  Continue to Next Stage
                </button>
                <button 
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => setCurrentStage(1)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 3: Pricing Details Form */}
      {showVerificationForm && currentStage === 3 && (
        <div className={`max-w-2xl mx-auto px-4 py-8 ${
          isFormAnimating ? (showVerificationForm ? 'form-exit' : 'form-enter') : 'form-enter'
        }`}>
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 3: Pricing Details</h2>
            <p className="text-gray-600 mb-6">Set your pricing and charges with absolute clarity</p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  value={pricingData.monthlyRent}
                  onChange={(e) => setPricingData({...pricingData, monthlyRent: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter monthly rent amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit (₹) *</label>
                <input
                  type="number"
                  value={pricingData.securityDeposit}
                  onChange={(e) => setPricingData({...pricingData, securityDeposit: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter security deposit amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Charges *</label>
                <select
                  value={pricingData.maintenanceCharges}
                  onChange={(e) => setPricingData({...pricingData, maintenanceCharges: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="included">Included</option>
                  <option value="extra">Extra</option>
                </select>
                {pricingData.maintenanceCharges === 'extra' && (
                  <input
                    type="number"
                    value={pricingData.maintenanceAmount}
                    onChange={(e) => setPricingData({...pricingData, maintenanceAmount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
                    placeholder="Enter maintenance amount (₹)"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Electricity *</label>
                <select
                  value={pricingData.electricity}
                  onChange={(e) => setPricingData({...pricingData, electricity: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="included">Included</option>
                  <option value="metered">Metered</option>
                  <option value="fixed">Fixed per month</option>
                </select>
                {pricingData.electricity === 'fixed' && (
                  <input
                    type="number"
                    value={pricingData.electricityAmount}
                    onChange={(e) => setPricingData({...pricingData, electricityAmount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
                    placeholder="Enter fixed electricity amount (₹)"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Water Charges *</label>
                <select
                  value={pricingData.waterCharges}
                  onChange={(e) => setPricingData({...pricingData, waterCharges: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="included">Included</option>
                  <option value="extra">Extra</option>
                </select>
              </div>
              
              <div className="flex gap-4">
                <button 
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  onClick={() => setCurrentStage(4)}
                >
                  Continue to Next Stage
                </button>
                <button 
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => setCurrentStage(2)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 4: Amenities */}
      {showVerificationForm && currentStage === 4 && (
        <div className={`max-w-2xl mx-auto px-4 py-8 ${
          isFormAnimating ? (showVerificationForm ? 'form-exit' : 'form-enter') : 'form-enter'
        }`}>
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 4: Amenities</h2>
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
                ].map(({ id, label }) => (
                  <label key={id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={amenities[id]}
                      onChange={(e) => setAmenities({...amenities, [id]: e.target.checked})}
                      className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                    />
                    <span className="text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
              
              <div className="flex gap-4 mt-8">
                <button 
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  onClick={() => setCurrentStage(5)}
                >
                  Continue to Next Stage
                </button>
                <button 
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => setCurrentStage(3)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stage 5: Rules & Preferences */}
      {showVerificationForm && currentStage === 5 && (
        <div className={`max-w-2xl mx-auto px-4 py-8 ${
          isFormAnimating ? (showVerificationForm ? 'form-exit' : 'form-enter') : 'form-enter'
        }`}>
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 5: Rules & Preferences</h2>
            <p className="text-gray-600 mb-6">Set house rules and preferences for your property</p>
            
            <div className="space-y-6">
              {[
                { id: 'smokingAllowed', label: 'Smoking Allowed' },
                { id: 'alcoholAllowed', label: 'Alcohol Allowed' },
                { id: 'petsAllowed', label: 'Pets Allowed' },
                { id: 'visitorRestrictions', label: 'Visitor Restrictions' }
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center justify-between">
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
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                  </button>
                </div>
              ))}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Curfew / Time Restrictions (Optional)
                </label>
                <textarea
                  value={rules.curfewRestrictions}
                  onChange={(e) => setRules({...rules, curfewRestrictions: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="2"
                  placeholder="e.g., No entry after 10 PM, No visitors after 9 PM, etc."
                />
                <p className="text-sm text-gray-500 mt-1">Any specific timing restrictions for your property</p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  onClick={() => setCurrentStage(6)}
                >
                  Next: Upload Images
                </button>
                <button 
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => setCurrentStage(4)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Stage 6: Image Upload */}
      {showVerificationForm && currentStage === 6 && (
        <div className={`max-w-4xl mx-auto px-4 py-8 ${
          isFormAnimating ? (showVerificationForm ? 'form-exit' : 'form-enter') : 'form-enter'
        }`}>
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-green-500">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 6: Upload Property Images</h2>
            <p className="text-gray-600 mb-6">Upload up to 10 high-quality images of your property</p>
            
            <div className="space-y-6">
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
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
                    className={`w-12 h-12 ${isDragging ? 'text-green-500' : 'text-gray-400'} mb-2 transition-colors`}
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
              </div>
              
              {/* Image preview grid */}
              {images?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Selected Images ({images.length}/10)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = [...images];
                            newImages.splice(index, 1);
                            setImages(newImages);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 pt-4">
                <button 
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  onClick={async () => {
                    if (!user) {
                      alert("Please login first");
                      return;
                    }

                    if (!images?.length) {
                      alert("Please upload at least one image");
                      return;
                    }

                    setUploading(true);

                    try {
                      const token = await auth.currentUser.getIdToken();

                      const payload = {
                        title: propertyData.propertyTitle,
                        propertyType: propertyData.propertyType,
                        city: propertyData.city,
                        address: propertyData.address,
                        bhkType: propertyData.bhkType,
                        furnishing: propertyData.furnishing,
                        availableFrom: propertyData.availableFrom,
                        preferredTenant: propertyData.preferredTenant,
                        preferredGender: propertyData.preferredGender,
                        pricing: {
                          rent: Number(pricingData.monthlyRent),
                          deposit: Number(pricingData.securityDeposit),
                          maintenanceCharges: pricingData.maintenanceCharges,
                          maintenanceAmount: Number(pricingData.maintenanceAmount || 0),
                          electricity: pricingData.electricity,
                          electricityAmount: Number(pricingData.electricityAmount || 0),
                          waterCharges: pricingData.waterCharges,
                        },
                        amenities: Object.keys(amenities).filter((key) => amenities[key]),
                        rules: rules,
                        ownerPhone: verificationData.phoneNumber,
                        images: [],
                      };

                      console.log("📤 Sending to backend:", payload);

                      const response = await fetch("http://localhost:5000/api/properties", {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                      });

                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Failed to create property");
                      }

                      const data = await response.json();
                      console.log("✅ Property saved to database:", data);

                      alert("Property successfully saved to database!");

                      setShowVerificationForm(false);
                      setCurrentStage(1);
                      setImages([]);
                    } catch (error) {
                      console.error("❌ Error saving property:", error);
                      alert(`Failed to save property: ${error.message}`);
                    } finally {
                      setUploading(false);
                    }
                  }}
                  disabled={uploading || !images?.length}
                >
                  {uploading ? "Saving to Database..." : "Submit Property Listing"}
                </button>
                <button 
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={() => setCurrentStage(5)}
                  disabled={uploading}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerLanding;
