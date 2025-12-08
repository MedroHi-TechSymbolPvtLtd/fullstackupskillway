import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Contact,
  Users,
  User,
  Phone,
  DollarSign,
  Activity,
  Database,
  Edit3,
  Video,
  HelpCircle,
  Download,
  BookOpen,
  Star,
  ShoppingCart,
  Folder,
  BarChart3,
  FileText,
  TrendingUp,
  Globe,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Award,
  BookMarked,
  UserPlus,
  GraduationCap,
  Calendar,
  Upload,
  Mail,
  MessageSquare,
  Building2,
  Briefcase,
  Gift,
} from "lucide-react";
import toast from "react-hot-toast";
import { authApi } from "../../services/api/authApi";
import { authUtils } from "../../services/utils/authUtils";
import { getCurrentUser, getUserRole, filterMenuItemsByRole } from "../../utils/roleUtils";
import Logo from "../../assets/images/Favicon.png";

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState({ cms: true }); // Default expand CMS
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Get user from authUtils instead of mock data
  const user = getCurrentUser() || { email: "admin@upskillway.com", name: "Admin", role: "admin" };
  const userRole = getUserRole() || "admin";

  // Auto-expand menu based on current route
  useEffect(() => {
    const path = location.pathname;
    
    // Auto-expand CRM menu if on CRM routes
    if (path.includes("/dashboard/crm")) {
      setExpandedMenus((prev) => ({
        ...prev,
        crm: true,
      }));
    }
    
    // Auto-expand CMS menu if on CMS routes
    if (path.includes("/dashboard/cms") || path.includes("/dashboard/content")) {
      setExpandedMenus((prev) => ({
        ...prev,
        cms: true,
      }));
    }
    
    // Auto-expand Sales menu if on Sales routes
    if (path.includes("/dashboard/sales")) {
      setExpandedMenus((prev) => ({
        ...prev,
        sales: true,
      }));
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("Logout attempt started");

      // Call the logout API using authApi service (which properly sends refresh token)
      const response = await authApi.logout();

      console.log("Logout API response:", response);

      if (response && response.data) {
        console.log("Logout API call successful");
        toast.success("Logged out successfully!");
      } else {
        console.warn(
          "Logout API call failed, but proceeding with local logout",
        );
        toast.warning("Logout completed locally");
      }
    } catch (error) {
      console.error("Logout API error:", error);
      toast.warning(
        "Network error during logout, but you have been logged out locally",
      );
    } finally {
      // Always clear all auth data using authUtils, regardless of API response
      console.log("Clearing all auth data and redirecting");
      authUtils.clearAuth();

      // Also clear legacy localStorage items for backward compatibility
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      setIsLoggingOut(false);

      // Navigate to login and clear history
      navigate("/login", { replace: true });

      // Clear browser history to prevent back navigation
      if (window.history.replaceState) {
        window.history.replaceState(null, null, "/login");
      }

      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }
  };

  const toggleMenu = (menuKey) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey],
    }));
  };

  // Check if user is in CRM, CMS, or Sales section
  const isInCrmCmsOrSales =
    location.pathname.includes("/dashboard/crm") ||
    location.pathname.includes("/dashboard/cms") ||
    location.pathname.includes("/dashboard/content") ||
    location.pathname.includes("/dashboard/sales");

  // Define different sales menu items based on current section and user role
  const getSalesMenuItems = () => {
    // For sales users, show leads, WhatsApp, email, and colleges (NO dashboard)
    if (userRole === 'sales') {
      return [
        {
          key: "leads",
          title: "Lead",
          icon: Users,
          path: "/dashboard/crm/leads",
        },
        {
          key: "whatsapp",
          title: "WhatsApp",
          icon: MessageSquare,
          path: "/dashboard/sales/whatsapp",
        },
        {
          key: "email",
          title: "Email",
          icon: Mail,
          path: "/dashboard/sales/email",
        },
        {
          key: "colleges",
          title: "College",
          icon: User, // Using User icon for colleges
          path: "/dashboard/crm/colleges",
        },
      ];
    }
    
    // For admin/other roles, show different items based on section
    if (isInCrmCmsOrSales) {
      return [
        {
          key: "leads",
          title: "Lead",
          icon: Users,
          path: "/dashboard/crm/leads",
        },
        {
          key: "whatsapp",
          title: "WhatsApp",
          icon: MessageSquare,
          path: "/dashboard/sales/whatsapp",
        },
        {
          key: "email",
          title: "Email",
          icon: Mail,
          path: "/dashboard/sales/email",
        },
      ];
    } else {
      return [
        {
          key: "orders",
          title: "Orders",
          icon: ShoppingCart,
          path: "/dashboard/sales/orders",
        },
        {
          key: "products",
          title: "Products",
          icon: Folder,
          path: "/dashboard/sales/products",
        },
        {
          key: "analytics",
          title: "Analytics",
          icon: BarChart3,
          path: "/dashboard/sales/analytics",
        },
        {
          key: "reports",
          title: "Reports",
          icon: FileText,
          path: "/dashboard/sales/reports",
        },
        {
          key: "performance",
          title: "Performance",
          icon: TrendingUp,
          path: "/dashboard/sales/performance",
        },
      ];
    }
  };

  // Base menu structure
  const baseSidebarMenus = [
    {
      key: "dashboard",
      title: "Dashboard",
      icon: Home,
      path: "/dashboard",
      items: [],
    },
    {
      key: "crm",
      title: "CRM",
      icon: Contact,
      items: [
        {
          key: "crm-dashboard",
          title: "CRM Dashboard",
          icon: BarChart3,
          path: "/dashboard/crm",
        },
        {
          key: "leads",
          title: "Leads",
          icon: Users,
          path: "/dashboard/crm/leads",
        },
        {
          key: "trainer-bookings-dashboard",
          title: "Booking Dashboard",
          icon: BarChart3,
          path: "/dashboard/crm/trainer-bookings/dashboard",
        },
        {
          key: "users",
          title: "Sales Management",
          icon: UserPlus,
          path: "/dashboard/crm/users",
        },
        {
          key: "colleges",
          title: "Colleges",
          icon: User,
          path: "/dashboard/crm/colleges",
        },
        {
          key: "trainers",
          title: "Trainers",
          icon: GraduationCap,
          path: "/dashboard/crm/trainers",
        },
      ],
    },
    {
      key: "cms",
      title: "CMS",
      icon: Database,
      items: [
        {
          key: "cms-dashboard",
          title: "CMS Dashboard",
          icon: BarChart3,
          path: "/dashboard/cms",
        },
        {
          key: "blogs",
          title: "Blogs",
          icon: Edit3,
          path: "/dashboard/content/blogs",
        },
        {
          key: "videos",
          title: "Coding for Kids",
          icon: Video,
          path: "/dashboard/content/videos",
        },
        {
          key: "faqs",
          title: "FAQs",
          icon: HelpCircle,
          path: "/dashboard/content/faqs",
        },
        {
          key: "ebooks",
          title: "E-books",
          icon: Download,
          path: "/dashboard/content/ebooks",
        },
        {
          key: "courses",
          title: "Courses",
          icon: BookOpen,
          path: "/dashboard/content/courses",
        },
        {
          key: "testimonials",
          title: "Testimonials",
          icon: Star,
          path: "/dashboard/content/testimonials",
        },
        {
          key: "short-courses",
          title: "Short Courses",
          icon: Award,
          path: "/dashboard/content/short-courses",
        },
        {
          key: "study-abroad",
          title: "Study Abroad",
          icon: Globe,
          path: "/dashboard/content/study-abroad",
        },
        {
          key: "certified-courses",
          title: "Certified Courses",
          icon: BookMarked,
          path: "/dashboard/content/certified-courses",
        },
        {
          key: "college-training",
          title: "College Training",
          icon: GraduationCap,
          path: "/dashboard/cms/colleges",
        },
        {
          key: "corporate-training",
          title: "Corporate Training",
          icon: Building2,
          path: "/dashboard/cms/corporate-training",
        },
        {
          key: "refer-earn",
          title: "Refer and Earn",
          icon: Gift,
          path: "/dashboard/content/refer-earn",
        },
      ],
    },
    {
      key: "sales",
      title: "SALES",
      icon: ShoppingCart,
      items: getSalesMenuItems(),
    },
  ];

  // Filter menu items based on user role
  const sidebarMenus = filterMenuItemsByRole(baseSidebarMenus, userRole);

  const isActiveRoute = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/ebooks")) return "E-books";
    if (path.includes("/blogs")) return "Blogs";
    if (path.includes("/videos")) return "Videos";
    if (path.includes("/cms/colleges")) return "College Training";
    if (path.includes("/cms/corporate-training")) return "Corporate Training";
    if (path.includes("/faqs")) return "FAQs";
    if (path.includes("/courses")) return "Courses";
    if (path.includes("/testimonials")) return "Testimonials";
    if (path.includes("/excel-upload")) return "Excel Upload";
    if (path.includes("/")) return "Dashboard";
  };

  return (
    <div className="purple-theme flex min-h-screen bg-purple-25">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } bg-white shadow-xl border-r border-purple-200 transition-all duration-300 flex-shrink-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div
              className={`flex items-center ${
                sidebarOpen ? "" : "justify-center"
              }`}
            >
              {sidebarOpen ? (
                <div className="flex items-center space-x-3">
                  <img src={Logo} alt="Upskillway Logo" className="h-8 w-8" />
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">
                      Upskillway
                    </h1>
                    <p className="text-xs text-gray-500">Admin Portal</p>
                  </div>
                </div>
              ) : (
                <img src={Logo} alt="Upskillway Logo" className="h-8 w-8" />
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
            {sidebarMenus.map((menu) => {
              const Icon = menu.icon;
              const isExpanded = expandedMenus[menu.key];
              const hasSubItems = menu.items.length > 0;
              const isActive = menu.path ? isActiveRoute(menu.path) : false;

              return (
                <div key={menu.key} className="space-y-1">
                  <button
                    onClick={() => {
                      if (hasSubItems) {
                        toggleMenu(menu.key);
                      } else if (menu.path) {
                        navigate(menu.path);
                      }
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${sidebarOpen ? "mr-3" : "mx-auto"}`}
                    />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left">{menu.title}</span>
                        {hasSubItems && (
                          <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-90" : ""
                            }`}
                          />
                        )}
                      </>
                    )}
                  </button>

                  {/* Sub-menu items */}
                  {hasSubItems && sidebarOpen && (
                    <div
                      className={`ml-4 space-y-1 transition-all duration-200 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-gray-100 ${
                        isExpanded
                          ? "max-h-[600px] opacity-100 overflow-y-auto"
                          : "max-h-0 opacity-0 overflow-hidden"
                      }`}
                    >
                      {menu.items.map((item) => {
                        const ItemIcon = item.icon;
                        const isItemActive = item.path
                          ? isActiveRoute(item.path)
                          : false;

                        return (
                          <button
                            key={item.key}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent event bubbling
                              if (item.path) {
                                navigate(item.path);
                                // Keep the menu expanded when navigating to sub-item
                                // Don't close the dropdown
                              }
                            }}
                            className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                              isItemActive
                                ? "bg-purple-100 text-purple-700 border-l-2 border-purple-500"
                                : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                            }`}
                          >
                            <ItemIcon className="h-4 w-4 mr-3" />
                            <span>{item.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-gray-200 p-4">
            <div
              className={`flex items-center ${
                sidebarOpen ? "" : "justify-center"
              }`}
            >
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </div>
              {sidebarOpen && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email || 'No email'}</p>
                  {user.role && (
                    <p className="text-xs text-purple-600 font-medium capitalize">{user.role}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-purple-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {getPageTitle()}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {user.name || 'User'}
                    </div>
                    <div className="text-gray-500 capitalize">{user.role || 'Admin'}</div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
