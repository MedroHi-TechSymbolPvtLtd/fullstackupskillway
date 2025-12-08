import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  X,
  Plus,
  Trash2,
  ArrowLeft,
  AlertCircle,
  Users,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import referService from "../../../cms/services/referService";

const ReferForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    websiteUrl: "",
    testimonial: "",
    quote: "",
    faqs: [],
    rating: 5,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [errors, setErrors] = useState({});
  const [newFaq, setNewFaq] = useState({ question: "", answer: "" });

  const fetchPartnerData = useCallback(async () => {
    try {
      setFetchLoading(true);
      const response = await referService.getPartnerById(id);

      if (response.success && response.data) {
        const partner = response.data;
        setFormData({
          name: partner.name || "",
          logoUrl: partner.logoUrl || "",
          websiteUrl: partner.websiteUrl || "",
          testimonial: partner.testimonial || "",
          quote: partner.quote || "",
          faqs: partner.faqs || [],
          rating: partner.rating || 5,
          isActive: partner.isActive !== undefined ? partner.isActive : true,
        });
      } else {
        throw new Error(response.message || "Partner not found");
      }
    } catch (err) {
      console.error("Error fetching partner:", err);
      toast.error(err.message || "Failed to load partner data");
      navigate("/dashboard/content/refer-earn");
    } finally {
      setFetchLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isEditMode && id) {
      fetchPartnerData();
    }
  }, [id, isEditMode, fetchPartnerData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const addFaq = (e) => {
    e.preventDefault();

    const { question, answer } = newFaq;

    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!answer.trim()) {
      toast.error("Please enter an answer");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      faqs: [
        ...prev.faqs,
        { question: question.trim(), answer: answer.trim() },
      ],
    }));

    setNewFaq({ question: "", answer: "" });
  };

  const removeFaq = (index) => {
    setFormData((prev) => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Partner name is required";
    }

    if (!formData.logoUrl.trim()) {
      newErrors.logoUrl = "Logo URL is required";
    }

    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = "Website URL is required";
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);

      const partnerData = {
        ...formData,
        rating: parseFloat(formData.rating),
      };

      console.log("Submitting partner data:", partnerData);

      let response;

      if (isEditMode) {
        response = await referService.updatePartner(id, partnerData);
      } else {
        response = await referService.createPartner(partnerData);
      }

      if (response.success) {
        const action = isEditMode ? "updated" : "created";
        toast.success(`Partner ${action} successfully!`);
        navigate("/dashboard/content/refer-earn");
      } else {
        throw new Error(
          response.message ||
            `Failed to ${isEditMode ? "update" : "create"} partner`,
        );
      }
    } catch (err) {
      console.error("Error saving partner:", err);
      toast.error(
        err.message || `Failed to ${isEditMode ? "update" : "create"} partner`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/content/refer-earn");
  };

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading partner data...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Partners
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? "Edit Partner" : "Add New Partner"}
            </h1>
            <p className="text-gray-600">
              {isEditMode
                ? "Update partner information"
                : "Add a new referral partner"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Partner Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Partner Name *
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Tech Solutions Inc"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Website URL *
                </label>
                <input
                  name="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  placeholder="https://techsolutions.com"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.websiteUrl ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.websiteUrl && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.websiteUrl}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Logo URL *
              </label>
              <input
                name="logoUrl"
                type="url"
                value={formData.logoUrl}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.logoUrl ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.logoUrl && (
                <p className="text-sm text-red-500 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.logoUrl}
                </p>
              )}
              {formData.logoUrl && (
                <div className="mt-2">
                  <img
                    src={formData.logoUrl}
                    alt="Logo preview"
                    className="w-32 h-32 object-contain border rounded-lg"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Star className="h-4 w-4 mr-1 text-yellow-500" />
                  Rating (0-5)
                </label>
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.rating ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.rating && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.rating}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active Partner</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Testimonial
              </label>
              <textarea
                name="testimonial"
                value={formData.testimonial}
                onChange={handleChange}
                placeholder="Great partnership with UpSkillWay!"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Quote
              </label>
              <input
                name="quote"
                type="text"
                value={formData.quote}
                onChange={handleChange}
                placeholder="Best training platform!"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* FAQs Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Frequently Asked Questions
            </h3>

            <div className="space-y-2">
              <input
                type="text"
                value={newFaq.question}
                onChange={(e) =>
                  setNewFaq((prev) => ({ ...prev, question: e.target.value }))
                }
                placeholder="Question"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newFaq.answer}
                onChange={(e) =>
                  setNewFaq((prev) => ({ ...prev, answer: e.target.value }))
                }
                placeholder="Answer"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="button"
              onClick={addFaq}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add FAQ
            </button>

            {formData.faqs.length > 0 && (
              <div className="space-y-3">
                {formData.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">
                        {faq.question}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading && (
                <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <Save className="h-4 w-4 mr-2" />
              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Partner"
                : "Create Partner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferForm;
