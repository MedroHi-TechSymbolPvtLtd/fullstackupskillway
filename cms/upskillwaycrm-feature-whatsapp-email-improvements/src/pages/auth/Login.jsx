import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Zap,
  Shield,
  Users,
  AlertCircle,
} from "lucide-react";
import { authApi } from "../../services/api/authApi";
import { authUtils } from "../../services/utils/authUtils";
import { getUserRole } from "../../utils/roleUtils";
import MOCKUP from "../../assets/images/MockUP.png";
import Logo from "../../assets/images/logo (2).png";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false); // Toggle between admin and user login

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();

  const onSubmit = async (data, event) => {
    // Prevent default form submission behavior
    if (event) {
      event.preventDefault();
    }

    try {
    
      setLoading(true);

      // Clear any previous server errors
      clearErrors();

      // Show loading toast
      const loadingToast = toast.loading(
        isAdminLogin ? "Signing in as Admin..." : "Signing you in...",
        {
          id: "login-loading",
        }
      );

      // Call login with isAdmin flag
      const response = await authApi.login(
        {
          email: data.email,
          password: data.password,
        },
        isAdminLogin // Pass isAdmin flag to determine which endpoint to use
      );

      

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response && response.data) {
        

        // Show success toast
        toast.success("Welcome back! Login successful.", {
          duration: 3000,
          icon: "🎉",
        });

        reset();

        // Log the full response structure for debugging
     

        // Extract tokens from API response - they are nested in response.data.data
        const apiResponseData = response.data.data;

        if (!apiResponseData) {
          throw new Error("Invalid response structure: missing data field");
        }

        const { accessToken, refreshToken, user } = apiResponseData;


        // Validate required tokens
        if (!accessToken) {
          throw new Error("Access token not received from server");
        }

        // Store tokens and user data using authUtils
        try {
          authUtils.setToken(accessToken);
          

          if (refreshToken) {
            authUtils.setRefreshToken(refreshToken);
            console.log("Refresh token stored using authUtils");
          }

          if (user) {
            authUtils.setUser(user);
            console.log("User data stored using authUtils");
          }

          // Also store access_token for blogService compatibility
          localStorage.setItem("access_token", accessToken);
          console.log("Access token stored in localStorage for compatibility");

          // Store basic auth info in localStorage for backward compatibility
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem(
            "user",
            JSON.stringify(user || { email: data.email }),
          );
        } catch (storageError) {
          console.error("Error storing auth data:", storageError);
          toast.error(
            "Login successful but failed to store session. Please try logging in again.",
          );
          return;
        }

        // Show additional success message with user name if available
        if (user && user.name) {
          setTimeout(() => {
            toast.success(`Welcome back, ${user.name}!`, {
              duration: 2000,
            });
          }, 500);
        }

        // Determine redirect path based on user role
        const userRole = user?.role || getUserRole();
        let redirectPath = "/dashboard";
        
        // Sales users should be redirected to leads instead of dashboard
        if (userRole === 'sales') {
          redirectPath = "/dashboard/crm/leads";
        }

        // Navigate to appropriate page and prevent going back
        navigate(redirectPath, { replace: true });
        
        // Clear browser history to prevent back navigation to login
        if (window.history.replaceState) {
          window.history.replaceState(null, null, redirectPath);
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login error:", error);

      // Dismiss any loading toast
      toast.dismiss("login-loading");

      // Always show an error message
      let errorMessage = "Login failed. Please try again.";

      // Determine the appropriate error message
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        console.log("Error status:", status);
        console.log("Error response:", responseData);
        console.log("Full error object:", error);

        // Use the error message from backend if available
        if (responseData?.message) {
          errorMessage = responseData.message;
        } else if (responseData?.error) {
          errorMessage = responseData.error;
        }

        switch (status) {
          case 401:
            // Use backend message if available, otherwise default
            if (!responseData?.message && !responseData?.error) {
              errorMessage = "Invalid email or password";
            }
            // Clear any stored auth data on authentication failure
            try {
              authUtils.clearAuth();
              localStorage.removeItem("access_token");
              localStorage.removeItem("isLoggedIn");
              localStorage.removeItem("user");
            } catch (clearError) {
              console.error("Error clearing auth data:", clearError);
            }
            break;
          case 400:
            errorMessage =
              responseData?.message ||
              responseData?.error ||
              "Invalid request. Please check your input.";
            break;
          case 403:
            errorMessage = "Access denied. Your account may be suspended.";
            break;
          case 422:
            errorMessage =
              error.response.data?.message ||
              "Please check your email and password format.";
            break;
          case 429: {
            errorMessage =
              "Too many login attempts. Please wait before trying again.";
            const retryAfter = error.response.headers["retry-after"];
            if (retryAfter) {
              errorMessage = `Too many attempts. Please wait ${retryAfter} seconds.`;
            }
            break;
          }
          case 500:
          case 502:
          case 503:
          case 504:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              error.response.data?.message || "Login failed. Please try again.";
        }
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.message === "Network Error"
      ) {
        errorMessage =
          "Network connection failed. Please check your internet connection.";
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timed out. Please try again.";
      } else {
        errorMessage =
          "Unable to connect to the server. Please try again later.";
      }

      // Always show the error toast
      toast.error(errorMessage, {
        duration: 3000,
        icon: <AlertCircle className="h-5 w-5" />,
      });

      // Handle field-specific errors for validation
      if (error.response?.status === 422 && error.response.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((field) => {
          if (field === "email" || field === "password") {
            setError(field, {
              type: "server",
              message: Array.isArray(errors[field])
                ? errors[field][0]
                : errors[field],
            });
          }
        });
      }
    } finally {
      setLoading(false);
      toast.dismiss("login-loading");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form input changes to clear server errors
  const handleInputChange = (fieldName) => {
    return () => {
      // Clear server error for this field when user starts typing
      if (errors[fieldName]?.type === "server") {
        clearErrors(fieldName);
      }
    };
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={Logo} alt="Upskillway Logo" className="h-32 w-52 -mb-12 mx-auto " />
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Hi, Welcome to Upskillway 👋
            </h1>
            <p className="text-gray-600">Login with your email address</p>
          </div>

          {/* Login Type Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsAdminLogin(false)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  !isAdminLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Sales</span>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsAdminLogin(true)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  isAdminLogin
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin</span>
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address",
                    },
                  })}
                  onChange={handleInputChange("email")}
                  className={`block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "hover:border-gray-400"
                  }`}
                  placeholder="Your email"
                />
                {errors.email && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters long",
                    },
                  })}
                  onChange={handleInputChange("password")}
                  className={`block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "hover:border-gray-400"
                  }`}
                  placeholder="Password"
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  {errors.password && (
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="pr-4 flex items-center hover:bg-gray-50 rounded-r-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Signing in...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </form>

          {/* Privacy Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              This site is protected by reCAPTCHA and the Google Privacy Policy.
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-gray-900 font-semibold hover:text-gray-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Mockup Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center ">
        <div className="relative max-w-lg w-full">
          {/* Laptop Mockup */}
          <div className="relative">
            {/* Laptop Base */}
            <div className="">
              {/* Screen */}
              <div className="">
                <img 
                  src={MOCKUP} 
                  alt="Upskillway Dashboard Mockup" 
                  className="w-[800px] h-[650px]"
                />
              </div>
            </div>
            
            {/* Laptop Screen Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-lg pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
