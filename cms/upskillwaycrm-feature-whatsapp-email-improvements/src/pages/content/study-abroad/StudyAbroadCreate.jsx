import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudyAbroadForm from "../../../components/forms/StudyAbroadForm";
import studyAbroadService from "../../../cms/services/studyAbroadService";
import toast from "react-hot-toast";

const StudyAbroadCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await studyAbroadService.createStudyAbroad(formData);
      toast.success("Study abroad destination created successfully");
      navigate("/dashboard/content/study-abroad");
    } catch (error) {
      console.error("Error creating study abroad record:", error);
      toast.error("Failed to create study abroad destination");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/content/study-abroad");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Create Study Abroad Destination
        </h1>
        <p className="text-gray-600 mt-2">
          Add a new study abroad destination to your catalog
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <StudyAbroadForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default StudyAbroadCreate;
