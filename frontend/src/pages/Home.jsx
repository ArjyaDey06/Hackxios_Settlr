import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Rent Smart with <span className="text-black">Settlr</span>
          </h1>

          <p className="mt-5 text-gray-600 text-lg">
            Find verified rentals with{" "}
            <span className="font-medium text-black">
              zero hidden charges
            </span>
            , transparent pricing, and instant booking.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 border border-black rounded-lg hover:bg-black hover:text-white transition"
            >
              Login
            </button>
          </div>
        </div>

        {/* Right Visual */}
        <div className="hidden md:flex justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80">
            <div className="h-40 bg-gray-200 rounded-lg mb-4" />
            <h3 className="font-semibold text-lg">2BHK • Bengaluru</h3>
            <p className="text-gray-600 text-sm mt-1">
              ₹18,000 / month • No brokerage
            </p>

            <button className="mt-4 w-full bg-black text-white py-2 rounded-lg">
              View Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
