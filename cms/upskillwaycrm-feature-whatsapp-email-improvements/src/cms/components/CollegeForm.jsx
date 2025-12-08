import { useState, useEffect } from 'react';
import { Save, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CollegeForm = ({ college, onSave, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    syllabus: '',
    videoDemoUrl: '',
    tags: [],
    price: '',
    status: 'draft',
    trainingType: 'college',
    cardImageUrl: '',
    durationMonths: '',
    durationHours: '',
    placementRate: '',
    successMetric: '',
    durationSummary: '',
    timelineSummary: '',
    testimonialHighlight: '',
    skills: [],
    masteredTools: [],
    curriculum: [],
    testimonials: [],
    faqs: [],
    badges: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [newTag, setNewTag] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newModule, setNewModule] = useState({ title: '', content: '', hours: '' });
  const [newTestimonial, setNewTestimonial] = useState({ studentName: '', studentRole: '', testimonialText: '', rating: 5, studentImageUrl: '' });
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [newMasteredTool, setNewMasteredTool] = useState({ name: '', url: '' });

  useEffect(() => {
    if (mode === 'edit' && college) {
      setFormData({
        title: college.title || '',
        slug: college.slug || '',
        description: college.description || '',
        syllabus: college.syllabus || '',
        videoDemoUrl: college.videoDemoUrl || '',
        tags: college.tags || [],
        price: college.price || '',
        status: college.status || 'draft',
        trainingType: 'college',
        cardImageUrl: college.cardImageUrl || '',
        durationMonths: college.durationMonths || '',
        durationHours: college.durationHours || '',
        placementRate: college.placementRate || '',
        successMetric: college.successMetric || '',
        durationSummary: college.durationSummary || '',
        timelineSummary: college.timelineSummary || '',
        testimonialHighlight: college.testimonialHighlight || '',
        skills: college.skills || [],
        masteredTools: college.masteredTools || [],
        curriculum: Array.isArray(college.curriculum) ? college.curriculum : (college.curriculum?.modules || []),
        testimonials: college.testimonials || [],
        faqs: college.faqs || [],
        badges: college.badges || []
      });
    }
  }, [college, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Tag management
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  // Badge management
  const addBadge = () => {
    if (newBadge.trim() && !formData.badges.includes(newBadge.trim())) {
      setFormData(prev => ({ ...prev, badges: [...prev.badges, newBadge.trim()] }));
      setNewBadge('');
    }
  };

  const removeBadge = (badge) => {
    setFormData(prev => ({ ...prev, badges: prev.badges.filter(b => b !== badge) }));
  };

  // Skill management
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  // Mastered Tools management
  const addMasteredTool = () => {
    if (newMasteredTool.name.trim()) {
      setFormData(prev => ({ ...prev, masteredTools: [...prev.masteredTools, { ...newMasteredTool }] }));
      setNewMasteredTool({ name: '', url: '' });
    }
  };

  const removeMasteredTool = (index) => {
    setFormData(prev => ({ ...prev, masteredTools: prev.masteredTools.filter((_, i) => i !== index) }));
  };

  // Curriculum Module management
  const addModule = () => {
    if (newModule.title.trim()) {
      setFormData(prev => ({ ...prev, curriculum: [...prev.curriculum, { ...newModule }] }));
      setNewModule({ title: '', content: '', hours: '' });
    }
  };

  const removeModule = (index) => {
    setFormData(prev => ({ ...prev, curriculum: prev.curriculum.filter((_, i) => i !== index) }));
  };

  // FAQ management
  const addFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      const faqId = formData.faqs.length + 1;
      setFormData(prev => ({ ...prev, faqs: [...prev.faqs, { id: faqId, ...newFaq }] }));
      setNewFaq({ question: '', answer: '' });
    }
  };

  const removeFaq = (index) => {
    setFormData(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== index) }));
  };

  // Testimonial management
  const addTestimonial = () => {
    if (newTestimonial.studentName.trim() && newTestimonial.testimonialText.trim()) {
      setFormData(prev => ({ ...prev, testimonials: [...prev.testimonials, { ...newTestimonial }] }));
      setNewTestimonial({ studentName: '', studentRole: '', testimonialText: '', rating: 5, studentImageUrl: '' });
    }
  };

  const removeTestimonial = (index) => {
    setFormData(prev => ({ ...prev, testimonials: prev.testimonials.filter((_, i) => i !== index) }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price) newErrors.price = 'Price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fix the errors');
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        durationMonths: formData.durationMonths ? parseInt(formData.durationMonths) : null,
        durationHours: formData.durationHours ? parseInt(formData.durationHours) : null,
        placementRate: formData.placementRate ? parseFloat(formData.placementRate) : null,
        // Ensure arrays are properly formatted
        tags: formData.tags || [],
        skills: formData.skills || [],
        badges: formData.badges || [],
        masteredTools: formData.masteredTools || [],
        curriculum: formData.curriculum || [],
        testimonials: formData.testimonials || [],
        faqs: formData.faqs || []
      };
      await onSave(dataToSend, mode);
    } catch (error) {
      toast.error('Failed to save college training program');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-lg border">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold">
          {mode === 'create' ? 'Add New College Training Program' : 'Edit College Training Program'}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.slug ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.slug && <p className="text-sm text-red-500 mt-1">{errors.slug}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Syllabus</label>
              <textarea
                name="syllabus"
                value={formData.syllabus}
                onChange={handleChange}
                rows={6}
                placeholder="Module 1: Introduction&#10;Module 2: Advanced Topics..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Demo URL</label>
                <input
                  type="url"
                  name="videoDemoUrl"
                  value={formData.videoDemoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Card Image URL</label>
                <input
                  type="url"
                  name="cardImageUrl"
                  value={formData.cardImageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Program Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Program Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (INR) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months)</label>
                <input
                  type="number"
                  name="durationMonths"
                  value={formData.durationMonths}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hours)</label>
                <input
                  type="number"
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placement Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  name="placementRate"
                  value={formData.placementRate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Success Metric</label>
                <input
                  type="text"
                  name="successMetric"
                  value={formData.successMetric}
                  onChange={handleChange}
                  placeholder="e.g., 90% completion rate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration Summary</label>
                <input
                  type="text"
                  name="durationSummary"
                  value={formData.durationSummary}
                  onChange={handleChange}
                  placeholder="e.g., 6 months"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeline Summary</label>
                <input
                  type="text"
                  name="timelineSummary"
                  value={formData.timelineSummary}
                  onChange={handleChange}
                  placeholder="e.g., Nov 2025 · 200h"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial Highlight</label>
              <textarea
                name="testimonialHighlight"
                value={formData.testimonialHighlight}
                onChange={handleChange}
                rows={3}
                placeholder="Single quote/snippet to highlight"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addSkill} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mastered Tools */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mastered Tools</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {formData.masteredTools.map((tool, index) => (
                <div key={index} className="relative p-4 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                  <button 
                    type="button" 
                    onClick={() => removeMasteredTool(index)} 
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 z-10"
                    title="Remove tool"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                      {tool.url ? (
                        <img 
                          src={tool.url} 
                          alt={tool.name} 
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = e.target.parentElement.querySelector('.image-fallback');
                            if (fallback) fallback.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="image-fallback w-full h-full flex items-center justify-center text-xs text-gray-500"
                        style={{ display: tool.url ? 'none' : 'flex' }}
                      >
                        {tool.url ? 'Failed' : 'No Image'}
                      </div>
                    </div>
                    <span className="font-medium text-sm text-center">{tool.name}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newMasteredTool.name}
                onChange={(e) => setNewMasteredTool(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tool Name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={newMasteredTool.url}
                onChange={(e) => setNewMasteredTool(prev => ({ ...prev, url: e.target.value }))}
                placeholder="Logo Image URL"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="button" onClick={addMasteredTool} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Mastered Tool
            </button>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addTag} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Badges</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.badges.map((badge, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {badge}
                  <button type="button" onClick={() => removeBadge(badge)} className="ml-2">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addBadge())}
                placeholder="Add a badge"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addBadge} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Curriculum */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Curriculum Modules</label>
            <div className="space-y-3 mb-4">
              {formData.curriculum.map((module, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{module.title}</h4>
                      {module.content && <p className="text-sm text-gray-600 mt-1">{module.content}</p>}
                      {module.hours && <p className="text-sm text-gray-500 mt-1">Hours: {module.hours}</p>}
                    </div>
                    <button type="button" onClick={() => removeModule(index)} className="text-red-600 ml-4">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={newModule.title}
                onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Module Title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newModule.content}
                onChange={(e) => setNewModule(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Module Content (optional)"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newModule.hours}
                onChange={(e) => setNewModule(prev => ({ ...prev, hours: e.target.value }))}
                placeholder="Hours (optional)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="button" onClick={addModule} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Module
            </button>
          </div>

          {/* FAQs */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">FAQs</label>
            <div className="space-y-3 mb-4">
              {formData.faqs.map((faq, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{faq.question}</h4>
                    <button type="button" onClick={() => removeFaq(index)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
                placeholder="FAQ Question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newFaq.answer}
                onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="FAQ Answer"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="button" onClick={addFaq} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </button>
          </div>

          {/* Testimonials */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Testimonials</label>
            <div className="space-y-3 mb-4">
              {formData.testimonials.map((testimonial, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        {testimonial.studentImageUrl && (
                          <img src={testimonial.studentImageUrl} alt={testimonial.studentName} className="w-12 h-12 rounded-full object-cover" />
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">{testimonial.studentName}</h4>
                          <p className="text-sm text-gray-600">{testimonial.studentRole}</p>
                          {testimonial.rating && <p className="text-sm text-yellow-600">Rating: {testimonial.rating}/5</p>}
                        </div>
                      </div>
                    </div>
                    <button type="button" onClick={() => removeTestimonial(index)} className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">{testimonial.testimonialText}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input
                type="text"
                value={newTestimonial.studentName}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, studentName: e.target.value }))}
                placeholder="Student Name"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={newTestimonial.studentRole}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, studentRole: e.target.value }))}
                placeholder="Student Role"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                min="1"
                max="5"
                value={newTestimonial.rating}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, rating: parseInt(e.target.value) || 5 }))}
                placeholder="Rating (1-5)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="url"
                value={newTestimonial.studentImageUrl}
                onChange={(e) => setNewTestimonial(prev => ({ ...prev, studentImageUrl: e.target.value }))}
                placeholder="Student Image URL (optional)"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <textarea
              value={newTestimonial.testimonialText}
              onChange={(e) => setNewTestimonial(prev => ({ ...prev, testimonialText: e.target.value }))}
              placeholder="Testimonial Text"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={addTestimonial} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </button>
          </div>
        </div>

        <div className="p-6 border-t flex justify-between">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
            <Save className="w-4 h-4 mr-2" />
            {mode === 'create' ? 'Create College Training' : 'Update College Training'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollegeForm;
