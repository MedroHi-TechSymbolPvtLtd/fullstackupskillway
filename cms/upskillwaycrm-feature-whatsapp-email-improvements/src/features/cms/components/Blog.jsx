import { useState } from "react";
import BlogList from "./BlogList.jsx";
import BlogForm from "./BlogForm.jsx";
import BlogView from "./BlogView.jsx";
import toast from "react-hot-toast";
import blogService from "../services/blogService.js";

const Blog = () => {
  const [currentView, setCurrentView] = useState("list"); // 'list', 'create', 'edit', 'view'
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateNew = () => {
    setSelectedBlog(null);
    setCurrentView("create");
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setCurrentView("edit");
  };

  const handleView = (blog) => {
    setSelectedBlog(blog);
    setCurrentView("view");
  };

  const handleSave = () => {
    setCurrentView("list");
    setSelectedBlog(null);
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh of blog list
  };

  const handleCancel = () => {
    setCurrentView("list");
    setSelectedBlog(null);
  };

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) {
      return;
    }

    try {
      await blogService.deleteBlog(blogId);
      toast.success("Blog deleted successfully");
      setCurrentView("list");
      setSelectedBlog(null);
      setRefreshTrigger((prev) => prev + 1); // Trigger refresh of blog list
    } catch (error) {
      toast.error("Failed to delete blog");
      console.error("Delete blog error:", error);
    }
  };

  const handleBack = () => {
    setCurrentView("list");
    setSelectedBlog(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "create":
        return (
          <BlogForm mode="create" onSave={handleSave} onCancel={handleCancel} />
        );

      case "edit":
        return (
          <BlogForm
            blog={selectedBlog}
            mode="edit"
            onSave={handleSave}
            onCancel={handleCancel}
          />
        );

      case "view":
        return (
          <BlogView
            blog={selectedBlog}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBack={handleBack}
          />
        );

      case "list":
      default:
        return (
          <BlogList
            key={refreshTrigger} // Force re-render when refreshTrigger changes
            onCreateNew={handleCreateNew}
            onEdit={handleEdit}
            onView={handleView}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderCurrentView()}
    </div>
  );
};

export default Blog;
