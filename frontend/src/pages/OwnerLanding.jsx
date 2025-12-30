import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebase";

function OwnerLanding() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [formHeight, setFormHeight] = useState(0);

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false); // ✅ ADDED THIS
  const [myProperties, setMyProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

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

  // Smooth dropdown animation
  useEffect(() => {
    if (showVerificationForm) {
      setFormHeight('auto');
    } else {
      setFormHeight(0);
    }
  }, [showVerificationForm]);

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

  useEffect(() => {
  console.log('🔄 useEffect triggered. User:', user ? user.uid : 'No user');
  console.log('📋 Loading state:', loading);
  
  if (!loading && user) {
    console.log('✨ Calling fetchMyProperties...');
    fetchMyProperties();
  } else if (!loading && !user) {
    console.log('⚠️ No user found, stopping loading');
    setLoadingProperties(false);
  }
}, [user, loading]);

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

  const fetchMyProperties = async () => {
  if (!user) {
    console.log('❌ No user logged in, skipping fetch');
    setLoadingProperties(false);
    return;
  }
  
  try {
    console.log('🔍 Fetching properties for user:', user.uid);
    console.log('📧 User email:', user.email);
    setLoadingProperties(true);
    
    const token = await auth.currentUser.getIdToken();
    console.log('✅ Token obtained successfully');
    
    const response = await fetch('http://localhost:5000/api/properties/my-properties', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('📊 Response status:', response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Properties received:', data.length, 'properties');
      setMyProperties(data);
    } else {
      const errorMessage = await response.text();
      console.error('❌ Error response:', errorMessage);
      alert(`Failed to load properties! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ CRITICAL ERROR:', error);
    alert(`Error fetching properties: ${error.message}`);
  } finally {
    setLoadingProperties(false);
  }
};

// ✅ ADD THIS FUNCTION
const handleDeleteProperty = async (propertyId) => {
  if (!window.confirm('Are you sure you want to delete this property?')) {
    return;
  }

  try {
    setDeletingId(propertyId);
    const token = await auth.currentUser.getIdToken();

    const response = await fetch(`http://localhost:5000/api/properties/${propertyId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      alert('Property deleted successfully!');
      setMyProperties(prev => prev.filter(p => p._id !== propertyId));
    } else {
      throw new Error('Failed to delete property');
    }
  } catch (error) {
    console.error('Error deleting property:', error);
    alert(`Failed to delete property: ${error.message}`);
  } finally {
    setDeletingId(null);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome, {user?.name || "Property Owner"}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">List your property and find the perfect tenants</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => setShowVerificationForm((s) => !s)}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {showVerificationForm ? "Hide Form" : "List Your Property"}
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

      {/* Form Container with Smooth Animation */}
      <div 
        className="overflow-hidden transition-all duration-500 ease-in-out"
        style={{ 
          maxHeight: showVerificationForm ? '5000px' : '0px',
          opacity: showVerificationForm ? 1 : 0,
          transform: showVerificationForm ? 'translateY(0)' : 'translateY(-20px)'
        }}
      >
      {/* Progress Bar */}
      <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStage} of 6</span>
            <span className="text-sm text-gray-500">{Math.round((currentStage / 6) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStage / 6) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Verification</span>
            <span className="text-xs text-gray-500">Property Details</span>
            <span className="text-xs text-gray-500">Pricing</span>
            <span className="text-xs text-gray-500">Amenities</span>
            <span className="text-xs text-gray-500">Rules</span>
            <span className="text-xs text-gray-500">Images</span>
          </div>
        </div>

      {/* Stage 1: Verification Form */}
      {showVerificationForm && currentStage === 1 && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 1: Owner Verification</h2>
            <p className="text-gray-600 mb-6">Please verify your details to proceed with property listing</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                <input
                  type="text"
                  value={verificationData.ownerName}
                  onChange={(e) =>
                    setVerificationData({ ...verificationData, ownerName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Auto-filled from your account"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={verificationData.phoneNumber}
                  onChange={(e) =>
                    setVerificationData({ ...verificationData, phoneNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your phone number for verification"
                />
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
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 2: Property Details</h2>
            <p className="text-gray-600 mb-6">Tell us about your property</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Title *</label>
                <input
                  type="text"
                  value={propertyData.propertyTitle}
                  onChange={(e) => setPropertyData({ ...propertyData, propertyTitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 3 BHK apartment in xyz place"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Property Type *</label>
                <select
                  value={propertyData.propertyType}
                  onChange={(e) => setPropertyData({ ...propertyData, propertyType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Property Type</option>
                  <option value="PG">PG</option>
                  <option value="Shared Flat">Shared Flat</option>
                  <option value="Rented Apartment">Rented Apartment</option>

                </select>
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">BHK / Room Type *</label>
                <select
                  value={propertyData.bhkType}
                  onChange={(e) => setPropertyData({ ...propertyData, bhkType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select BHK/Room Type</option>
                  <option value="1rk">1RK</option>
                  <option value="1bhk">1BHK</option>
                  <option value="2bhk">2BHK</option>
                  <option value="shared">Shared</option>
                  <option value="single">Single</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Furnishing *</label>
                <select
                  value={propertyData.furnishing}
                  onChange={(e) => setPropertyData({ ...propertyData, furnishing: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Furnishing</option>
                  <option value="fully">Fully Furnished</option>
                  <option value="semi">Semi Furnished</option>
                  <option value="unfurnished">Unfurnished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available From *</label>
                <input
                  type="date"
                  value={propertyData.availableFrom}
                  onChange={(e) => setPropertyData({ ...propertyData, availableFrom: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Tenant *</label>
                <select
                  value={propertyData.preferredTenant}
                  onChange={(e) => setPropertyData({ ...propertyData, preferredTenant: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Preferred Tenant</option>
                  <option value="Student">Student</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Family">Family</option>
                  <option value="Anyone">Anyone</option>

                 
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Gender (Optional)</label>
                <select
                  value={propertyData.preferredGender}
                  onChange={(e) => setPropertyData({ ...propertyData, preferredGender: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">No Preference</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Any">Any</option>

                  
                </select>
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

      {/* Stage 3: Pricing - Continues below... */}
      {showVerificationForm && currentStage === 3 && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 3: Pricing Details</h2>
            <p className="text-gray-600 mb-6">Set your pricing and charges with absolute clarity</p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Rent (₹) *</label>
                <input
                  type="number"
                  value={pricingData.monthlyRent}
                  onChange={(e) => setPricingData({ ...pricingData, monthlyRent: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter monthly rent amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Deposit (₹) *</label>
                <input
                  type="number"
                  value={pricingData.securityDeposit}
                  onChange={(e) =>
                    setPricingData({ ...pricingData, securityDeposit: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter security deposit amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Charges *</label>
                <select
                  value={pricingData.maintenanceCharges}
                  onChange={(e) =>
                    setPricingData({ ...pricingData, maintenanceCharges: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="included">Included</option>
                  <option value="extra">Extra</option>
                </select>

                {pricingData.maintenanceCharges === "extra" && (
                  <input
                    type="number"
                    value={pricingData.maintenanceAmount}
                    onChange={(e) =>
                      setPricingData({ ...pricingData, maintenanceAmount: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
                    placeholder="Enter maintenance amount (₹)"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Electricity *</label>
                <select
                  value={pricingData.electricity}
                  onChange={(e) => setPricingData({ ...pricingData, electricity: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="included">Included</option>
                  <option value="metered">Metered</option>
                  <option value="fixed">Fixed per month</option>
                </select>

                {pricingData.electricity === "fixed" && (
                  <input
                    type="number"
                    value={pricingData.electricityAmount}
                    onChange={(e) =>
                      setPricingData({ ...pricingData, electricityAmount: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 mt-2"
                    placeholder="Enter fixed electricity amount (₹)"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Water Charges *</label>
                <select
                  value={pricingData.waterCharges}
                  onChange={(e) => setPricingData({ ...pricingData, waterCharges: e.target.value })}
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
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 4: Amenities</h2>
            <p className="text-gray-600 mb-6">Select all the amenities available with your property</p>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: "wifi", label: "Wi-Fi" },
                  { id: "powerBackup", label: "Power Backup" },
                  { id: "lift", label: "Lift" },
                  { id: "parking", label: "Parking" },
                  { id: "washingMachine", label: "Washing Machine" },
                  { id: "fridge", label: "Fridge" },
                  { id: "ac", label: "Air Conditioning" },
                  { id: "geyser", label: "Geyser" },
                  { id: "housekeeping", label: "Housekeeping" },
                  { id: "security", label: "Security / CCTV" },
                ].map(({ id, label }) => (
                  <label key={id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={amenities[id]}
                      onChange={(e) => setAmenities({ ...amenities, [id]: e.target.checked })}
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
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 5: Rules & Preferences</h2>
            <p className="text-gray-600 mb-6">Set house rules and preferences for your property</p>

            <div className="space-y-6">
              {[
                { id: "smokingAllowed", label: "Smoking Allowed" },
                { id: "alcoholAllowed", label: "Alcohol Allowed" },
                { id: "petsAllowed", label: "Pets Allowed" },
                { id: "visitorRestrictions", label: "Visitor Restrictions" },
              ].map(({ id, label }) => (
                <div key={id} className="flex items-center justify-between">
                  <span className="text-gray-700">{label}</span>
                  <button
                    type="button"
                    className={`${
                      rules[id] ? "bg-green-500" : "bg-gray-200"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                    onClick={() => setRules({ ...rules, [id]: !rules[id] })}
                  >
                    <span className="sr-only">{label}</span>
                    <span
                      className={`${
                        rules[id] ? "translate-x-6" : "translate-x-1"
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
                  onChange={(e) => setRules({ ...rules, curfewRestrictions: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="2"
                  placeholder="e.g., No entry after 10 PM, No visitors after 9 PM, etc."
                />
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
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 6: Upload Property Images</h2>
            <p className="text-gray-600 mb-6">Upload up to 10 high-quality images of your property</p>

            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
                }`}
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

                  const files = Array.from(e.dataTransfer.files || []);
                  if (files.length > 0) {
                    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
                    const newImages = [...(images || []), ...imageFiles].slice(0, 10);
                    setImages(newImages);
                  }
                }}
                onClick={() => document.getElementById("property-images")?.click()}
              >
                <input
                  type="file"
                  id="property-images"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    const newImages = [...(images || []), ...files].slice(0, 10);
                    setImages(newImages);
                    e.target.value = "";
                  }}
                />
                <div className="flex flex-col items-center justify-center py-8 px-4 cursor-pointer">
                  <svg
                    className={`w-12 h-12 ${
                      isDragging ? "text-green-500" : "text-gray-400"
                    } mb-2 transition-colors`}
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
                    {isDragging ? "Drop your images here" : "Upload up to 10 images (JPG, PNG, WEBP) up to 5MB each"}
                  </p>
                </div>
              </div>

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

              {/* ✅ FIXED SUBMIT BUTTON - OUTSIDE THE IMAGE MAP */}
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
                      // Import at the top of your file
                      // Adjust path to your firebase config

                      // Then in the submit function:
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

   {/* ✅ ADD THIS ENTIRE SECTION - MY LISTED PROPERTIES */}
      {!showVerificationForm && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">My Listed Properties</h2>
            <p className="text-gray-600">Manage your property listings</p>
          </div>

          {loadingProperties ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your properties...</p>
            </div>
          ) : myProperties.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Listed Yet</h3>
              <p className="text-gray-600">Start by listing your first property using the button above</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property) => (
                <div key={property._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{property.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {property.city}
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        {property.propertyType}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Monthly Rent</span>
                        <span className="font-semibold text-gray-900">₹{property.pricing.rent}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Security Deposit</span>
                        <span className="font-semibold text-gray-900">₹{property.pricing.deposit}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
  {property.bhkType?.toUpperCase() || 'N/A'}  {/* ✅ Safe with optional chaining */}
</span>

                      <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">{property.furnishing}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4 px-6 pb-4 flex gap-2">
                    <button
                      onClick={() => alert(`View details for ${property._id}`)}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteProperty(property._id)}
                      disabled={deletingId === property._id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium disabled:opacity-50"
                    >
                      {deletingId === property._id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default OwnerLanding;
