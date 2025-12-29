function PropertyCard() {
  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition">
      <img
        src="https://via.placeholder.com/400x250"
        alt="property"
        className="rounded-t-lg"
      />

      <div className="p-4">
        <h2 className="font-semibold text-lg">
          2BHK Furnished Flat
        </h2>

        <p className="text-gray-600">
          Indiranagar, Bangalore
        </p>

        <p className="mt-2 font-bold">
          ₹15,000 / month
        </p>

        <button className="mt-3 w-full bg-black text-white py-2 rounded">
          View Details
        </button>
      </div>
    </div>
  );
}

export default PropertyCard;
