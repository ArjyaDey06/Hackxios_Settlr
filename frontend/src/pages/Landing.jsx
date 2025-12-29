import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SplitText from "../components/SplitText";

const handleAnimationComplete = () => {
  console.log('Welcome text animation completed!');
};

function Landing() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center flex flex-col items-center justify-center">
            <SplitText
              text={`Welcome back, ${user?.name}!`}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              delay={50}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
              tag="h1"
              onLetterAnimationComplete={handleAnimationComplete}
            />

            <SplitText
              text="Choose your role to get started with Settlr"
              className="text-xl text-gray-600 mb-8"
              delay={30}
              duration={0.6}
              ease="power2.out"
              splitType="words"
              from={{ opacity: 0, y: 30 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.2}
              rootMargin="-50px"
              textAlign="center"
              tag="p"
            />
            
            {/* Role Selection */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12 mt-16">
              <button 
                onClick={() => navigate("/tenant")}
                className="group px-8 py-6 bg-white border-2 border-gray-300 rounded-xl hover:bg-black hover:border-[#26f50c] hover:text-white hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center justify-center mx-auto mb-4">
                  <img src="/tenants.png" alt="Tenant" className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-semibold mb-2">I'm a Tenant</h3>
                <p className="text-gray-600 text-sm group-hover:text-white">Looking for a place to stay</p>
              </button>

              <button 
                onClick={() => navigate("/owner")}
                className="group px-8 py-6 bg-white border-2 border-gray-300 rounded-xl hover:bg-black hover:border-[#26f50c] hover:text-white hover:scale-105 transition-all duration-200"
              >
                <div className="flex items-center justify-center mx-auto mb-4">
                  <img src="/owner.png" alt="Owner" className="w-48 h-32" />
                </div>
                <h3 className="text-xl font-semibold mb-2">I'm an Owner</h3>
                <p className="text-gray-600 text-sm group-hover:text-white">Listing my property for rent</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
