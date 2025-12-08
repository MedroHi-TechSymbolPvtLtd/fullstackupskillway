import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

// Context Providers
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";

// Auth Pages
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

// Dashboard
import Dashboard from "./pages/dashboard/Dashboard";

// CMS Dashboard
import CMSDashboard from "./pages/cms/CMSDashboard";

// CRM Dashboard
import CRMDashboard from "./pages/crm/CRMDashboard";

// Content Pages
import EbookList from "./pages/content/ebooks/EbookList";
import EbookForm from "./pages/content/ebooks/EbookForm";
import EbookView from "./pages/content/ebooks/EbookView";

// Course Pages
import CourseList from "./pages/content/courses/CourseList";
import CourseForm from "./pages/content/courses/CourseForm";
import CourseView from "./pages/content/courses/CourseView";

// FAQ Pages
import FaqList from "./pages/content/faqs/FaqList";
import FaqForm from "./pages/content/faqs/FaqForm";
import FaqView from "./pages/content/faqs/FaqView";

// Video Pages
import VideoList from "./pages/content/videos/VideoList";
import VideoForm from "./pages/content/videos/VideoForm";
import VideoView from "./pages/content/videos/VideoView";

// CMS Components
import College from "./cms/components/College";
import CorporateTraining from "./cms/components/CorporateTraining";

// Testimonial Pages
import TestimonialList from "./pages/content/testimonials/TestimonialList";
import TestimonialForm from "./pages/content/testimonials/TestimonialForm";
import TestimonialView from "./pages/content/testimonials/TestimonialView";

// Refer and Earn Pages
import ReferList from "./pages/content/refer/ReferList";
import ReferForm from "./pages/content/refer/ReferForm";

// Blog Pages
import BlogList from "./pages/content/blogs/BlogList";
import BlogCreate from "./pages/content/blogs/BlogCreate";
import BlogEdit from "./pages/content/blogs/BlogEdit";
import BlogView from "./pages/content/blogs/BlogView";

// Study Abroad Pages
import StudyAbroadList from "./pages/content/study-abroad/StudyAbroadList";
import StudyAbroadCreate from "./pages/content/study-abroad/StudyAbroadCreate";
import StudyAbroadEdit from "./pages/content/study-abroad/StudyAbroadEdit";
import StudyAbroadView from "./pages/content/study-abroad/StudyAbroadView";

// Short Courses Pages
import ShortCoursesList from "./pages/content/short-courses/ShortCoursesList";
import ShortCoursesCreate from "./pages/content/short-courses/ShortCoursesCreate";
import ShortCoursesEdit from "./pages/content/short-courses/ShortCoursesEdit";
import ShortCoursesView from "./pages/content/short-courses/ShortCoursesView";

// Certified Courses Pages
import CertifiedCoursesList from "./pages/content/certified-courses/CertifiedCoursesList";
import CertifiedCoursesCreate from "./pages/content/certified-courses/CertifiedCoursesCreate";
import CertifiedCoursesEdit from "./pages/content/certified-courses/CertifiedCoursesEdit";
import CertifiedCoursesView from "./pages/content/certified-courses/CertifiedCoursesView";

// CRM Pages
import LeadList from "./pages/crm/leads/LeadList";
import LeadView from "./pages/crm/leads/LeadView";
import UserManagement from "./pages/crm/users/UserManagement";
import TrainerManagement from "./pages/crm/trainers/TrainerManagement";
import CollegeManagement from "./pages/crm/colleges/CollegeManagement";

// Trainer Booking Pages
import TrainerBookingDashboard from "./pages/crm/trainer-bookings/TrainerBookingDashboard";

// Sales Pages
import WhatsAppManager from "./components/sales/WhatsAppManager";
import EmailManager from "./components/sales/EmailManager";

// Demo Components
import LeadConversionDemo from "./components/demo/LeadConversionDemo";

// Layout Components
import DashboardLayout from "./components/layout/DashboardLayout";

// Auth Guards
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleProtectedRoute from "./components/auth/RoleProtectedRoute";
import PublicRoute from "./components/auth/PublicRoute";

// Styles
import "./App.css";

// Global error handler
import "./utils/errorHandler.js";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes - Redirect to dashboard if already logged in */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicRoute>
                      <ForgotPassword />
                    </PublicRoute>
                  }
                />

                {/* Protected Routes - Require authentication */}
                {/* Dashboard - Restricted for sales users (they get redirected to leads) */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <Dashboard />
                    </RoleProtectedRoute>
                  }
                />

                {/* CMS Dashboard Route - Restricted for sales users */}
                <Route
                  path="/dashboard/cms"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CMSDashboard />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* CRM Dashboard Route - Restricted for sales users */}
                <Route
                  path="/dashboard/crm"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CRMDashboard />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Content Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/ebooks"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <EbookList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/ebooks/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <EbookForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/ebooks/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <EbookView />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/ebooks/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <EbookForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Course Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/courses"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CourseList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/courses/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CourseForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/courses/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CourseView />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/courses/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CourseForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* FAQ Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/faqs"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <FaqList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/faqs/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <FaqForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/faqs/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <FaqView />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/faqs/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <FaqForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Video Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/videos"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <VideoList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/videos/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <VideoForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/videos/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <VideoView />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/videos/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <VideoForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* College CMS Route - Restricted for sales users */}
                <Route
                  path="/dashboard/cms/colleges"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <College />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Corporate Training CMS Route - Restricted for sales users */}
                <Route
                  path="/dashboard/cms/corporate-training"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CorporateTraining />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Testimonial Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/testimonials"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TestimonialList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/testimonials/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TestimonialForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/testimonials/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TestimonialView />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/testimonials/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TestimonialForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Refer and Earn Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/refer-earn"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <ReferList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/refer-earn/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <ReferForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/refer-earn/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <ReferForm />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Blog Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/blogs"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <BlogList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/blogs/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <BlogCreate />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/blogs/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <BlogView />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/blogs/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <BlogEdit />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Study Abroad Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/study-abroad"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <StudyAbroadList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/study-abroad/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <StudyAbroadCreate />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/study-abroad/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <StudyAbroadView />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/study-abroad/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <StudyAbroadEdit />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Short Courses Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/short-courses"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <ShortCoursesList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/short-courses/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <ShortCoursesCreate />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/short-courses/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <ShortCoursesView />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/short-courses/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <ShortCoursesEdit />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Certified Courses Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/content/certified-courses"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CertifiedCoursesList />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/certified-courses/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CertifiedCoursesCreate />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/certified-courses/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CertifiedCoursesView />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/content/certified-courses/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <CertifiedCoursesEdit />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* CRM Routes - Leads accessible to sales, others restricted */}
                {/* Leads route - accessible to all authenticated users including sales */}
                <Route
                  path="/dashboard/crm/leads"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <LeadList />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/crm/leads/:id"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <LeadView />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Lead Conversion Demo Route */}
                <Route
                  path="/dashboard/demo/lead-conversion"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <LeadConversionDemo />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Trainer Booking Dashboard - Restricted for sales users */}
                <Route
                  path="/dashboard/crm/trainer-bookings/dashboard"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TrainerBookingDashboard />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Sales Management Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/crm/users"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <UserManagement />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/crm/users/*"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <UserManagement />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* Trainer Management Routes - Restricted for sales users */}
                <Route
                  path="/dashboard/crm/trainers/create"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TrainerManagement />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/crm/trainers/:id/edit"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TrainerManagement />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/crm/trainers/:id"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TrainerManagement />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/crm/trainers"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TrainerManagement />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/crm/trainers/*"
                  element={
                    <RoleProtectedRoute allowedRoles={['admin', 'manager']}>
                      <DashboardLayout>
                        <TrainerManagement />
                      </DashboardLayout>
                    </RoleProtectedRoute>
                  }
                />

                {/* College Management Routes - Accessible to sales users */}
                <Route
                  path="/dashboard/crm/colleges"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <CollegeManagement />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/crm/colleges/*"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <CollegeManagement />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Sales Routes */}
                <Route
                  path="/dashboard/sales/whatsapp"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <WhatsAppManager />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/sales/email"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <EmailManager />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                {/* Default redirect - Check auth first */}
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>

              <Toaster
                position="top-right"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
                toastOptions={{
                  // Default options
                  duration: 4000,
                  style: {
                    background: "#363636",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    fontWeight: "500",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  },
                  // Success toast
                  success: {
                    duration: 3000,
                    style: {
                      background: "#10B981",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      boxShadow: "0 4px 12px rgba(16, 185, 129, 0.3)",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#10B981",
                    },
                  },
                  // Error toast
                  error: {
                    duration: 5000,
                    style: {
                      background: "#EF4444",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#EF4444",
                    },
                  },
                  // Warning toast
                  loading: {
                    duration: Infinity,
                    style: {
                      background: "#F59E0B",
                      color: "#fff",
                      borderRadius: "8px",
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: "500",
                      boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                    },
                    iconTheme: {
                      primary: "#fff",
                      secondary: "#F59E0B",
                    },
                  },
                }}
              />
            </div>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
