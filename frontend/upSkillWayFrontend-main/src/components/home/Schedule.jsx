import { useState } from "react";
import config from '../../config/env';
import Request from "../../assets/Images/Request.png";

const ScheduleDemoSection = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    yearOfGraduation: "",
    workExperience: "",
    program: "",
  });

  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState("");

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      // Prepare data for API (matching the required format)
      const apiData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: `+91${formData.phone}`,
        requirement: `Program: ${
          formData.program || "Not specified"
        }, Experience: ${
          formData.workExperience || "Not specified"
        }, Graduation: ${formData.yearOfGraduation || "Not specified"}`,
        source: "website",
      };

  const response = await fetch(`${config.apiBaseUrl}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus("success");
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          yearOfGraduation: "",
          workExperience: "",
          program: "",
        });
      } else {
        setSubmitStatus("error");
        setErrorMessage(data.message || "Failed to submit lead");
      }
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again.");
      console.error("Error submitting lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-white -mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Illustration Section */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <img
              src={Request}
              alt="Request a Callback Illustration"
              className="w-[479px] h-[319px]"
            />
          </div>
          <div className="h-0.5 bg-yellow-400 -mt-10 w-full"></div>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === "success" && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Success!</span> Your request has
                been submitted successfully. We'll contact you soon!
              </div>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="max-w-4xl mx-auto mb-6">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-medium">Error:</span> {errorMessage}
              </div>
            </div>
          </div>
        )}

        {/* Form Section */}
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Two Column Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Your First Name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400 text-gray-800 bg-gray-50 placeholder-gray-500 text-sm"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400 text-gray-800 bg-gray-50 placeholder-gray-500 text-sm"
                  />
                </div>

                {/* Year of Graduation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year of Graduation
                  </label>
                  <select
                    name="yearOfGraduation"
                    value={formData.yearOfGraduation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400 text-gray-800 bg-gray-50 text-sm"
                  >
                    <option value="">Select year of graduation</option>
                    <option value="2020">2020</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Your Last Name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400 text-gray-800 bg-gray-50 placeholder-gray-500 text-sm"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value="+91"
                      readOnly
                      className="w-16 px-3 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-sm font-medium"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter Contact number"
                      required
                      pattern="[0-9]{10}"
                      maxLength="10"
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400 text-gray-800 bg-gray-50 placeholder-gray-500 text-sm"
                    />
                  </div>
                </div>

                {/* Work Experience */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Experience
                  </label>
                  <select
                    name="workExperience"
                    value={formData.workExperience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400 text-gray-800 bg-gray-50 text-sm"
                  >
                    <option value="">Select work experience</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5+ years">5+ years</option>
                  </select>
                </div>

                {/* Program Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Program
                  </label>
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-orange-400 text-gray-800 bg-gray-50 text-sm"
                  >
                    <option value="">Select Program</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Business Analytics">
                      Business Analytics
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-[298px] h-[49px] text-white px-12 py-4 rounded-3xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#FDB11F] hover:bg-[#FDB11F]"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  "Request a Callback"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ScheduleDemoSection;
