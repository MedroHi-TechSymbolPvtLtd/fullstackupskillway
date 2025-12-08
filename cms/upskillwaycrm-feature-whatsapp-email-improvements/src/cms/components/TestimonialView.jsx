/**
 * TestimonialView Component
 * 
 * This component displays detailed information about a single testimonial.
 * Features include:
 * - Customer information display
 * - Star rating visualization
 * - Testimonial content with proper formatting
 * - Status indicators
 * - Action buttons (edit, delete, etc.)
 */

import { useState, useEffect } from 'react';
import { 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  Star, 
  User, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Archive 
} from 'lucide-react';
import 'react-hot-toast';
import testimonialService from "../services/testimonialService.js";

const TestimonialView = ({ testimonial: initialTestimonial, onBack }) => {
  const [testimonial, setTestimonial] = useState(initialTestimonial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full testimonial details if needed
  useEffect(() => {
    const fetchTestimonialDetails = async () => {
      // If we already have complete testimonial data, no need to fetch
      if (initialTestimonial && initialTestimonial.content) {
        return;
      }
      
      if (!initialTestimonial || !initialTestimonial.id) {
        setError("No testimonial selected");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const testimonialData = await testimonialService.getTestimonialById(initialTestimonial.id);
        setTestimonial(testimonialData);
      } catch (err) {
        console.error('Error fetching testimonial details:', err);
        setError('Failed to load testimonial details');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonialDetails();
  }, [initialTestimonial]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-5 w-5 ${i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
        />
      );
    }
    
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border">
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border">
        <div className="py-8">
          <div className="text-center text-red-500">{error}</div>
          <div className="flex justify-center mt-4">
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!testimonial) {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg border">
        <div className="py-8">
          <div className="text-center">No testimonial data available</div>
          <div className="flex justify-center mt-4">
            <button 
              onClick={onBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border">
      {/* Header */}
      <div className="p-6 border-b flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Testimonial Details</h2>
          <p className="text-gray-600 mt-1">View testimonial information</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Customer Info */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          {/* Avatar */}
          <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center">
            {testimonial.avatarUrl ? (
              <img 
                src={testimonial.avatarUrl} 
                alt={testimonial.name} 
                className="h-16 w-16 rounded-full object-cover" 
              />
            ) : (
              <span className="text-xl font-semibold text-gray-600">
                {getInitials(testimonial.name)}
              </span>
            )}
          </div>
          
          {/* Client Info */}
          <div>
            <h3 className="text-lg font-medium">{testimonial.name || "Anonymous"}</h3>
            {testimonial.position && testimonial.company ? (
              <p className="text-gray-600">
                {testimonial.position} at {testimonial.company}
              </p>
            ) : testimonial.company ? (
              <p className="text-gray-600">{testimonial.company}</p>
            ) : testimonial.position ? (
              <p className="text-gray-600">{testimonial.position}</p>
            ) : null}
            
            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              {renderStars(testimonial.rating || 5)}
              <span className="text-sm text-gray-600">
                ({testimonial.rating || 5}/5)
              </span>
            </div>
          </div>
        </div>
        
        {/* Quote */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <blockquote className="text-lg italic">
            "{testimonial.content || testimonial.quote || 'No testimonial content available'}"
          </blockquote>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Created: {formatDate(testimonial.createdAt)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {testimonial.status === 'published' ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : testimonial.status === 'draft' ? (
              <Clock className="h-4 w-4 text-yellow-500" />
            ) : (
              <Archive className="h-4 w-4 text-gray-500" />
            )}
            <span className="text-sm text-gray-600 capitalize">
              Status: {testimonial.status || 'draft'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Edit3 className="h-4 w-4 mr-2" />
            Edit Testimonial
          </button>
          
          <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialView;