/**
 * CourseView Component
 * 
 * This component displays detailed information about a single course.
 * Features include:
 * - Course metadata display
 * - Syllabus and curriculum information
 * - Pricing and enrollment details
 * - Status indicators
 * - Action buttons (edit, delete, etc.)
 */

import { useState, useEffect } from 'react';
import { 
  Edit3, 
  Trash2, 
  ArrowLeft, 
  BookOpen, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Archive, 
  Users, 
  Play 
} from 'lucide-react';
import 'react-hot-toast';
import { Edit } from "lucide-react";
import courseService from "../services/courseService.js";

const CourseView = ({ course: initialCourse, onBack, onEdit }) => {
  const [course, setCourse] = useState(initialCourse);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch full course details if needed
  useEffect(() => {
    const fetchCourseDetails = async () => {
      // If we already have complete course data, no need to fetch
      if (initialCourse && initialCourse.description) {
        return;
      }
      
      if (!initialCourse || !initialCourse.id) {
        setError("No course selected");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        const courseData = await courseService.getCourseById(initialCourse.id);
        setCourse(courseData);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [initialCourse]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatPrice = (price) => {
    if (price === 0 || price === "0" || price === null || price === undefined) {
      return "Free";
    }
    return `$${parseFloat(price).toFixed(2)}`;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex justify-center items-center py-8">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="py-8">
          <div className="text-center text-red-500">{error}</div>
          <div className="flex justify-center mt-4">
            <Button onClick={onBack}>Back to List</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!course) {
    return (
      <Card className="w-full">
        <CardContent className="py-8">
          <div className="text-center">No course data available</div>
          <div className="flex justify-center mt-4">
            <Button onClick={onBack}>Back to List</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Course Details</CardTitle>
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Course Image */}
        {course.imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://placehold.co/600x400?text=Course+Image";
              }}
            />
          </div>
        )}

        {/* Course Title and Status */}
        <div>
          <h2 className="text-2xl font-bold">{course.title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant={course.status === "published" ? "default" : "outline"}>
              {course.status || "Draft"}
            </Badge>
            {course.level && (
              <Badge variant="outline">{course.level}</Badge>
            )}
            {course.category && (
              <Badge variant="secondary">{course.category}</Badge>
            )}
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <h3 className="text-sm font-medium">Instructor</h3>
            <p className="mt-1">{course.instructor || "Not specified"}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Duration</h3>
            <p className="mt-1">{course.duration || "Not specified"}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Price</h3>
            <p className="mt-1">{formatPrice(course.price)}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium">Created</h3>
            <p className="mt-1">{formatDate(course.createdAt)}</p>
          </div>
        </div>

        {/* Course Description */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <div className="prose max-w-none">
            <p>{course.description || "No description available."}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onBack}>Back to List</Button>
      </CardFooter>
    </Card>
  );
};

export default CourseView;