import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebase";
import { MapPin, Trash2, Eye, Home, Users, ChevronRight, Check } from "lucide-react";

function OwnerLanding() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const LOCATIONIQ_KEY = import.meta.env.VITE_LOCATIONIQ_KEY;

  const [showVerificationForm, setShowVerificationForm] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [isFormAnimating, setIsFormAnimating] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Form stages configuration
  const formStages = [
    { id: 1, title: "Owner Verification", description: "Verify your identity" },
    { id: 2, title: "Property Details", description: "Basic property information" },
    { id: 3, title: "Pricing", description: "Rent and deposit details" },
    { id: 4, title: "Amenities", description: "Available facilities" },
    { id: 5, title: "Rules & Preferences", description: "House rules and tenant preferences" },
    { id: 6, title: "Upload Images", description: "Add property photos" }
  ];

  // Calculate completion percentage
  const completionPercentage = Math.round((currentStage / formStages.length) * 100);

  // Handle smooth transition between landing and form
  const handleShowForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowVerificationForm(true);
      setIsTransitioning(false);
    }, 100);
  };

  const handleHideForm = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowVerificationForm(false);
      setIsTransitioning(false);
      // Smooth scroll to top when form is closed
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Stage navigation functions
  const goToNextStage = () => {
    setIsFormAnimating(true);
    setTimeout(() => {
      setCurrentStage(prev => Math.min(prev + 1, formStages.length));
      setIsFormAnimating(false);
      // Scroll to form title after stage change with offset
      const formTitle = document.querySelector('.transition-form-visible h2');
      if (formTitle) {
        const offset = 100; // Adjust this value as needed
        const elementPosition = formTitle.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 400);
  };

  const goToPreviousStage = () => {
    setIsFormAnimating(true);
    setTimeout(() => {
      setCurrentStage(prev => Math.max(prev - 1, 1));
      setIsFormAnimating(false);
      // Scroll to form title after stage change with offset
      const formTitle = document.querySelector('.transition-form-visible h2');
      if (formTitle) {
        const offset = 100; // Adjust this value as needed
        const elementPosition = formTitle.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 400);
  };

  const goToStage = (stageId) => {
    setIsFormAnimating(true);
    setTimeout(() => {
      setCurrentStage(stageId);
      setIsFormAnimating(false);
      // Scroll to form title after stage change with offset
      const formTitle = document.querySelector('.transition-form-visible h2');
      if (formTitle) {
        const offset = 100; // Adjust this value as needed
        const elementPosition = formTitle.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 400);
  };

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
    <div className="min-h-screen bg-white relative">
      {/* Header with Back Button */}
      <div className="absolute top-4 left-4 z-20">
        {/* Back Button */}
        <button
          onClick={() => navigate("/landing")}
          className="back-button"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Welcome, {user?.name || "Property Owner"}!
            </h1>
            <p className="text-xl text-gray-600 mb-8">List your property and find the perfect tenants</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={showVerificationForm ? handleHideForm : handleShowForm}
                className="px-10 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/30 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-600/30 focus:ring-offset-2 transition-all duration-300 font-bold text-lg"
              >
                {showVerificationForm ? "Hide Form" : "List Your Property"}
              </button>
            </div>

            {!canUseLocationIQ && (
              <p className="text-sm text-amber-700">
                LocationIQ autocomplete is disabled (missing VITE_LOCATIONIQ_KEY).
              </p>
            )}

            {/* Marketing Content */}
            <div className={`transition-marketing ${
              isTransitioning || showVerificationForm 
                ? 'transition-marketing-hidden' 
                : 'transition-marketing-visible'
            }`}>
              <div className="bg-white/70">
                <div className="max-w-7xl mx-auto px-4 py-3">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Quick 5-minute listing process</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Instant verification</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Reach verified tenants</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar and Stage Navigation - Only show when form is active */}
      {showVerificationForm && (
        <div className={`z-40 transition-progress ${
          isTransitioning 
            ? 'transition-progress-hidden' 
            : 'transition-progress-visible'
        }`}>
          <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Progress Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-medium text-gray-900">
                Step {currentStage} of {formStages.length} — {formStages[currentStage - 1]?.title}
              </div>
              <div className="text-sm font-medium text-green-600">
                {completionPercentage}%
              </div>
            </div>

            {/* Modern Step Dots Progress Bar */}
            <div className="flex items-center justify-center space-x-3">
              {formStages.map((stage, index) => {
                const isCompleted = index + 1 < currentStage;
                const isCurrent = index + 1 === currentStage;
                const isUpcoming = index + 1 > currentStage;
                
                return (
                  <div key={stage.id} className="flex items-center">
                    {/* Step Dot */}
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/30'
                            : isCurrent
                            ? 'bg-green-100 text-green-700 border-2 border-green-500 scale-110 shadow-md'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                        }`}
                      >
                        {isCompleted ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          index + 1
                        )}
                      </div>
                      
                      {/* Step Label */}
                      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                        <span className={`text-xs font-medium transition-colors duration-300 ${
                          isCurrent ? 'text-green-700' : isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {stage.title.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                    
                    {/* Connector Line */}
                    {index < formStages.length - 1 && (
                      <div className={`w-12 h-0.5 mx-2 transition-all duration-500 ${
                        index + 1 < currentStage ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stage 1: Verification Form */}
      {showVerificationForm && currentStage === 1 && (
        <div className={`max-w-2xl mx-auto px-4 py-8 transition-form ${
          isFormAnimating || isTransitioning 
            ? 'transition-form-hidden' 
            : 'transition-form-visible'
        }`}>
          <div className="bg-white rounded-2xl border-2 border-green-500 p-12">
            <h2 className="text-4xl font-black mb-3 text-gray-900">Stage 1: Owner Verification</h2>
            <p className="text-gray-600 mb-12 text-lg">Please verify your details to proceed with property listing</p>

            <div className="space-y-10">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Owner Name</label>
                <input
                  type="text"
                  value={verificationData.ownerName}
                  onChange={(e) =>
                    setVerificationData({ ...verificationData, ownerName: e.target.value })
                  }
                  className="w-full px-5 py-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all duration-200"
                  placeholder="Auto-filled from your account"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Phone Number *</label>
                <input
                  type="tel"
                  value={verificationData.phoneNumber}
                  onChange={(e) =>
                    setVerificationData({ ...verificationData, phoneNumber: e.target.value })
                  }
                  className="w-full px-5 py-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition-all duration-200"
                  placeholder="Enter your phone number for verification"
                />
                <p className="mt-2 text-xs text-gray-500">Used only for verification and tenant communication</p>
              </div>

              <div className="flex gap-6 mt-12">
                <button
                  className="flex-1 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 hover:-translate-y-0.5 transition-all duration-300 font-semibold text-lg"
                  onClick={goToNextStage}
                >
                  Verify & Continue
                </button>
                <button
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={handleHideForm}
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
        <div className={`max-w-2xl mx-auto px-4 py-8 transition-form ${
          isFormAnimating || isTransitioning 
            ? 'transition-form-hidden' 
            : 'transition-form-visible'
        }`}>
          <div className="bg-white rounded-2xl border-2 border-green-500 p-10">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Stage 2: Property Details</h2>
            <p className="text-gray-600 mb-8 text-lg">Tell us about your property</p>

            <div className="space-y-8">
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

                  {/* <option value="working-professional">Working Professional</option>
                  <option value="family">Family</option>
                  <option value="anyone">Anyone</option> */}
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
                  onClick={goToNextStage}
                >
                  Continue to Next Stage
                </button>
                <button
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={goToPreviousStage}
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
        <div className={`max-w-2xl mx-auto px-4 py-8 transition-form ${
          isFormAnimating || isTransitioning 
            ? 'transition-form-hidden' 
            : 'transition-form-visible'
        }`}>
          <div className="bg-white rounded-2xl border-2 border-green-500 p-8">
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
                  onClick={goToNextStage}
                >
                  Continue to Next Stage
                </button>
                <button
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={goToPreviousStage}
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
        <div className={`max-w-2xl mx-auto px-4 py-8 transition-form ${
          isFormAnimating || isTransitioning 
            ? 'transition-form-hidden' 
            : 'transition-form-visible'
        }`}>
          <div className="bg-white rounded-2xl border-2 border-green-500 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 4: Amenities</h2>
            <p className="text-gray-600 mb-6">Select all the amenities available with your property</p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { id: "wifi", label: "Wi-Fi", icon: "📶" },
                  { id: "powerBackup", label: "Power Backup", icon: "⚡" },
                  { id: "lift", label: "Lift", icon: "🛗" },
                  { id: "parking", label: "Parking", icon: "🚗" },
                  { id: "washingMachine", label: "Washing Machine", icon: "🌊" },
                  { id: "fridge", label: "Fridge", icon: "❄️" },
                  { id: "ac", label: "Air Conditioning", icon: "❄️" },
                  { id: "geyser", label: "Geyser", icon: "🚿" },
                  { id: "housekeeping", label: "Housekeeping", icon: "🧹" },
                  { id: "security", label: "Security / CCTV", icon: "🔒" },
                ].map(({ id, label, icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAmenities({ ...amenities, [id]: !amenities[id] })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      amenities[id]
                        ? 'border-green-500 bg-green-50 shadow-sm hover:shadow-md hover:bg-green-100'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={amenities[id]}
                      onChange={(e) => setAmenities({ ...amenities, [id]: e.target.checked })}
                      className="sr-only"
                      tabIndex="-1"
                    />
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-2xl">{icon}</span>
                      <span className={`text-sm font-medium text-center ${
                        amenities[id] ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {label}
                      </span>
                    </div>
                    {amenities[id] && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
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
        <div className={`max-w-2xl mx-auto px-4 py-8 transition-form ${
          isFormAnimating || isTransitioning 
            ? 'transition-form-hidden' 
            : 'transition-form-visible'
        }`}>
          <div className="bg-white rounded-2xl border-2 border-green-500 p-8">
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
                    className={`${rules[id] ? "bg-green-500" : "bg-gray-200"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                    onClick={() => setRules({ ...rules, [id]: !rules[id] })}
                  >
                    <span className="sr-only">{label}</span>
                    <span
                      className={`${rules[id] ? "translate-x-6" : "translate-x-1"
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
                  onClick={goToNextStage}
                >
                  Next: Upload Images
                </button>
                <button
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  onClick={goToPreviousStage}
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
        <div className={`max-w-4xl mx-auto px-4 py-8 transition-form ${
          isFormAnimating || isTransitioning 
            ? 'transition-form-hidden' 
            : 'transition-form-visible'
        }`}>
          <div className="bg-white rounded-2xl border-2 border-green-500 p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Stage 6: Upload Property Images</h2>
            <p className="text-gray-600 mb-6">Upload up to 10 high-quality images of your property</p>

            <div className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? "border-green-500 bg-green-50" : "border-gray-300"
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
                    className={`w-12 h-12 ${isDragging ? "text-green-500" : "text-gray-400"
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

                      handleHideForm();
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
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Listed Yet</h3>
              <p className="text-gray-600 mb-6">Start by listing your first property</p>
              <button
                onClick={() => setShowVerificationForm(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                List Your First Property
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myProperties.map((property) => (
                <div key={property._id} className="group bg-black border border-white/5 rounded-xl overflow-hidden shadow-xl shadow-black/20 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 cursor-pointer transition-all duration-300 ease-out hover:scale-[1.01] hover:translate-y-[-4px]">
                  {/* Image Section */}
                  <div className="relative h-48 overflow-hidden rounded-t-xl">
                    {property.images && property.images.length > 0 ? (
                      <div className="relative">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 flex items-center justify-center">
                        <Home className="w-16 h-16 text-emerald-500/30" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                        {property.bhkType?.toUpperCase() || 'N/A'}  {/* ✅ Safe with optional chaining */}
                      </span>

                      <span className="px-2 py-1 bg-gray-100 rounded text-xs capitalize">{property.furnishing}</span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 space-y-6">
                    <h3 className="text-xl font-bold text-white tracking-tight mb-2 capitalize">
                      {property.title}
                    </h3>
                    
                    <div className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded border border-emerald-500/20 mt-2">
                      {property.propertyType}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <MapPin className="w-4 h-4" />
                      <span>{property.city}</span>
                    </div>

                    {/* Pricing */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-emerald-400 uppercase tracking-wider">Monthly Rent</span>
                        <span className="text-xl font-bold text-emerald-400">₹{property.pricing?.rent || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-emerald-400 uppercase tracking-wider">Security Deposit</span>
                        <span className="text-xl font-bold text-emerald-400">₹{property.pricing?.deposit || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => alert(`View details for ${property._id}`)}
                        className="flex-1 bg-emerald-500/90 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all duration-300"
                      >
                        VIEW DETAILS
                      </button>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        disabled={deletingId === property._id}
                        className="w-10 h-10 flex items-center justify-center bg-gray-100 border border-gray-200 hover:border-red-400 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-all duration-300 disabled:opacity-50"
                      >
                        {deletingId === property._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
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
