import { ArrowLeft } from "lucide-react";
import StudyAbroadForm from "../../components/forms/StudyAbroadForm";

const StudyAbroadFormWrapper = ({ record, onSave, onCancel, mode = "create" }) => {
  const isEdit = mode === "edit";

  const handleSubmit = (formData) => {
    onSave(formData, mode);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Study Abroad Destination" : "Create Study Abroad Destination"}
          </h1>
          <p className="text-gray-600">
            {isEdit ? "Update the study abroad destination information" : "Add a new study abroad destination"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <StudyAbroadForm
          initialData={record}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          isEdit={isEdit}
        />
      </div>
    </div>
  );
};

export default StudyAbroadFormWrapper;