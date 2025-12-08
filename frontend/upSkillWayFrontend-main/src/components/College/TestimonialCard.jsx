import { Star } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Profile Section */}
      <div className="flex items-center mb-4">
        {testimonial.studentImageUrl ? (
          <img
            src={testimonial.studentImageUrl}
            alt={testimonial.studentName}
            className="w-16 h-16 rounded-full object-cover mr-4"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback Avatar */}
        <div
          className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 flex items-center justify-center text-white font-bold text-lg mr-4"
          style={{ display: testimonial.studentImageUrl ? 'none' : 'flex' }}
        >
          {getInitials(testimonial.studentName)}
        </div>
        
        <div className="flex-1">
          <h4 className="font-bold text-gray-900">{testimonial.studentName}</h4>
          <p className="text-sm text-gray-500">{testimonial.studentRole}</p>
          {testimonial.institutionName && (
            <p className="text-xs text-gray-400">{testimonial.institutionName}</p>
          )}
        </div>
      </div>
      
      {/* Rating */}
      <div className="flex items-center mb-3">
        {renderStars(testimonial.rating)}
      </div>
      
      {/* Testimonial Text */}
      <p className="text-gray-600 text-sm leading-relaxed italic">
        "{testimonial.testimonialText}"
      </p>
    </div>
  );
};

export default TestimonialCard;
