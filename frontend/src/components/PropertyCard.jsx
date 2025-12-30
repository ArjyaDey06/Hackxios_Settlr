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
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl px-3 py-2 shadow-xl border border-white/20">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-emerald-700">{trustScore}% Trust</span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        <p className="text-2xl font-bold text-emerald-600">
          ₹{formattedPrice}
          <span className="text-sm font-normal text-gray-500">/month</span>
        </p>

        <div className="mt-3 flex items-center text-gray-700 font-medium">
          <MapPinIcon className="w-4 h-4 mr-2" />
          {location}
        </div>

        <h3 className="mt-2 text-base font-normal text-gray-500 opacity-75">
          {title}
        </h3>
      </div>
    </div>
  );
}

export default PropertyCard;
