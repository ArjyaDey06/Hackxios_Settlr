import { useAuth } from "../context/AuthContext";
import PropertyCard from "../components/PropertyCard";
import FilterBar from "../components/FilterBar";


function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="p-6">
            {/* Header */}
            <h1 className="text-2xl font-bold">
                Welcome, {user?.name}
            </h1>
            <p className="text-gray-600 mb-6">
                Find stays that match your lifestyle
            </p>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search city, area, or keyword"
                className="w-full p-3 border rounded mb-6"
            />

            <FilterBar />

            <textarea
                placeholder="Describe your requirement... (AI assisted)"
                className="w-full p-3 border rounded mb-6"
                rows="3"
            />


            {/* Property Listings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PropertyCard />
                <PropertyCard />
                <PropertyCard />
            </div>
        </div>
    );
}

export default Dashboard;
