/**
 * CourseList Component
 *
 * This component displays a list of courses in a card-based grid layout.
 * Features include:
 * - Card-based grid layout with course thumbnails and pricing
 * - Search functionality across course titles and descriptions
 * - Status filtering (Published, Draft, Archived)
 * - Bulk operations (select and delete multiple courses)
 * - Pagination with navigation controls
 * - Responsive design for all screen sizes
 * - Loading states and error handling
 */

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  BookOpen,
  DollarSign,
  Play,
  ExternalLink,
  CheckCircle,
  Clock,
  Archive,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import "../services/courseService.js";

const CourseList = ({ courses = [], onEdit, onView, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter courses based on search term
  const filteredCourses = courses.filter((course) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      (course.title && course.title.toLowerCase().includes(searchTermLower)) ||
      (course.description &&
        course.description.toLowerCase().includes(searchTermLower)) ||
      (course.instructor &&
        course.instructor.toLowerCase().includes(searchTermLower))
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Courses Table */}
      {paginatedCourses.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Instructor</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">
                    {truncateText(course.title)}
                  </TableCell>
                  <TableCell>{course.instructor || "N/A"}</TableCell>
                  <TableCell>{course.duration || "N/A"}</TableCell>
                  <TableCell>
                    {course.price
                      ? `$${parseFloat(course.price).toFixed(2)}`
                      : "Free"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        course.status === "published" ? "default" : "outline"
                      }
                    >
                      {course.status || "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(course.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onView(course)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(course)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(course.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground mb-2">
            {searchTerm
              ? "No courses match your search"
              : "No courses available"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseList;
