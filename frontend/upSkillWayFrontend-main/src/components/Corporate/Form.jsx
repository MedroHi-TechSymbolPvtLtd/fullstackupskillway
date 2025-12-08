import React, { useState } from 'react';
import config from '../../config/env';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
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

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
  const response = await fetch(`${config.apiBaseUrl}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          requirement: formData.message,
          source: 'corporate-training-consultation'
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus({ type: 'success', message: 'Lead submitted successfully!' });
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error(data.message || 'Failed to submit lead');
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

  return (
    <div className="w-full max-w-[420px] mx-auto lg:mx-0">
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
          <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="upskillway"
            className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/30 rounded-none focus:ring-0 focus:border-white outline-none transition-all text-white placeholder-white/70"
            required
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="hello@upskillway.co"
            className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/30 rounded-none focus:ring-0 focus:border-white outline-none transition-all text-white placeholder-white/70"
            required
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter your message..."
            rows={3}
            className="w-full px-0 py-3 bg-transparent border-0 border-b border-white/30 rounded-none focus:ring-0 focus:border-white outline-none transition-all resize-none text-white placeholder-white/70"
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-8 bg-gradient-to-r from-orange-400 to-purple-500 text-white font-semibold rounded-full hover:shadow-lg focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mt-8"
        >
          {isSubmitting ? 'Sending...' : 'Schedule now'}
        </button>
      </form>
    </div>
  );
};

export default LeadForm;