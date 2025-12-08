import { useNavigate } from "react-router-dom";
import StudyAbroadList from "../../../cms/components/StudyAbroadList";

const StudyAbroadListPage = () => {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate("/dashboard/content/study-abroad/create");
  };

  const handleEdit = (record) => {
    navigate(`/dashboard/content/study-abroad/${record.id}/edit`);
  };

  const handleView = (record) => {
    navigate(`/dashboard/content/study-abroad/${record.id}`);
  };

  return (
    <StudyAbroadList
      onCreateNew={handleCreateNew}
      onEdit={handleEdit}
      onView={handleView}
    />
  );
};

export default StudyAbroadListPage;
