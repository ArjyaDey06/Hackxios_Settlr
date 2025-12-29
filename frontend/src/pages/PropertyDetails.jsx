import { useParams } from "react-router-dom";
import properties from "../data/properties";

function PropertyDetails() {
  const { id } = useParams();
  const property = properties.find((p) => p.id === Number(id));

  if (!property) return <p>Property not found</p>;

  return (
    <div className="p-6">
      <img
        src={property.image}
        alt={property.title}
        className="w-full h-64 object-cover rounded"
      />

      <h1 className="text-2xl font-bold mt-4">
        {property.title}
      </h1>

      <p className="text-gray-600">
        {property.area}, {property.city}
      </p>

      <div className="mt-4">
        <p><b>Rent:</b> ₹{property.rent}</p>
        <p><b>Deposit:</b> ₹{property.deposit}</p>
        <p><b>Furnishing:</b> {property.furnishing}</p>
        <p><b>Preferred Gender:</b> {property.gender}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Amenities</h3>
        <ul className="list-disc ml-5">
          {property.amenities.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold">Rules</h3>
        <ul className="list-disc ml-5">
          {property.rules.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>

      <a
        href={`tel:${property.ownerPhone}`}
        className="inline-block mt-6 bg-green-600 text-white px-6 py-2 rounded"
      >
        Contact Owner
      </a>
    </div>
  );
}

export default PropertyDetails;
