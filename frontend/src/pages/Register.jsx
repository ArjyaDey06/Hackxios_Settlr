import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../components/Footer";

function Register() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      setUser({
        name: result.user.displayName,
        email: result.user.email,
        uid: result.user.uid,
      });

      navigate("/landing");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Email registration logic would go here
    console.log("Email register:", fullName, email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-[#4ade80] transition-all duration-200 group"
        >
          <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-[#4ade80] mb-2">Settlr</h1>
            <p className="text-gray-600">Join our rental community today</p>
          </div>

          {/* Register Card */}
          <div className="bg-black border-2 border-[#4ade80] rounded-2xl shadow-2xl p-6">
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-white text-center mb-6">
              Create Account
            </h2>

            {/* Google Register */}
            <button
              onClick={handleGoogleRegister}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white text-black border-2 border-[#4ade80] py-3 rounded-xl hover:bg-[#4ade80] hover:text-white transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google"
                  className="w-5 h-5"
                />
              )}
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-[#4ade80]/30" />
              <span className="px-3 text-sm text-gray-400">OR</span>
              <div className="flex-1 h-px bg-[#4ade80]/30" />
            </div>

            {/* Email Register */}
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-white/10 border border-[#4ade80]/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2 bg-white/10 border border-[#4ade80]/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 bg-white/10 border border-[#4ade80]/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4ade80] focus:border-transparent transition"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 bg-white border-[#4ade80]/50 rounded focus:ring-[#4ade80]" />
                  <span className="ml-2 text-sm text-gray-400">I agree to terms</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4ade80] text-black py-3 rounded-xl hover:bg-[#4ade80]/90 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Footer */}
            <p className="text-sm text-center text-gray-400 mt-6">
              Already have an account?{" "}
              <span className="text-[#4ade80] font-medium cursor-pointer" onClick={() => navigate("/login")}>
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
