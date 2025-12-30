import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SplitText from "../components/SplitText";
import Footer from "../components/Footer";
import PropertyCard from "../components/PropertyCard";
import AnimatedCard from "../components/AnimatedCard";
import { useRef, useEffect } from "react";

const handleAnimationComplete = () => {
  console.log('Welcome text animation completed!');
};

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const buttonsRef = useRef(null);

  // Extract first name from full name
  const getFirstName = (fullName) => {
    if (!fullName) return "User";
    return fullName.split(' ')[0];
  };

  // Add pop-up animation for cards
  useEffect(() => {
    if (buttonsRef.current && !loading) {
      const buttons = buttonsRef.current.children;
      
      // Simple pop-up animation
      Array.from(buttons).forEach((button, index) => {
        button.style.animation = `popUp 0.4s ease-out ${index * 0.1}s both`;
      });
    }
  }, [loading]);

  const featuredProperties = [
    {
      id: 1,
      title: "Modern 2BHK in Koramangala",
      price: 18000,
      location: "Indiranagar, Bangalore",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80",
      trustScore: 92,
    },
    {
      id: 2,
      title: "Cozy 1BHK near MG Road",
      price: 12000,
      location: "HSR Layout, Bangalore",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
      trustScore: 88,
    },
    {
      id: 3,
      title: "Luxury 3BHK with City View",
      price: 25000,
      location: "Whitefield, Bangalore",
      image:
        "https://images.unsplash.com/photo-15129177724-750e9803-bf80f42370?auto=format&fit=crop&w=1600&q=80",
      trustScore: 95,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <style jsx>{`
        @keyframes popUp {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
      {/* Hero Section */}
      <div className="bg-white border-b flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center flex flex-col items-center justify-center">
            <SplitText
              text={`Welcome back, ${getFirstName(user?.name)}!`}
              className="text-2xl md:text-3xl font-medium text-gray-700 mb-4"
              delay={80}
              duration={1.2}
              ease="power4.out"
              splitType="chars"
              from={{ opacity: 0, y: 80, rotationX: 90 }}
              to={{ opacity: 1, y: 0, rotationX: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              tag="h1"
              onLetterAnimationComplete={handleAnimationComplete}
            />

            <SplitText
              text="Choose your role"
              className="text-4xl md:text-5xl font-black text-gray-900 mb-8"
              delay={40}
              duration={0.8}
              ease="power3.out"
              splitType="words"
              from={{ opacity: 0, y: 40, scale: 0.8 }}
              to={{ opacity: 1, y: 0, scale: 1 }}
              threshold={0.2}
              rootMargin="-50px"
              textAlign="center"
              tag="p"
            />
            
            {/* Role Selection */}
            <div className="bg-gray-50/50 rounded-2xl px-8 py-12 mb-12 mt-16">
              <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-8 justify-center">
                <AnimatedCard onClick={() => navigate("/tenant")}>
                  <div className="group px-10 py-8 bg-white border-2 border-gray-300 rounded-xl hover:bg-black hover:border-green-400 hover:shadow-green-500/20 hover:text-white hover:scale-105 hover:-translate-y-3 transition-all duration-300 ease-out shadow-lg hover:shadow-2xl hover:shadow-black/30 cursor-pointer">
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <img src="/tenants.png" alt="Tenant" className="w-48 h-36" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">I'm a Tenant</h3>
                    <p className="text-gray-600 text-sm group-hover:text-white transition-colors duration-300">Looking for a place to stay</p>
                    <p className="text-xs text-gray-500 group-hover:text-green-400 transition-colors duration-300 mt-2">Browse verified rentals</p>
                  </div>
                </AnimatedCard>

                <AnimatedCard onClick={() => navigate("/owner")}>
                  <div className="group px-10 py-8 bg-white border-2 border-gray-300 rounded-xl hover:bg-black hover:border-green-400 hover:shadow-green-500/20 hover:text-white hover:scale-105 hover:-translate-y-3 transition-all duration-300 ease-out shadow-lg hover:shadow-2xl hover:shadow-black/30 cursor-pointer">
                    <div className="flex items-center justify-center mx-auto mb-4">
                      <img src="/owner.png" alt="Owner" className="w-48 h-36" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">I'm an Owner</h3>
                    <p className="text-gray-600 text-sm group-hover:text-white transition-colors duration-300">Listing my property for rent</p>
                    <p className="text-xs text-gray-500 group-hover:text-green-400 transition-colors duration-300 mt-2">List your property instantly</p>
                  </div>
                </AnimatedCard>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Stays Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-4 font-medium">Explore popular rental options</p>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Featured Stays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                title={property.title}
                price={property.price}
                location={property.location}
                image={property.image}
                trustScore={property.trustScore}
              />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Landing;
