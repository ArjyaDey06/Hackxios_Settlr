import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import { useRef, useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const cardRefs = useRef([]);

  const properties = [
    {
      city: "Bengaluru",
      type: "2BHK",
      price: "₹18,000",
      features: "No brokerage",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    },
    {
      city: "Coimbatore", 
      type: "3BHK",
      price: "₹12,000",
      features: "Semi furnished",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
    },
    {
      city: "Indore",
      type: "1BHK", 
      price: "₹8,000",
      features: "Near metro",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80"
    },
    {
      city: "Nagpur",
      type: "2BHK",
      price: "₹10,000", 
      features: "Parking available",
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"
    },
    {
      city: "Trivandrum",
      type: "3BHK",
      price: "₹15,000",
      features: "Sea view",
      image: "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=800&q=80"
    },
    {
      city: "Jaipur",
      type: "1BHK",
      price: "₹9,000",
      features: "Gated community",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState([false, false, false, false]);

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

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1) {
              setVisibleCards((prev) => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px"
      }
    );

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  const features = [
    {
      icon: (
        <svg className="w-5 h-5 text-[#26f50c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Direct Connection",
      description: "No third party broker involvement, find your stays and tenant on this platform!"
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#26f50c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered Search",
      description: "Filtering is too time taking, ask our AI to help you find your stays 😉"
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#26f50c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "How much do we charge?",
      description: "Money? nah that's not our style, customer satisfaction is our profit!"
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#26f50c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "Is this safe?",
      description: "No fake listings, no surprises - only genuine stays verified by us!"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center px-4">
      <div className="max-w-5xl w-full">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-24 mt-8">

        <div className="text-center md:text-left">
          <div className="max-w-lg">
            <h1 className="text-6xl sm:text-7xl font-black leading-tight tracking-tight">
              Rent smart, Live better
            </h1>
          </div>

          <div className="max-w-md mt-8">
            <p className="text-xl text-gray-600 leading-relaxed">
              Find verified rentals with{" "}
              <span className="font-bold text-black text-xl">
                zero hidden charges
              </span>
              , transparent pricing, and instant booking.
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-6">
            <button
              onClick={() => navigate("/register")}
              className="px-10 py-4 bg-black text-white rounded-xl hover:bg-gray-900 hover:shadow-2xl hover:shadow-black/30 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-black/20 transition-all duration-300 font-bold text-lg"
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="px-10 py-4 border-2 border-black rounded-xl hover:bg-black hover:text-white hover:shadow-xl hover:shadow-black/20 transition-all duration-300 font-semibold text-lg"
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
                      <div 
                        className="h-40 rounded-lg mb-4 bg-cover bg-center"
                        style={{ backgroundImage: `url(${property.image})` }}
                      />
                      <h3 className="font-semibold text-lg text-white">{property.type} • {property.city}</h3>
                      <p className="text-gray-300 text-sm mt-1">
                        {property.price} / month • {property.features}
                      </p>
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
        <div className="flex justify-center mb-20">
          <div className="space-y-12 max-w-2xl w-full">
            {features.map((feature, index) => (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`transform -skew-x-6 bg-white rounded-2xl shadow-[4px_4px_0_0_#26f50c,-4px_4px_0_0_#26f50c,0_8px_20px_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0_0_#26f50c,-6px_6px_0_0_#26f50c,0_12px_25px_rgba(0,0,0,0.2)] transition-all duration-700 hover:scale-105 ${
                  visibleCards[index]
                    ? 'opacity-100 translate-x-0'
                    : index % 2 === 0
                    ? 'opacity-0 -translate-x-32'
                    : 'opacity-0 translate-x-32'
                }`}
              >
                <div className="transform skew-x-6 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#26f50c]/20 rounded-full flex items-center justify-center">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-black text-base">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;