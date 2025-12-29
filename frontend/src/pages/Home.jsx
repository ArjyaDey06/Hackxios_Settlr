import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useRef, useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const properties = [
    {
      city: "Bengaluru",
      type: "2BHK",
      price: "₹18,000",
      features: "No brokerage"
    },
    {
      city: "Coimbatore", 
      type: "3BHK",
      price: "₹12,000",
      features: "Semi furnished"
    },
    {
      city: "Indore",
      type: "1BHK", 
      price: "₹8,000",
      features: "Near metro"
    },
    {
      city: "Nagpur",
      type: "2BHK",
      price: "₹10,000", 
      features: "Parking available"
    },
    {
      city: "Trivandrum",
      type: "3BHK",
      price: "₹15,000",
      features: "Sea view"
    },
    {
      city: "Jaipur",
      type: "1BHK",
      price: "₹9,000",
      features: "Gated community"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollCarousel = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % properties.length
      : (currentIndex - 1 + properties.length) % properties.length;
    setCurrentIndex(newIndex);
    updateCarouselPosition(newIndex);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    updateCarouselPosition(index);
  };

  const updateCarouselPosition = (index) => {
    if (carouselRef.current) {
      const carousel = carouselRef.current.querySelector('.flex');
      carousel.style.transform = `translateX(-${index * 100}%)`;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollCarousel('next');
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-24 mt-8">

        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Rent smart, Live better with 
          </h1>

          <p className="mt-5 text-gray-600 text-lg">
            Find verified rentals with{" "}
            <span className="font-medium text-black">
              zero hidden charges
            </span>
            , transparent pricing, and instant booking.
          </p>

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

        <div className="hidden md:flex justify-center">
          <div className="relative w-80">
            <div ref={carouselRef} className="overflow-hidden rounded-2xl">
              <div className="flex transition-transform duration-500 ease-in-out">
                {properties.map((property, index) => (
                  <div key={index} className="min-w-full">
                    <div className="bg-black rounded-2xl shadow-xl p-6 w-80">
                      <div className="h-40 bg-gray-800 rounded-lg mb-4" />
                      <h3 className="font-semibold text-lg text-white">{property.type} • {property.city}</h3>
                      <p className="text-gray-300 text-sm mt-1">
                        {property.price} / month • {property.features}
                      </p>
                      <button className="mt-4 w-full bg-[#26f50c] text-black py-2 rounded-lg font-semibold hover:bg-[#26f50c]/90 transition">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => scrollCarousel('prev')}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/80 text-white p-2 rounded-full hover:bg-black transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scrollCarousel('next')}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/80 text-white p-2 rounded-full hover:bg-black transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div className="flex justify-center mt-4 space-x-2">
              {properties.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition ${
                    index === currentIndex ? 'bg-[#26f50c]' : 'bg-gray-400 hover:bg-[#26f50c]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        </div>

        {/* Feature Highlights - Parallelogram Cards */}
        <div className="flex justify-center">
          <div className="space-y-6 max-w-2xl w-full">
            {/* Card 1 */}
            <div className="transform -skew-x-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="transform skew-x-6 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#26f50c]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#26f50c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Direct Connection</h3>
                </div>
                <p className="text-black text-base">
                  No third party broker involvement, find your stays and tenant on this platform!
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="transform -skew-x-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="transform skew-x-6 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#26f50c]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#26f50c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">AI-Powered Search</h3>
                </div>
                <p className="text-black text-base">
                  Filtering is too time taking, ask our AI to help you find your stays 😉
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="transform -skew-x-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="transform skew-x-6 p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#26f50c]/20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#26f50c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">How much do we charge?</h3>
                </div>
                <p className="text-black text-base">
                  Money? nah that's not our style, customer satisfaction is our profit!
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;