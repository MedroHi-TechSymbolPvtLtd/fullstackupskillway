import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Phone,
  Mail,
  Building,
  Calendar,
  User,
  Users,
  BarChart3,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  FileSpreadsheet,
  Download,
  History,
  X,
  RefreshCw,
} from "lucide-react";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import leadsApi from "../../../services/api/leadsApi";
import crmService from "../../../services/crmService";
import toastUtils from "../../../utils/toastUtils";
import LeadStatusUpdate from "../../../components/crm/LeadStatusUpdate";
import DeleteConfirmationModal from "../../../components/common/DeleteConfirmationModal";
import LeadFunnelStats from "../../../components/crm/LeadFunnelStats";
import excelUploadApi from "../../../services/api/excelUploadApi";
import toast from "react-hot-toast";

const LeadList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  
  const [showFunnelStats, setShowFunnelStats] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  // Excel upload functionality state
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [showUploadHistory, setShowUploadHistory] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showValidation, setShowValidation] = useState(false);
  const [uploadOptions, setUploadOptions] = useState({
    skipDuplicates: true,
    updateExisting: false,
    validateEmails: true,
    validatePhones: true,
    maxRows: 1000,
  });
  const [uploadHistory, setUploadHistory] = useState([]);
  const [uploadStats, setUploadStats] = useState(null);

  // Delete confirmation modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    item: null,
    isLoading: false,
  });

  // Define mock data functions BEFORE fetchLeads uses them
  const getMockLeadsData = () => {
    return [
      {
        id: "mock-1",
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1234567890",
        organization: "Tech Corp",
        requirement: "Need React training",
        source: "Website",
        stage: "START",
        status: "ACTIVE",
        priority: "HIGH",
        value: 5000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "mock-2",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        phone: "+1234567891",
        organization: "Design Inc",
        requirement: "UI/UX workshop",
        source: "Email",
        stage: "IN_CONVERSATION",
        status: "ACTIVE",
        priority: "MEDIUM",
        value: 3000,
        createdAt: new Date().toISOString(),
      },
    ];
  };

  const getMockLeadsForStage = (stage) => {
    const allLeads = getMockLeadsData();
    return allLeads.filter((lead) => lead.stage === stage);
  };

  // Define fetchLeads with useCallback BEFORE it's used in useEffect hooks
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);

      let response;
      if (stageFilter) {
        // Use stage-specific API when stage filter is applied
        const params = {
          page: currentPage,
          limit: 10,
          ...(searchTerm && { search: searchTerm }),
          ...(sourceFilter && { source: sourceFilter }),
        };
        try {
          response = await leadsApi.getLeadsByStage(stageFilter, params);
        } catch (error) {
          console.warn(
            `Error fetching leads for stage ${stageFilter}, using mock data:`,
            error.message,
          );
          response = {
            success: true,
            data: getMockLeadsForStage(stageFilter),
            pagination: { total: 5, totalPages: 1, currentPage: 1 },
          };
        }
      } else {
        // Use general leads API
        const params = {
          page: currentPage,
          limit: 10,
          ...(searchTerm && { search: searchTerm }),
          ...(sourceFilter && { source: sourceFilter }),
        };
        try {
          response = await leadsApi.getAllLeads(params);
        } catch (error) {
          console.warn(
            "Error fetching all leads, using mock data:",
            error.message,
          );
          response = {
            success: true,
            data: getMockLeadsData(),
            pagination: { total: 5, totalPages: 1, currentPage: 1 },
          };
        }
      }

      if (response.success) {
        setLeads(response.data);
        setPagination(response.pagination);
      } else {
        console.warn("API returned unsuccessful response, using mock data");
        setLeads(getMockLeadsData());
        setPagination({ total: 5, totalPages: 1, currentPage: 1 });
      }
    } catch (error) {
      console.warn("Error fetching leads, using mock data:", error.message);
      setLeads(getMockLeadsData());
      setPagination({ total: 5, totalPages: 1, currentPage: 1 });
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, sourceFilter, stageFilter]);

  useEffect(() => {
    // Debounce the fetchLeads call to prevent rapid API calls
    const timeoutId = setTimeout(() => {
      fetchLeads();
    }, 300); // Wait 300ms after the last change

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, sourceFilter, stageFilter, fetchLeads]);

  // Listen for Excel upload completion and website lead creation to refresh leads
  useEffect(() => {
    const handleLeadsUpdated = (event) => {
      console.log("Leads updated event received:", event.detail);
      const source = event.detail?.source || 'unknown';
      const insertedRows = event.detail?.insertedRows || 0;
      const updatedRows = event.detail?.updatedRows || 0;
      
      // Refresh the leads list
      fetchLeads();
      
      // Show appropriate message based on source
      if (source === 'excel_upload') {
        if (insertedRows > 0 || updatedRows > 0) {
          toastUtils.success(`Leads list refreshed! ${insertedRows} new leads added, ${updatedRows} updated.`);
        } else {
          toastUtils.info("Leads list refreshed with new Excel upload data!");
        }
      } else if (source === 'website' || source === 'api') {
        toastUtils.success("New lead detected! Refreshing leads list...");
      } else {
        toastUtils.success("Leads list refreshed!");
      }
    };

    window.addEventListener("leadsUpdated", handleLeadsUpdated);
    window.addEventListener("newLeadCreated", handleLeadsUpdated); // For website leads

    return () => {
      window.removeEventListener("leadsUpdated", handleLeadsUpdated);
      window.removeEventListener("newLeadCreated", handleLeadsUpdated);
    };
  }, [fetchLeads]);

  // Auto-refresh leads every 30 seconds for real-time updates
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Only auto-refresh if not actively filtering/searching and page is visible
      if (!searchTerm && !sourceFilter && !stageFilter && document.visibilityState === 'visible') {
        console.log("🔄 Auto-refreshing leads list...");
        fetchLeads();
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [searchTerm, sourceFilter, stageFilter, fetchLeads]);

  // Function to process leads that have CONVERT stage but haven't been converted yet
  const processUnconvertedLeads = async () => {
    try {
      console.log("🔄 Processing unconverted leads...");

      // Find leads with CONVERT stage but no linkedCollegeId
      const unconvertedLeads = leads.filter(
        (lead) => lead.stage === "CONVERT" && !lead.linkedCollegeId,
      );

      if (unconvertedLeads.length === 0) {
        toastUtils.info("No unconverted leads found.");
        return;
      }

      console.log(
        `Found ${unconvertedLeads.length} unconverted leads:`,
        unconvertedLeads,
      );

      // Process each unconverted lead
      for (const lead of unconvertedLeads) {
        try {
          console.log(`🔄 Converting lead ${lead.id}: ${lead.name}`);

          const conversionResult = await crmService.updateLeadStatus(
            lead.id,
            "converted",
          );

          if (
            conversionResult.success &&
            conversionResult.conversionResult?.success
          ) {
            const { isNewCollege, college } = conversionResult.conversionResult;
            const message = isNewCollege
              ? `✅ Created college "${college.name}" for lead "${lead.name}"`
              : `✅ Linked lead "${lead.name}" to existing college "${college.name}"`;
            toastUtils.success(message);
          } else {
            console.warn(
              `⚠️ Conversion failed for lead ${lead.id}:`,
              conversionResult,
            );
          }
        } catch (error) {
          console.error(`❌ Error converting lead ${lead.id}:`, error);
          toastUtils.error(
            `Failed to convert lead "${lead.name}": ${error.message}`,
          );
        }
      }

      // Refresh the leads list to show updated status
      await fetchLeads();

      toastUtils.success(
        `Processed ${unconvertedLeads.length} unconverted leads!`,
      );
    } catch (error) {
      console.error("❌ Error processing unconverted leads:", error);
      toastUtils.error(`Error processing leads: ${error.message}`);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSourceFilter = (e) => {
    setSourceFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStageFilter = (e) => {
    setStageFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStageClick = (stage) => {
    setStageFilter(stage);
    setCurrentPage(1);
  };

  const handleViewLead = (leadId) => {
    navigate(`/dashboard/crm/leads/${leadId}`);
  };

  const handleStatusUpdate = (lead) => {
    setSelectedLead(lead);
    setShowStatusUpdate(true);
  };

  const handleStatusUpdateComplete = (updatedLead) => {
    setLeads(
      leads.map((lead) => (lead.id === updatedLead.id ? updatedLead : lead)),
    );
    setShowStatusUpdate(false);
    setSelectedLead(null);
  };

  const handleCloseStatusUpdate = () => {
    setShowStatusUpdate(false);
    setSelectedLead(null);
  };

  const handleDeleteLead = (lead) => {
    // Show delete confirmation modal
    setDeleteModal({
      isOpen: true,
      item: lead,
      isLoading: false,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setDeleteModal((prev) => ({ ...prev, isLoading: true }));

      const response = await leadsApi.deleteLead(deleteModal.item.id);

      if (response.success) {
        toastUtils.crud.deleted("Lead");
        fetchLeads();
        setDeleteModal({ isOpen: false, item: null, isLoading: false });
      } else {
        throw new Error(response.message || "Failed to delete lead");
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toastUtils.crud.deleteError("Lead", error.message);
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, item: null, isLoading: false });
  };

  // Excel upload handlers
  const handleExcelUpload = () => {
    setShowExcelUpload(true);
    setShowUploadHistory(false);
    fetchUploadStats();
  };

  const handleUploadHistory = () => {
    setShowUploadHistory(true);
    setShowExcelUpload(false);
    fetchUploadHistory();
  };

  const fetchUploadStats = async () => {
    try {
      const response = await excelUploadApi.getUploadStats();
      if (response.success) {
        setUploadStats(response.data);
      }
    } catch (error) {
      console.error("Error fetching upload stats:", error);
    }
  };

  const fetchUploadHistory = async () => {
    try {
      const response = await excelUploadApi.getUploadHistory({
        page: 1,
        limit: 10,
      });
      if (response.success) {
        setUploadHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching upload history:", error);
    }
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadResult(null);
    setValidationResult(null);
    toast.success(`File selected: ${file.name}`);
  };

  const handleValidate = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsValidating(true);
    setShowValidation(true);

    try {
      const result = await excelUploadApi.validateExcelFile(selectedFile);
      setValidationResult(result);

      if (result.success) {
        if (result.data.isValid) {
          toast.success("File validation passed!");
        } else {
          toast.warning(
            `File validation completed with ${result.data.errors.length} errors`,
          );
        }
      } else {
        toast.error("File validation failed");
      }
    } catch (error) {
      console.error("Validation error:", error);
      toast.error("Failed to validate file");
    } finally {
      setIsValidating(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);

    try {
      const result = await excelUploadApi.uploadExcelFile(
        selectedFile,
        uploadOptions,
      );
      setUploadResult(result);

      if (result.success) {
        toast.success("File uploaded and processed successfully!");
        
        // Dispatch event to notify all components
        window.dispatchEvent(new CustomEvent('leadsUpdated', {
          detail: {
            source: 'excel_upload',
            result: result,
            insertedRows: result.data?.insertedRows || 0,
            updatedRows: result.data?.updatedRows || 0
          }
        }));
        
        fetchLeads(); // Refresh leads list
        fetchUploadStats(); // Refresh stats
        fetchUploadHistory(); // Refresh history
      } else {
        toast.error("File upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await excelUploadApi.downloadTemplateFile();
      toast.success("Template downloaded successfully!");
    } catch (error) {
      console.error("Template download error:", error);
      toast.error("Failed to download template");
    }
  };

  const handleOptionChange = (option, value) => {
    setUploadOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setValidationResult(null);
    setShowValidation(false);
  };

  const closeExcelUpload = () => {
    setShowExcelUpload(false);
    setShowUploadHistory(false);
    resetUploadForm();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const stageConfig = {
    START: { label: "Start", color: "bg-blue-100 text-blue-800", icon: Clock },
    IN_CONVERSATION: {
      label: "In Conversation",
      color: "bg-purple-100 text-purple-800",
      icon: Users,
    },
    EMAIL_WHATSAPP: {
      label: "Email/WhatsApp",
      color: "bg-green-100 text-green-800",
      icon: Clock,
    },
    IN_PROGRESS: {
      label: "In Progress",
      color: "bg-orange-100 text-orange-800",
      icon: Clock,
    },
    CONVERT: {
      label: "Convert",
      color: "bg-green-100 text-green-800",
      icon: CheckCircle,
    },
    DENIED: {
      label: "Denied",
      color: "bg-red-100 text-red-800",
      icon: AlertCircle,
    },
  };

  const priorityConfig = {
    LOW: { label: "Low", color: "bg-gray-100 text-gray-800" },
    MEDIUM: { label: "Medium", color: "bg-yellow-100 text-yellow-800" },
    HIGH: { label: "High", color: "bg-orange-100 text-orange-800" },
    URGENT: { label: "Urgent", color: "bg-red-100 text-red-800" },
  };

  const getSourceBadge = (source) => {
    const sourceConfig = {
      website: { bg: "bg-blue-100", text: "text-blue-800", label: "Website" },
      referral: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Referral",
      },
      social: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Social Media",
      },
      email: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Email" },
      phone: { bg: "bg-red-100", text: "text-red-800", label: "Phone" },
    };

    const config = sourceConfig[source] || sourceConfig.website;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const getStageBadge = (stage) => {
    const config = stageConfig[stage] || stageConfig.START;
    const StageIcon = config.icon || Clock;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <StageIcon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const config = priorityConfig[priority] || priorityConfig.MEDIUM;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-2">
            Manage your sales leads and prospects
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLeads}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            title="Refresh leads list"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => setShowFunnelStats(!showFunnelStats)}
            className={`inline-flex items-center px-4 py-2 rounded-lg ${
              showFunnelStats
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {showFunnelStats ? "Hide Analytics" : "Show Analytics"}
          </button>
          <button
            onClick={handleExcelUpload}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Excel Upload
          </button>
          <button
            onClick={handleUploadHistory}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <History className="h-4 w-4 mr-2" />
            Upload History
          </button>
          <button
            onClick={processUnconvertedLeads}
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            title="Process leads with CONVERT stage that haven't been converted yet"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Process Conversions
          </button>
          <button
            onClick={() => navigate("/dashboard/crm/leads/create")}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Funnel Analytics */}
      {showFunnelStats && <LeadFunnelStats onStageClick={handleStageClick} />}

      {/* Excel Upload Section */}
      {showExcelUpload && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Upload className="h-5 w-5 mr-2 text-green-600" />
              Excel Lead Upload
            </h2>
            <button
              onClick={closeExcelUpload}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Upload Statistics */}
          {uploadStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-6 w-6 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Total Uploads
                    </p>
                    <p className="text-lg font-bold text-blue-900">
                      {uploadStats.totalUploads}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Leads Created
                    </p>
                    <p className="text-lg font-bold text-green-900">
                      {uploadStats.totalLeadsCreated}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-yellow-600 mr-2" />
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">
                      Leads Updated
                    </p>
                    <p className="text-lg font-bold text-yellow-900">
                      {uploadStats.totalLeadsUpdated}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-6 w-6 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Success Rate
                    </p>
                    <p className="text-lg font-bold text-purple-900">
                      {uploadStats.averageSuccessRate}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* File Upload Area */}
          <div className="mb-6">
            <div
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".xlsx,.xls";
                input.onchange = (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    handleFileSelect(file);
                  }
                };
                input.click();
              }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div>
                <p className="text-gray-600 mb-2">
                  Click to select an Excel file
                </p>
                <p className="text-sm text-gray-500">
                  Supports .xlsx and .xls files up to 10MB
                </p>
              </div>
            </div>

            {selectedFile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetUploadForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Upload Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upload Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="skipDuplicates"
                  checked={uploadOptions.skipDuplicates}
                  onChange={(e) =>
                    handleOptionChange("skipDuplicates", e.target.checked)
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="skipDuplicates"
                  className="text-sm text-gray-700"
                >
                  Skip duplicate leads
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="updateExisting"
                  checked={uploadOptions.updateExisting}
                  onChange={(e) =>
                    handleOptionChange("updateExisting", e.target.checked)
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="updateExisting"
                  className="text-sm text-gray-700"
                >
                  Update existing leads
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="validateEmails"
                  checked={uploadOptions.validateEmails}
                  onChange={(e) =>
                    handleOptionChange("validateEmails", e.target.checked)
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="validateEmails"
                  className="text-sm text-gray-700"
                >
                  Validate email formats
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="validatePhones"
                  checked={uploadOptions.validatePhones}
                  onChange={(e) =>
                    handleOptionChange("validatePhones", e.target.checked)
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="validatePhones"
                  className="text-sm text-gray-700"
                >
                  Validate phone formats
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="maxRows"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Maximum rows to process
              </label>
              <input
                type="number"
                id="maxRows"
                value={uploadOptions.maxRows}
                onChange={(e) =>
                  handleOptionChange("maxRows", parseInt(e.target.value))
                }
                min="1"
                max="10000"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>

            {selectedFile && (
              <>
                <button
                  onClick={handleValidate}
                  disabled={isValidating}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {isValidating ? "Validating..." : "Validate File"}
                </button>

                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload & Process"}
                </button>
              </>
            )}
          </div>

          {/* Validation Results */}
          {showValidation && validationResult && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Validation Results
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  validationResult.data.isValid
                    ? "bg-green-50 border border-green-200"
                    : "bg-yellow-50 border border-yellow-200"
                }`}
              >
                <div className="flex items-center mb-3">
                  {validationResult.data.isValid ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                  )}
                  <span
                    className={`font-medium ${
                      validationResult.data.isValid
                        ? "text-green-800"
                        : "text-yellow-800"
                    }`}
                  >
                    {validationResult.data.isValid
                      ? "File is valid"
                      : "File has validation issues"}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Total Rows:</span>{" "}
                    {validationResult.data.totalRows}
                  </div>
                  <div>
                    <span className="font-medium">Valid Rows:</span>{" "}
                    {validationResult.data.validRows}
                  </div>
                  <div>
                    <span className="font-medium">Errors:</span>{" "}
                    {validationResult.data.errors.length}
                  </div>
                  <div>
                    <span className="font-medium">Warnings:</span>{" "}
                    {validationResult.data.warnings.length}
                  </div>
                </div>

                {validationResult.data.errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                    <div className="max-h-40 overflow-y-auto">
                      {validationResult.data.errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-700 mb-1">
                          Row {error.row}: {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {validationResult.data.warnings.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      Warnings:
                    </h4>
                    <div className="max-h-40 overflow-y-auto">
                      {validationResult.data.warnings.map((warning, index) => (
                        <div
                          key={index}
                          className="text-sm text-yellow-700 mb-1"
                        >
                          {warning}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Results */}
          {uploadResult && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Upload Results
              </h3>
              <div
                className={`p-4 rounded-lg ${
                  uploadResult.success
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <div className="flex items-center mb-3">
                  {uploadResult.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                  )}
                  <span
                    className={`font-medium ${
                      uploadResult.success ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {uploadResult.message}
                  </span>
                </div>

                {uploadResult.success && uploadResult.data && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="font-medium">Total Rows:</span>{" "}
                      {uploadResult.data.totalRows}
                    </div>
                    <div>
                      <span className="font-medium">Processed:</span>{" "}
                      {uploadResult.data.processedRows}
                    </div>
                    <div>
                      <span className="font-medium">Inserted:</span>{" "}
                      {uploadResult.data.insertedRows}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>{" "}
                      {uploadResult.data.updatedRows}
                    </div>
                    <div>
                      <span className="font-medium">Skipped:</span>{" "}
                      {uploadResult.data.skippedRows}
                    </div>
                    <div>
                      <span className="font-medium">Errors:</span>{" "}
                      {uploadResult.data.errorRows}
                    </div>
                    <div>
                      <span className="font-medium">Success Rate:</span>{" "}
                      {uploadResult.data.successRate}%
                    </div>
                    <div>
                      <span className="font-medium">Processing Time:</span>{" "}
                      {uploadResult.data.processingTime}ms
                    </div>
                  </div>
                )}

                {uploadResult.success &&
                  uploadResult.data.errors &&
                  uploadResult.data.errors.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                      <div className="max-h-40 overflow-y-auto">
                        {uploadResult.data.errors.map((error, index) => (
                          <div
                            key={index}
                            className="text-sm text-red-700 mb-1"
                          >
                            Row {error.row}: {error.message}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {uploadResult.success &&
                  uploadResult.data.duplicates &&
                  uploadResult.data.duplicates.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-yellow-800 mb-2">
                        Duplicates:
                      </h4>
                      <div className="max-h-40 overflow-y-auto">
                        {uploadResult.data.duplicates.map(
                          (duplicate, index) => (
                            <div
                              key={index}
                              className="text-sm text-yellow-700 mb-1"
                            >
                              Row {duplicate.row}: {duplicate.reason}
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upload History Section */}
      {showUploadHistory && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <History className="h-5 w-5 mr-2 text-purple-600" />
              Excel Upload History
            </h2>
            <button
              onClick={closeExcelUpload}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Upload History Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rows
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Success Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Processing Time
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {uploadHistory.map((upload, index) => (
                  <tr
                    key={upload.uploadId || index}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileSpreadsheet className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {upload.fileName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {(upload.fileSize / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(upload.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {upload.totalRows}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>Inserted: {upload.insertedRows}</div>
                        <div>Updated: {upload.updatedRows}</div>
                        <div>Skipped: {upload.skippedRows}</div>
                        <div>Errors: {upload.errorRows}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {upload.successRate >= 90 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        )}
                        <span
                          className={`ml-2 text-sm font-medium ${
                            upload.successRate >= 90
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {upload.successRate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {upload.processingTime}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {uploadHistory.length === 0 && (
            <div className="text-center py-12">
              <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No upload history
              </h3>
              <p className="text-gray-500">
                No Excel files have been uploaded yet. Upload your first file to
                see the history here.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={sourceFilter}
              onChange={handleSourceFilter}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="social">Social Media</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
            </select>
          </div>

          <div className="relative">
            <ArrowRight className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <select
              value={stageFilter}
              onChange={handleStageFilter}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Stages</option>
              {Object.entries(stageConfig).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <span>Total: {pagination.total || 0} leads</span>
            {stageFilter && (
              <span className="ml-2 text-blue-600">
                • {stageConfig[stageFilter]?.label || stageFilter}
              </span>
            )}
            {/* Show unconverted leads count */}
            {(() => {
              const unconvertedCount = leads.filter(
                (lead) => lead.stage === "CONVERT" && !lead.linkedCollegeId,
              ).length;
              return unconvertedCount > 0 ? (
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  {unconvertedCount} need conversion
                </span>
              ) : null;
            })()}
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage & Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No leads found
                    </h3>
                    <p className="text-gray-500">
                      Get started by adding your first lead.
                    </p>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {lead.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {lead.requirement}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">
                          {lead.organization}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-900">
                          <Mail className="h-3 w-3 text-gray-400 mr-2" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone className="h-3 w-3 text-gray-400 mr-2" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        {getStageBadge(lead.stage)}
                        {getPriorityBadge(lead.priority)}
                        {/* Conversion Status Indicator */}
                        {(lead.stage === "CONVERT" || lead.stage === "CONVERTED") && lead.collegeId && (
                          <div className="flex items-center space-x-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              🏫 Converted
                            </span>
                          </div>
                        )}
                        {lead.stage === "CONVERT" && !lead.collegeId && (
                          <div className="flex items-center space-x-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              ⏳ Converting...
                            </span>
                          </div>
                        )}
                        {/* Organization Warning */}
                        {!lead.organization && lead.stage !== "CONVERTED" && (
                          <div className="flex items-center space-x-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              ⚠️ No Organization
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getSourceBadge(lead.source)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 text-gray-400 mr-2" />
                        {formatDate(lead.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewLead(lead.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View Lead"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(lead)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Update Status"
                        >
                          <Clock className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() =>
                            navigate(`/dashboard/crm/leads/${lead.id}/edit`)
                          }
                          className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                          title="Edit Lead"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete Lead"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        currentPage * pagination.limit,
                        pagination.total,
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={!pagination.hasPrev}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={!pagination.hasNext}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        itemName={deleteModal.item?.name || ""}
        itemType="Lead"
        isLoading={deleteModal.isLoading}
      />

      {/* Status Update Modal */}
      {showStatusUpdate && selectedLead && (
        <LeadStatusUpdate
          lead={selectedLead}
          onUpdate={handleStatusUpdateComplete}
          onClose={handleCloseStatusUpdate}
        />
      )}
    </div>
  );
};

export default LeadList;
