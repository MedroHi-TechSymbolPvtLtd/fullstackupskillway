import { useState, useEffect } from 'react';
import { Save, X, Plus, MapPin, DollarSign, GraduationCap, Trash2, AlertCircle, Globe, Clock, BookOpen } from 'lucide-react';

const StudyAbroadForm = ({ 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  isEdit = false 
}) => {
  const [formData, setFormData] = useState({
    city: '',
    country: '',
    destinationType: 'city',
    imageUrl: '',
    universities: [],
    avgTuition: 0,
    livingCost: 0,
    pricePerYear: 0,
    durationMonths: 24,
    partTimeAvailable: false,
    description: '',
    tags: [],
    programs: [],
    destinationHighlights: [],
    filterOptions: {
      location: '',
      subject: '',
      duration: ''
    },
    programDetails: [],
    testimonialBlocks: [],
    faqs: [],
    status: 'published',
  });
  
  const [universityInput, setUniversityInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [programInput, setProgramInput] = useState('');
  const [newHighlight, setNewHighlight] = useState({ title: '', description: '' });
  const [newProgramDetail, setNewProgramDetail] = useState({ programType: '', durationMonths: '', tuition: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        city: initialData.city || '',
        country: initialData.country || '',
        destinationType: initialData.destinationType || 'city',
        imageUrl: initialData.imageUrl || '',
        universities: initialData.universities || [],
        avgTuition: initialData.avgTuition || 0,
        livingCost: initialData.livingCost || 0,
        pricePerYear: initialData.pricePerYear || 0,
        durationMonths: initialData.durationMonths || 24,
        partTimeAvailable: initialData.partTimeAvailable || false,
        description: initialData.description || '',
        tags: initialData.tags || [],
        programs: initialData.programs || [],
        destinationHighlights: initialData.destinationHighlights || [],
        filterOptions: initialData.filterOptions || { location: '', subject: '', duration: '' },
        programDetails: initialData.programDetails || [],
        testimonialBlocks: initialData.testimonialBlocks || [],
        faqs: initialData.faqs || [],
        status: initialData.status || 'published',
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      filterOptions: {
        ...prev.filterOptions,
        [name]: value
      }
    }));
  };

  const addUniversity = () => {
    if (universityInput.trim() && !formData.universities.includes(universityInput.trim())) {
      setFormData(prev => ({
        ...prev,
        universities: [...prev.universities, universityInput.trim()]
      }));
      setUniversityInput('');
    }
  };

  const removeUniversity = (universityToRemove) => {
    setFormData(prev => ({
      ...prev,
      universities: prev.universities.filter(university => university !== universityToRemove)
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addProgram = () => {
    if (programInput.trim() && !formData.programs.includes(programInput.trim())) {
      setFormData(prev => ({
        ...prev,
        programs: [...prev.programs, programInput.trim()]
      }));
      setProgramInput('');
    }
  };

  const removeProgram = (programToRemove) => {
    setFormData(prev => ({
      ...prev,
      programs: prev.programs.filter(program => program !== programToRemove)
    }));
  };

  const addHighlight = () => {
    if (newHighlight.title.trim() && newHighlight.description.trim()) {
      setFormData(prev => ({
        ...prev,
        destinationHighlights: [...prev.destinationHighlights, { ...newHighlight }]
      }));
      setNewHighlight({ title: '', description: '' });
    }
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      destinationHighlights: prev.destinationHighlights.filter((_, i) => i !== index)
    }));
  };

  const addProgramDetail = () => {
    if (newProgramDetail.programType.trim()) {
      setFormData(prev => ({
        ...prev,
        programDetails: [...prev.programDetails, {
          programType: newProgramDetail.programType,
          durationMonths: parseInt(newProgramDetail.durationMonths) || 0,
          tuition: parseInt(newProgramDetail.tuition) || 0
        }]
      }));
      setNewProgramDetail({ programType: '', durationMonths: '', tuition: '' });
    }
  };

  const removeProgramDetail = (index) => {
    setFormData(prev => ({
      ...prev,
      programDetails: prev.programDetails.filter((_, i) => i !== index)
    }));
  };

  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      setFormData(prev => ({
        ...prev,
        faqs: [...prev.faqs, { ...newFaq }]
      }));
      setNewFaq({ question: '', answer: '' });
    }
  };

  const removeFaq = (index) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      avgTuition: parseInt(formData.avgTuition) || 0,
      livingCost: parseInt(formData.livingCost) || 0,
      pricePerYear: parseInt(formData.pricePerYear) || 0,
      durationMonths: parseInt(formData.durationMonths) || 24,
    };
    
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Globe className="h-5 w-5 mr-2" />
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Toronto"
              required
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
              Country *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Canada"
              required
            />
          </div>

          <div>
            <label htmlFor="destinationType" className="block text-sm font-medium text-gray-700 mb-2">
              Destination Type
            </label>
            <select
              id="destinationType"
              name="destinationType"
              value={formData.destinationType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="city">City</option>
              <option value="country">Country</option>
              <option value="region">Region</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="https://images.unsplash.com/photo-..."
          />
          {formData.imageUrl && (
            <img 
              src={formData.imageUrl} 
              alt="Preview" 
              className="mt-2 w-32 h-20 object-cover rounded-lg border"
              onError={(e) => e.target.style.display = 'none'}
            />
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Study in Toronto with excellent opportunities..."
            required
          />
        </div>
      </div>

      {/* Universities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          Universities
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={universityInput}
            onChange={(e) => setUniversityInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUniversity())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="University of Toronto"
          />
          <button
            type="button"
            onClick={addUniversity}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.universities.map((university, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
            >
              {university}
              <button
                type="button"
                onClick={() => removeUniversity(university)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Financial & Duration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Financial & Duration
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avg Tuition (USD)
            </label>
            <input
              type="number"
              name="avgTuition"
              value={formData.avgTuition}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="30000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Living Cost (USD/year)
            </label>
            <input
              type="number"
              name="livingCost"
              value={formData.livingCost}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="15000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Per Year (USD)
            </label>
            <input
              type="number"
              name="pricePerYear"
              value={formData.pricePerYear}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="45000"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Months)
            </label>
            <input
              type="number"
              name="durationMonths"
              value={formData.durationMonths}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="24"
              min="0"
            />
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="partTimeAvailable"
            name="partTimeAvailable"
            checked={formData.partTimeAvailable}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="partTimeAvailable" className="ml-2 text-sm text-gray-700">
            Part-time programs available
          </label>
        </div>
      </div>

      {/* Programs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Programs</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={programInput}
            onChange={(e) => setProgramInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addProgram())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="undergraduate, postgraduate, scholarship_program"
          />
          <button
            type="button"
            onClick={addProgram}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.programs.map((program, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
            >
              {program}
              <button
                type="button"
                onClick={() => removeProgram(program)}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="canada, north-america"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Filter Options */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.filterOptions.location}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Toronto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              value={formData.filterOptions.subject}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Any"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.filterOptions.duration}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="2 Years"
            />
          </div>
        </div>
      </div>

      {/* Destination Highlights */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Destination Highlights</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={newHighlight.title}
            onChange={(e) => setNewHighlight(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Highlight title"
          />
          <textarea
            value={newHighlight.description}
            onChange={(e) => setNewHighlight(prev => ({ ...prev, description: e.target.value }))}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Highlight description"
          />
          <button
            type="button"
            onClick={addHighlight}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Highlight
          </button>
        </div>
        {formData.destinationHighlights.length > 0 && (
          <div className="space-y-2">
            {formData.destinationHighlights.map((highlight, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{highlight.title}</h4>
                    <p className="text-sm text-gray-600">{highlight.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHighlight(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Program Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Program Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            type="text"
            value={newProgramDetail.programType}
            onChange={(e) => setNewProgramDetail(prev => ({ ...prev, programType: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Program type (e.g., postgraduate)"
          />
          <input
            type="number"
            value={newProgramDetail.durationMonths}
            onChange={(e) => setNewProgramDetail(prev => ({ ...prev, durationMonths: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Duration (months)"
          />
          <input
            type="number"
            value={newProgramDetail.tuition}
            onChange={(e) => setNewProgramDetail(prev => ({ ...prev, tuition: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Tuition (USD)"
          />
        </div>
        <button
          type="button"
          onClick={addProgramDetail}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Program Detail
        </button>
        {formData.programDetails.length > 0 && (
          <div className="space-y-2">
            {formData.programDetails.map((detail, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50 flex justify-between items-center">
                <div>
                  <span className="font-medium">{detail.programType}</span> - 
                  <span className="text-sm text-gray-600"> {detail.durationMonths} months, ${detail.tuition}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeProgramDetail(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQs */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">FAQs</h3>
        <div className="space-y-2">
          <input
            type="text"
            value={newFaq.question}
            onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Question"
          />
          <textarea
            value={newFaq.answer}
            onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Answer"
          />
          <button
            type="button"
            onClick={addFaq}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </button>
        </div>
        {formData.faqs.length > 0 && (
          <div className="space-y-2">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{faq.question}</h4>
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {isEdit ? 'Update' : 'Create'} Study Abroad
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default StudyAbroadForm;
