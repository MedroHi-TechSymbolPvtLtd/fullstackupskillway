import { CheckCircle, ArrowRight } from 'lucide-react';

const CorporateProgramCard = ({ program }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      {/* Program Icon */}
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-orange-400 rounded-xl flex items-center justify-center mb-4">
        <span className="text-2xl text-white">{program.icon || '💼'}</span>
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
          Customized Training
        </li>
        <li className="flex items-center text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
          Expert Trainers
        </li>
        <li className="flex items-center text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
          Flexible Schedule
        </li>
        <li className="flex items-center text-sm text-gray-600">
          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
          ROI Focused
        </li>
      </ul>
      
      {/* Explore Button */}
      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
        Learn More
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CorporateProgramCard;
