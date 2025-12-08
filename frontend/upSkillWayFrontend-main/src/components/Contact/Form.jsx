import { useState } from 'react';
import config from '../../config/env';

const LeadForm = ({ formType = 'course' }) => {
  const [formData, setFormData] = useState({
    // Course Enquiry fields
    name: '',
    email: '',
    phone: '',
    message: '',
    
    // Corporate Enquiry fields
    fullName: '',
    organizationName: '',
    emailAddress: '',
    phoneNumber: '',
    yourMessage: ''
  });
  
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAgreed) {
      setSubmitStatus({ type: 'error', message: 'Please agree to the Terms and Conditions' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      let apiData;
      
      if (formType === 'course') {
        apiData = {
          name: formData.name,
          email: formData.email,
          organization: 'Individual',
          phone: formData.phone,
          requirement: formData.message,
          source: 'contact_page_course'
        };
      } else {
        apiData = {
          name: formData.fullName,
          email: formData.emailAddress,
          organization: formData.organizationName,
          phone: formData.phoneNumber,
          requirement: formData.yourMessage,
          source: 'contact_page_corporate'
        };
      }

  const response = await fetch(`${config.apiBaseUrl}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({ type: 'success', message: 'Enquiry submitted successfully!' });
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          fullName: '',
          organizationName: '',
          emailAddress: '',
          phoneNumber: '',
          yourMessage: ''
        });
        setIsAgreed(false);
      } else {
        throw new Error(data.message || 'Failed to submit enquiry');
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || 'Failed to submit. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Course Enquiry Form
  const renderCourseForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success/Error Message */}
      {submitStatus.message && (
        <div className={`p-4 rounded-lg ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {submitStatus.message}
        </div>
      )}
      
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
          NAME
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Enter your name"
          className="w-full px-4 py-3 border-b border-gray-300 focus:border-yellow-500 outline-none transition-all bg-transparent"
          required
        />
      </div>

      {/* Mobile Number Field */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Mobile number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter your mobile number"
          className="w-full px-4 py-3 border-b border-gray-300 focus:border-yellow-500 outline-none transition-all bg-transparent"
          required
        />
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          EMAIL
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Enter your email"
          className="w-full px-4 py-3 border-b border-gray-300 focus:border-yellow-500 outline-none transition-all bg-transparent"
          required
        />
      </div>

      {/* Message Field */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          MESSAGE
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Please type your message"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-500 outline-none transition-all resize-none"
          required
        ></textarea>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="terms"
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.target.checked)}
          className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 flex-shrink-0"
        />
        <label htmlFor="terms" className="text-sm text-gray-600 cursor-pointer">
          Agree to the <span className="text-gray-600 hover:underline cursor-pointer">Terms and Condition</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isAgreed || isSubmitting}
        className="w-full py-3 px-6 bg-[linear-gradient(90deg,#FCB11F,#5D38DE)] text-white font-medium rounded-lg hover:from-yellow-500 hover:to-purple-700 focus:ring-4 focus:ring-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isSubmitting ? 'Sending...' : 'Send a Message'}
      </button>
    </form>
  );

  // Corporate Enquiry Form
  const renderCorporateForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success/Error Message */}
      {submitStatus.message && (
        <div className={`p-4 rounded-lg ${
          submitStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {submitStatus.message}
        </div>
      )}
      
      {/* Full Name Field */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="w-full px-0 py-3 border-b border-gray-300 focus:border-orange-500 outline-none transition-all bg-transparent"
          required
        />
      </div>

      {/* Organisation Name Field */}
      <div>
        <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-2">
          Organisation Name *
        </label>
        <input
          type="text"
          id="organizationName"
          name="organizationName"
          value={formData.organizationName}
          onChange={handleInputChange}
          className="w-full px-0 py-3 border-b border-gray-300 focus:border-orange-500 outline-none transition-all bg-transparent"
          required
        />
      </div>

      {/* Email Address Field */}
      <div>
        <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="emailAddress"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleInputChange}
          className="w-full px-0 py-3 border-b border-gray-300 focus:border-orange-500 outline-none transition-all bg-transparent"
          required
        />
      </div>

      {/* Phone Number Field */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
          <span className="inline-flex items-center">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">IN ▼</span>
            +91 | Enter your phone number *
          </span>
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          className="w-full px-0 py-3 border-b border-gray-300 focus:border-orange-500 outline-none transition-all bg-transparent"
          required
        />
      </div>

      {/* Your Message Field */}
      <div>
        <label htmlFor="yourMessage" className="block text-sm font-medium text-gray-700 mb-2">
          Your message *
        </label>
        <textarea
          id="yourMessage"
          name="yourMessage"
          value={formData.yourMessage}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 outline-none transition-all resize-none"
          required
        ></textarea>
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id="corporateTerms"
          checked={isAgreed}
          onChange={(e) => setIsAgreed(e.target.checked)}
          className="mt-1 w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2 flex-shrink-0"
        />
        <label htmlFor="corporateTerms" className="text-sm text-gray-600 cursor-pointer">
          Agree to the <span className="text-gray-600 hover:underline cursor-pointer">Terms and Condition</span>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isAgreed || isSubmitting}
        className="w-full py-3 px-6 bg-orange-400 text-white font-medium rounded-lg hover:bg-orange-500 focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );

  return (
    <div className="w-full">
      {formType === 'course' ? renderCourseForm() : renderCorporateForm()}
    </div>
  );
};

export default LeadForm;