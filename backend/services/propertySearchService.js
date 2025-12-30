// backend/services/propertySearchService.js
import Property from '../models/Property.js';

/**
 * Advanced property search with flexible filtering
 * @param {Object} filters - Search filters
 * @param {Object} options - Query options (limit, sort, etc.)
 */
export const searchProperties = async (filters, options = {}) => {
  // Default options
  const {
    limit = 10,
    skip = 0,
    sort = { createdAt: -1 },
    select = 'title propertyType city address propertyDetails pricing amenities images description ownerName ownerPhone verification',
    includeUnverified = true
  } = options;

  // Build dynamic query
  const query = buildSearchQuery(filters, includeUnverified);

  console.log('🔍 Search Query:', JSON.stringify(query, null, 2));
  console.log('📊 Options:', { limit, skip, sort });

  try {
    const properties = await Property.find(query)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean() for better performance

    console.log(`✅ Found ${properties.length} properties`);
    
    // Get total count for pagination
    const total = await Property.countDocuments(query);
    
    return {
      properties,
      total,
      hasMore: total > skip + properties.length
    };
  } catch (error) {
    console.error('❌ Search error:', error);
    throw error;
  }
};

/**
 * Build MongoDB query from filters
 */
function buildSearchQuery(filters, includeUnverified) {
  const query = {};

  // Verification status
  if (!includeUnverified) {
    query['verification.listingStatus'] = 'Verified';
  }

  // City search (flexible - supports multiple cities)
  if (filters.city) {
    if (Array.isArray(filters.city)) {
      query.city = { $in: filters.city.map(c => new RegExp(c, 'i')) };
    } else {
      query.city = new RegExp(filters.city, 'i');
    }
  }

  // Budget range
  if (filters.budgetMin || filters.budgetMax) {
    query['pricing.rent'] = {};
    if (filters.budgetMin) query['pricing.rent'].$gte = parseInt(filters.budgetMin);
    if (filters.budgetMax) query['pricing.rent'].$lte = parseInt(filters.budgetMax);
  }

  // BHK search (flexible - searches in both title and roomType)
  if (filters.bhk && filters.bhk !== 'Any') {
    const bhkNum = filters.bhk.match(/\d+/)?.[0];
    if (bhkNum) {
      query.$or = [
        { title: new RegExp(`${bhkNum}\\s*bhk`, 'i') },
        { 'propertyDetails.roomType': new RegExp(`${bhkNum}\\s*bhk`, 'i') }
      ];
    }
  }

  // Property type (flexible - supports multiple types)
  if (filters.propertyType && filters.propertyType !== 'Any') {
    if (Array.isArray(filters.propertyType)) {
      query.propertyType = { $in: filters.propertyType };
    } else {
      query.propertyType = filters.propertyType;
    }
  }

  // Furnishing type
  if (filters.furnishing && filters.furnishing !== 'Any') {
    query['propertyDetails.furnishing'] = filters.furnishing;
  }

  // Preferred tenant
  if (filters.preferredTenant && filters.preferredTenant !== 'Any') {
    query.preferredTenant = { $in: [filters.preferredTenant, 'Anyone'] };
  }

  // Gender preference
  if (filters.preferredGender && filters.preferredGender !== 'Any') {
    query.preferredGender = { $in: [filters.preferredGender, 'Any'] };
  }

  // Amenities (must have ALL specified amenities)
  if (filters.amenities && filters.amenities.length > 0) {
    query.amenities = { $all: filters.amenities };
  }

  // Available from date
  if (filters.availableFrom) {
    query['propertyDetails.availableFrom'] = { 
      $lte: new Date(filters.availableFrom) 
    };
  }

  // Location-based search (if coordinates provided)
  if (filters.latitude && filters.longitude && filters.maxDistance) {
    query.location = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(filters.longitude), parseFloat(filters.latitude)]
        },
        $maxDistance: parseInt(filters.maxDistance) // in meters
      }
    };
  }

  // Text search across multiple fields
  if (filters.searchText) {
    query.$or = [
      { title: new RegExp(filters.searchText, 'i') },
      { description: new RegExp(filters.searchText, 'i') },
      { address: new RegExp(filters.searchText, 'i') }
    ];
  }

  return query;
}

/**
 * Format properties for AI with configurable template
 */
export const formatPropertiesForAI = (properties, format = 'detailed') => {
  if (!properties || properties.length === 0) {
    return "No properties found matching the criteria.";
  }

  const formatters = {
    detailed: formatDetailed,
    compact: formatCompact,
    markdown: formatMarkdown
  };

  const formatter = formatters[format] || formatDetailed;
  return formatter(properties);
};

/**
 * Detailed format with all information
 */
function formatDetailed(properties) {
  return properties.map((p, index) => {
    const parts = [
      `Property ${index + 1}: ${p.title || 'Untitled Property'}`,
      `Type: ${p.propertyType}${p.propertyDetails?.roomType ? ` | ${p.propertyDetails.roomType}` : ''}`,
      `Rent: ₹${p.pricing?.rent?.toLocaleString('en-IN') || 'Not specified'}/month`,
      `Deposit: ₹${p.pricing?.deposit?.toLocaleString('en-IN') || 'Not specified'}`,
      `Location: ${p.address || p.city}`,
    ];

    if (p.propertyDetails?.furnishing) {
      parts.push(`Furnishing: ${p.propertyDetails.furnishing}`);
    }

    if (p.pricing?.electricity) {
      parts.push(`Electricity: ${p.pricing.electricity}`);
    }

    if (p.pricing?.water) {
      parts.push(`Water: ${p.pricing.water}`);
    }

    if (p.pricing?.maintenance?.amount) {
      parts.push(`Maintenance: ₹${p.pricing.maintenance.amount} (${p.pricing.maintenance.type})`);
    }

    if (p.amenities?.length > 0) {
      parts.push(`Amenities: ${p.amenities.join(', ')}`);
    }

    if (p.preferredTenant) {
      parts.push(`Preferred Tenant: ${p.preferredTenant}`);
    }

    if (p.preferredGender && p.preferredGender !== 'Any') {
      parts.push(`Gender: ${p.preferredGender}`);
    }

    if (p.propertyDetails?.availableFrom) {
      const date = new Date(p.propertyDetails.availableFrom);
      parts.push(`Available From: ${date.toLocaleDateString()}`);
    }

    if (p.description) {
      parts.push(`Description: ${p.description.substring(0, 150)}${p.description.length > 150 ? '...' : ''}`);
    }

    if (p.ownerName) {
      parts.push(`Owner: ${p.ownerName}${p.ownerPhone ? ` | Contact: ${p.ownerPhone}` : ''}`);
    }

    return parts.map(line => `- ${line}`).join('\n');
  }).join('\n\n');
}

/**
 * Compact format for quick overview
 */
function formatCompact(properties) {
  return properties.map((p, index) => 
    `${index + 1}. ${p.title} | ${p.propertyType} | ₹${p.pricing?.rent?.toLocaleString('en-IN')}/mo | ${p.city}`
  ).join('\n');
}

/**
 * Markdown format with emojis (best for chat)
 */
function formatMarkdown(properties) {
  return properties.map((p, index) => {
    let md = `**Property ${index + 1}: ${p.title || 'Untitled Property'}**\n\n`;
    
    md += `🏠 **Type:** ${p.propertyType}${p.propertyDetails?.roomType ? ` | ${p.propertyDetails.roomType}` : ''}\n`;
    md += `💰 **Rent:** ₹${p.pricing?.rent?.toLocaleString('en-IN') || 'Not specified'}/month\n`;
    md += `💳 **Deposit:** ₹${p.pricing?.deposit?.toLocaleString('en-IN') || 'Not specified'}\n`;
    md += `📍 **Location:** ${p.address || p.city}\n`;
    
    if (p.propertyDetails?.furnishing) {
      md += `🪑 **Furnishing:** ${p.propertyDetails.furnishing}\n`;
    }
    
    if (p.pricing?.electricity) {
      md += `⚡ **Electricity:** ${p.pricing.electricity}\n`;
    }
    
    if (p.amenities?.length > 0) {
      md += `✨ **Amenities:** ${p.amenities.join(', ')}\n`;
    }
    
    if (p.ownerName) {
      md += `👤 **Owner:** ${p.ownerName}${p.ownerPhone ? ` | 📞 ${p.ownerPhone}` : ''}\n`;
    }
    
    return md;
  }).join('\n---\n\n');
}

/**
 * Extract search criteria from natural language
 */
export const extractSearchCriteria = (message) => {
  const lowerMessage = message.toLowerCase();
  
  const criteria = {
    city: extractCity(lowerMessage),
    budgetMin: null,
    budgetMax: null,
    bhk: extractBHK(lowerMessage),
    propertyType: extractPropertyType(lowerMessage),
    furnishing: extractFurnishing(lowerMessage),
    amenities: extractAmenities(lowerMessage),
    preferredTenant: extractTenantType(lowerMessage)
  };

  // Extract budget
  const budget = extractBudget(lowerMessage);
  criteria.budgetMin = budget.min;
  criteria.budgetMax = budget.max;

  return criteria;
};

/**
 * Extract city from message
 */
function extractCity(message) {
  const cities = [
    'bengaluru', 'bangalore', 'mumbai', 'pune', 'delhi', 'hyderabad', 
    'chennai', 'kolkata', 'thane', 'ahmedabad', 'surat', 'jaipur',
    'lucknow', 'kanpur', 'nagpur', 'indore', 'bhopal', 'visakhapatnam',
    'pimpri', 'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra',
    'nashik', 'faridabad', 'meerut', 'rajkot', 'varanasi', 'srinagar'
  ];
  
  for (const city of cities) {
    if (message.includes(city)) {
      return city === 'bangalore' ? 'Bengaluru' : 
             city.charAt(0).toUpperCase() + city.slice(1);
    }
  }
  
  return null;
}

/**
 * Extract budget from message
 */
function extractBudget(message) {
  const budget = { min: null, max: null };
  
  // Pattern: "under ₹20,000" or "under 20k"
  const underMatch = message.match(/under\s*[₹rs.\s]*(\d+)[,\s]*(\d+)?k?/i);
  if (underMatch) {
    let amount = parseInt(underMatch[1]);
    if (underMatch[2]) {
      amount = amount * 1000 + parseInt(underMatch[2]);
    } else if (message.includes('k') || message.includes('K')) {
      amount = amount * 1000;
    }
    budget.max = amount;
    return budget;
  }
  
  // Pattern: "between ₹10,000 to ₹20,000"
  const rangeMatch = message.match(/between\s*[₹rs.\s]*(\d+)[,\s]*(\d+)?\s*(?:to|and|-)\s*[₹rs.\s]*(\d+)[,\s]*(\d+)?/i);
  if (rangeMatch) {
    budget.min = parseInt(rangeMatch[1] + (rangeMatch[2] || '000'));
    budget.max = parseInt(rangeMatch[3] + (rangeMatch[4] || '000'));
    return budget;
  }
  
  // Pattern: "around ₹15,000"
  const aroundMatch = message.match(/around\s*[₹rs.\s]*(\d+)[,\s]*(\d+)?/i);
  if (aroundMatch) {
    const amount = parseInt(aroundMatch[1] + (aroundMatch[2] || '000'));
    budget.min = amount * 0.8; // 20% below
    budget.max = amount * 1.2; // 20% above
    return budget;
  }
  
  return budget;
}

/**
 * Extract BHK from message
 */
function extractBHK(message) {
  const bhkMatch = message.match(/(\d+)\s*(?:bhk|rk)/i);
  if (bhkMatch) {
    const num = bhkMatch[1];
    return message.includes('rk') ? `${num} RK` : `${num} BHK`;
  }
  return null;
}

/**
 * Extract property type from message
 */
function extractPropertyType(message) {
  if (message.includes('pg') || message.includes('paying guest')) return 'PG';
  if (message.includes('shared flat') || message.includes('flatmate')) return 'Shared Flat';
  if (message.includes('apartment') || message.includes('flat')) return 'Rented Apartment';
  return null;
}

/**
 * Extract furnishing type from message
 */
function extractFurnishing(message) {
  if (message.includes('fully furnished') || message.includes('full furnished')) return 'Fully Furnished';
  if (message.includes('semi furnished') || message.includes('semi-furnished')) return 'Semi Furnished';
  if (message.includes('unfurnished') || message.includes('empty')) return 'Unfurnished';
  return null;
}

/**
 * Extract amenities from message
 */
function extractAmenities(message) {
  const amenities = [];
  const amenityMap = {
    'wifi': ['wifi', 'wi-fi', 'internet'],
    'parking': ['parking', 'car parking', 'bike parking'],
    'gym': ['gym', 'fitness', 'workout'],
    'ac': ['ac', 'air conditioning', 'air conditioner'],
    'lift': ['lift', 'elevator'],
    'security': ['security', 'guard', 'watchman'],
    'power backup': ['power backup', 'generator', 'ups'],
    'water': ['water 24/7', '24x7 water', 'water supply']
  };
  
  for (const [amenity, keywords] of Object.entries(amenityMap)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      amenities.push(amenity);
    }
  }
  
  return amenities;
}

/**
 * Extract tenant type from message
 */
function extractTenantType(message) {
  if (message.includes('student')) return 'Student';
  if (message.includes('professional') || message.includes('working')) return 'Working Professional';
  if (message.includes('family')) return 'Family';
  return null;
}
