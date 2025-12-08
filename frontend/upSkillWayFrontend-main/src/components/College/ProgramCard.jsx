import { CheckCircle, ArrowRight } from 'lucide-react';

const ProgramCard = ({ program }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      {/* Program Icon/Image */}
      <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-purple-600 rounded-xl flex items-center justify-center mb-4">
        <span className="text-2xl text-white">{program.icon || '📚'}</span>
      </div>
      
      {/* Program Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
        {program.title}
      </h3>
      
      {/* Duration */}
      {program.duration && (
        <p className="text-sm text-gray-500 mb-4">{program.duration}</p>
      )}
      
      {/* Features */}
      <ul className="space-y-2 mb-6">
        <li className="flex items-center text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
          Hands-on Projects
        </li>
        <li className="flex items-center text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
          Expert Mentorship
        </li>
        <li className="flex items-center text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
          Industry Certification
        </li>
        <li className="flex items-center text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
          Placement Support
        </li>
      </ul>
      
      {/* Explore Button */}
      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
        Explore Program
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ProgramCard;
