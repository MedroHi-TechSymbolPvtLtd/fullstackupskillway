import { useState } from "react";
import VideoList from "./VideoList.jsx";
import VideoForm from "./VideoForm.jsx";
import VideoView from "./VideoView.jsx";
import toast from "react-hot-toast";
import videoService from "../services/videoService.js";

const Video = () => {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'create', 'edit', 'view'
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedVideo(null);
    setCurrentView("create");
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setCurrentView("edit");
  };

  const handleView = (video) => {
    setSelectedVideo(video);
    setCurrentView("view");
  };

  const handleSave = async (videoData, mode) => {
    try {
      if (mode === "create") {
        await videoService.createVideo(videoData);
        toast.success("Video created successfully");
      } else {
        await videoService.updateVideo(selectedVideo.id, videoData);
        toast.success("Video updated successfully");
      }
      setCurrentView("list");
      setRefreshTrigger((prev) => prev + 1); // Force list refresh
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Failed to save video");
    }
  };

  const handleBack = () => {
    setCurrentView("list");
  };

  // Render the appropriate view based on currentView state
  const renderView = () => {
    switch (currentView) {
      case "create":
      case "edit":
        return (
          <VideoForm
            video={selectedVideo}
            onSave={handleSave}
            onCancel={handleBack}
            mode={currentView}
          />
        );
      case "view":
        return <VideoView video={selectedVideo} onBack={handleBack} />;
      case "list":
      default:
        return (
          <VideoList
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
            refreshTrigger={refreshTrigger}
          />
        );
    }
  };

  return <div className="video-manager">{renderView()}</div>;
};

export default Video;
