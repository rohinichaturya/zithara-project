import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import IMG from "../Assests/login.webp";
import Topbar from "../Components/Layout/Topbar";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Common/Footer";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      const loggedInUser = resultAction.payload;

      toast.success("Login successful! Redirecting...");

      setTimeout(() => {
        if (loggedInUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 2000);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100">
      <Topbar />
      <Navbar />
      <div className="flex items-center justify-center py-12 px-4 pt-28">
        <div className="bg-white shadow-xl rounded-xl overflow-hidden flex max-w-4xl w-full transition-all duration-300 hover:shadow-lg">
          {/* Left Side - Image (Reduced height) */}
          <div className="hidden md:block md:w-1/2 relative h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
            <img 
              src={IMG} 
              alt="Luxury Jewelry" 
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Right Side - Login Form (More compact) */}
          <div className="w-full md:w-1/2 p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h2>
              <p className="text-gray-500 text-sm">Sign in to access your account</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div className="space-y-1">
                <label className="text-gray-700 text-sm font-medium block">Email Address</label>
                <input
                  type="email"
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-gray-700 text-sm font-medium block">Password</label>
                  <Link 
                    to="/forgot-password" 
                    className="text-xs text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  type="password"
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                className={`w-full py-2.5 px-4 rounded-lg font-medium text-white transition-all duration-300 text-sm
                  ${loading ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}
                  shadow hover:shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50
                  ${isHovered && !loading ? 'shadow-md' : ''}`}
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <p className="text-gray-500 text-center text-sm mt-6">
              Don't have an account?{" "}
              <Link 
                to="/signup" 
                className="text-blue-500 font-medium hover:text-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;