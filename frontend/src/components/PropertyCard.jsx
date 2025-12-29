import { MapPinIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

function PropertyCard({ title, price, location, image, trustScore }) {
  const formattedPrice =
    typeof price === "number" ? price.toLocaleString("en-IN") : price;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image Container - Edge to Edge */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-64 object-cover"
        />
        
        {/* Floating Trust Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-600">{trustScore}% Trust</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <p className="text-2xl font-bold text-emerald-600">
          ₹{formattedPrice}
          <span className="text-sm font-normal text-gray-500">/month</span>
        </p>

        <h3 className="mt-2 text-lg font-semibold text-gray-800">
          {title}
        </h3>

        <div className="mt-1 flex items-center text-gray-500 text-sm">
          <MapPinIcon className="w-4 h-4 mr-1" />
          {location}
        </div>
      </div>
    </div>
  );
}

export default PropertyCard;
