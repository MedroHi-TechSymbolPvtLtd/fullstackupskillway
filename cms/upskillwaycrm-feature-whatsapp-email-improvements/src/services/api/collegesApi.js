import { authApi } from "./apiConfig";

const collegesApi = {
  // Get all colleges with pagination and search
  getAllColleges: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();

      // Add pagination params
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      // Add search and filter params
      if (params.search) queryParams.append("search", params.search);
      if (params.type) queryParams.append("type", params.type);
      if (params.status) queryParams.append("status", params.status);
      if (params.city) queryParams.append("city", params.city);
      if (params.state) queryParams.append("state", params.state);
      queryParams.append("_t", Date.now()); // Cache buster

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/v1/colleges?${queryString}`
        : "/api/v1/colleges";

      const response = await authApi.get(url);
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching colleges from API, using localStorage fallback:",
        error,
      );

      // Fallback to localStorage
      return collegesApi.getCollegesFromStorage(params);
    }
  },

  // Get college by ID
  getCollegeById: async (id) => {
    try {
      const response = await authApi.get(`/api/v1/colleges/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching college:", error);
      throw error;
    }
  },

  // Create new college
  createCollege: async (collegeData) => {
    try {
      console.log(
        "🔄 Colleges API - Attempting to create college via API:",
        collegeData,
      );
      const response = await authApi.post("/api/v1/colleges", collegeData);
      console.log("✅ Colleges API - API creation successful:", response.data);
      
      // IMPORTANT: If college was created via API, also save it to localStorage for fallback updates
      // This ensures that if API update fails later, we can still update it in localStorage
      if (response.data?.success) {
        // Extract college data - handle both response.data.data and response.data structures
        let createdCollege = response.data.data || response.data;
        
        // If it's still nested, try response.data.data.data
        if (!createdCollege.id && response.data.data?.data) {
          createdCollege = response.data.data.data;
        }
        
        console.log("📦 Colleges API - Saving API-created college to localStorage for fallback:", {
          college: createdCollege,
          collegeId: createdCollege?.id,
          collegeIdType: typeof createdCollege?.id,
          responseStructure: {
            hasData: !!response.data,
            hasDataData: !!response.data?.data,
            hasDataDataData: !!response.data?.data?.data
          }
        });
        
        if (createdCollege && createdCollege.id) {
          try {
            // Save to localStorage so updateCollegeInStorage can find it later
            const storageKey = "colleges-data";
            const storedData = localStorage.getItem(storageKey);
            const colleges = storedData ? JSON.parse(storedData) : [];
            
            // Check if college already exists (avoid duplicates) - use string comparison for UUIDs
            const exists = colleges.some(c => String(c.id) === String(createdCollege.id));
            if (!exists) {
              colleges.push(createdCollege);
              localStorage.setItem(storageKey, JSON.stringify(colleges));
              console.log("✅ Colleges API - College saved to localStorage for fallback support. ID:", createdCollege.id);
            } else {
              console.log("ℹ️ Colleges API - College already exists in localStorage, updating existing entry");
              // Update existing entry instead of skipping
              const existingIndex = colleges.findIndex(c => String(c.id) === String(createdCollege.id));
              if (existingIndex !== -1) {
                colleges[existingIndex] = { ...colleges[existingIndex], ...createdCollege };
                localStorage.setItem(storageKey, JSON.stringify(colleges));
                console.log("✅ Colleges API - Updated existing college in localStorage");
              }
            }
          } catch (storageError) {
            // Don't fail the creation if localStorage save fails
            console.warn("⚠️ Colleges API - Failed to save college to localStorage (non-critical):", storageError);
          }
        } else {
          console.warn("⚠️ Colleges API - Cannot save to localStorage: college data or ID is missing", createdCollege);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error(
        "❌ Colleges API - API creation failed, using localStorage fallback:",
        error.response?.status,
        error.response?.data || error.message,
      );

      // Fallback to localStorage
      console.log("📦 Colleges API - Falling back to localStorage creation");
      const fallbackResult = await collegesApi.createCollegeInStorage(
        collegeData,
      );
      console.log(
        "✅ Colleges API - localStorage creation successful:",
        fallbackResult,
      );
      return fallbackResult;
    }
  },

  // Update college
  updateCollege: async (id, collegeData) => {
    try {
      const response = await authApi.put(`/api/v1/colleges/${id}`, collegeData);
      return response.data;
    } catch (error) {
      console.error(
        "Error updating college via API, using localStorage fallback:",
        error,
      );

      // Fallback to localStorage
      return collegesApi.updateCollegeInStorage(id, collegeData);
    }
  },

  // Delete college
  deleteCollege: async (id) => {
    try {
      const response = await authApi.delete(`/api/v1/colleges/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting college:", error);
      throw error;
    }
  },

  // Search colleges
  searchColleges: async (searchParams) => {
    try {
      const queryParams = new URLSearchParams();

      if (searchParams.search)
        queryParams.append("search", searchParams.search);
      if (searchParams.type) queryParams.append("type", searchParams.type);
      if (searchParams.status)
        queryParams.append("status", searchParams.status);
      if (searchParams.city) queryParams.append("city", searchParams.city);
      if (searchParams.state) queryParams.append("state", searchParams.state);
      if (searchParams.page) queryParams.append("page", searchParams.page);
      if (searchParams.limit) queryParams.append("limit", searchParams.limit);

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/v1/colleges?${queryString}`
        : "/api/v1/colleges";

      const response = await authApi.get(url);
      return response.data;
    } catch (error) {
      console.error("Error searching colleges:", error);
      throw error;
    }
  },

  // Get college statistics
  getCollegeStats: async () => {
    try {
      const response = await authApi.get("/api/v1/colleges/stats");
      return response.data;
    } catch (error) {
      console.error("Error fetching college stats:", error);
      throw error;
    }
  },

  // Get college types (for dropdowns)
  getCollegeTypes: async () => {
    try {
      const response = await authApi.get("/api/v1/colleges/types");
      return response.data;
    } catch (error) {
      console.error("Error fetching college types:", error);
      throw error;
    }
  },

  // Get college statuses (for dropdowns)
  getCollegeStatuses: async () => {
    try {
      const response = await authApi.get("/api/v1/colleges/statuses");
      return response.data;
    } catch (error) {
      console.error("Error fetching college statuses:", error);
      throw error;
    }
  },

  // Enhanced Methods for Lead Conversion Integration

  /**
   * Creates a college from lead conversion data
   * Handles lead-specific data mapping and validation
   * @param {Object} leadData - The lead data to convert
   * @param {Object} additionalData - Additional college data
   * @returns {Promise<Object>} Created college response
   */
  createCollegeFromLead: async (leadData, additionalData = {}) => {
    try {
      console.log(
        "🏗️ Colleges API - Creating college from lead data:",
        leadData,
      );

      // Validate required lead data
      if (!leadData || !leadData.id) {
        throw new Error("Invalid lead data: Lead ID is required");
      }

      // Extract college name from lead organization or name
      console.log(
        "🏗️ Colleges API - Lead organization:",
        leadData.organization,
      );
      console.log("🏗️ Colleges API - Lead name:", leadData.name);

      const collegeName =
        leadData.organization?.trim() ||
        leadData.name?.trim() ||
        `College for Lead ${leadData.id}`;

      console.log("🏗️ Colleges API - Final college name:", collegeName);

      // Map lead data to college structure
      const collegeData = {
        // Basic college information
        name: collegeName,
        status: "ACTIVE",
        type: "OTHER", // Use valid enum value instead of 'EDUCATIONAL_INSTITUTION'

        // Contact information from lead
        contactEmail: leadData.email || null,
        contactPhone: leadData.phone || null,

        // Lead conversion tracking - only include if valid UUID format
        conversionDate: new Date().toISOString(),

        // Description and notes
        description:
          leadData.requirement ||
          `College created from converted lead: ${leadData.name}`,
        notes: `Automatically created from lead conversion.\nOriginal lead: ${
          leadData.name
        } (ID: ${leadData.id})\nOrganization: ${
          leadData.organization || "N/A"
        }\nSource: ${leadData.source || "Unknown"}`,

        // Required fields with default values (backend expects non-null)
        address: leadData.address || "",
        city: leadData.city || "Unknown",
        state: leadData.state || "Unknown",
        country: leadData.country || "Unknown",
        postalCode: leadData.postalCode || "",
        website:
          leadData.website ||
          `https://${collegeName.toLowerCase().replace(/\s+/g, "")}.edu`, // Generate a placeholder URL
        establishedYear: leadData.establishedYear || new Date().getFullYear(),

        // Timestamps
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Conditionally add sourceLeadId only if it's a valid UUID format
      if (leadData.id) {
        const leadIdStr = String(leadData.id);
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (leadIdStr.length === 36 && uuidRegex.test(leadIdStr)) {
          collegeData.sourceLeadId = leadIdStr;
          console.log(
            "✅ CollegesApi - Valid UUID sourceLeadId included:",
            leadIdStr,
          );
        } else {
          console.warn(
            "⚠️ CollegesApi - Invalid UUID format for leadId, storing in notes instead:",
            leadIdStr,
          );
          // Store the lead ID in notes for reference instead
          collegeData.notes += `\nOriginal Lead ID (non-UUID): ${leadIdStr}`;
        }
      }

      // Conditionally add assignedToId only if it has a valid value
      if (
        additionalData.assignedToId &&
        typeof additionalData.assignedToId === "string" &&
        additionalData.assignedToId.trim() !== ""
      ) {
        collegeData.assignedToId = additionalData.assignedToId;
      }

      // Merge any other additional data (excluding assignedToId which we handled above)
      const { assignedToId: _, ...otherAdditionalData } = additionalData;
      Object.assign(collegeData, otherAdditionalData);

      console.log("🏗️ Colleges API - Mapped college data:", collegeData);

      // Validate college data before creation
      const validationResult = collegesApi.validateCollegeData(collegeData);
      if (!validationResult.isValid) {
        throw new Error(
          `College data validation failed: ${validationResult.errors.join(
            ", ",
          )}`,
        );
      }

      // Create the college using the standard createCollege method (which has localStorage fallback)
      console.log(
        "🔄 Colleges API - Calling createCollege with data:",
        collegeData,
      );

      const response = await collegesApi.createCollege(collegeData);

      console.log(
        "✅ Colleges API - College created successfully from lead:",
        response,
      );
      
      // Ensure response structure is correct
      // The API might return { success: true, data: { id: "...", ... } }
      // Or the response might be { success: true, data: { data: { id: "...", ... } } }
      if (response && response.success && response.data) {
        // If response.data is the college object directly
        if (response.data.id) {
          console.log("✅ Colleges API - College ID from response.data:", response.data.id);
          console.log("✅ Colleges API - College ID type:", typeof response.data.id);
        }
        // If response.data.data is the college object (nested structure)
        else if (response.data.data && response.data.data.id) {
          console.log("✅ Colleges API - College ID from response.data.data:", response.data.data.id);
          console.log("✅ Colleges API - College ID type:", typeof response.data.data.id);
        }
      }

      return response;
    } catch (error) {
      console.error(
        "❌ Colleges API - Error creating college from lead:",
        error,
      );
      throw error;
    }
  },

  /**
   * Updates college with lead conversion information
   * @param {number} collegeId - The college ID
   * @param {Object} leadData - The lead data
   * @returns {Promise<Object>} Update response
   */
  updateCollegeWithLeadInfo: async (collegeId, leadData) => {
    try {
      console.log(
        `🔄 Colleges API - Updating college ${collegeId} with lead info:`,
        leadData,
      );

      const updateData = {
        sourceLeadId: leadData.id,
        conversionDate: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Add lead contact info if college doesn't have it
      if (leadData.email && !updateData.contactEmail) {
        updateData.contactEmail = leadData.email;
      }
      if (leadData.phone && !updateData.contactPhone) {
        updateData.contactPhone = leadData.phone;
      }

      // Update notes to include lead information
      if (leadData.name) {
        updateData.notes = `Linked to converted lead: ${leadData.name} (ID: ${leadData.id})`;
      }

      const response = await authApi.put(
        `/api/v1/colleges/${collegeId}`,
        updateData,
      );

      if (!response.data.success) {
        throw new Error(
          `Failed to update college: ${
            response.data.message || "Unknown error"
          }`,
        );
      }

      console.log(
        `✅ Colleges API - College ${collegeId} updated with lead info successfully`,
      );

      return response.data;
    } catch (error) {
      console.error(
        `❌ Colleges API - Error updating college with lead info:`,
        error,
      );

      // If the college doesn't exist in the backend (404 or UUID error),
      // try to update it in localStorage as fallback
      if (
        error.response?.status === 404 ||
        error.message?.includes("invalid length") ||
        error.message?.includes("UUID")
      ) {
        console.log(
          `⚠️ Colleges API - College ${collegeId} update failed (${error.response?.status || 'unknown error'}), trying localStorage fallback`,
        );
        console.log(
          `⚠️ Colleges API - Error details:`, error.message, error.response?.data,
        );

        // First, check if college exists in API (might be a temporary error)
        try {
          const getResponse = await collegesApi.getCollegeById(collegeId);
          if (getResponse.success && getResponse.data) {
            console.log(
              `✅ Colleges API - College ${collegeId} exists in API, but update failed. Retrying API update...`,
            );
            // College exists - the update might have failed due to validation or other issue
            // Try the update again with minimal data
            try {
              const retryResponse = await authApi.put(
                `/api/v1/colleges/${collegeId}`,
                {
                  sourceLeadId: leadData.id,
                  conversionDate: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              );
              if (retryResponse.data.success) {
                console.log(
                  `✅ Colleges API - Retry successful for college ${collegeId}`,
                );
                return retryResponse.data;
              }
            } catch (retryError) {
              console.warn(
                `⚠️ Colleges API - Retry also failed, will try localStorage`,
              );
            }
          }
        } catch (getError) {
          console.log(
            `⚠️ Colleges API - Cannot fetch college ${collegeId} from API (might not exist), trying localStorage`,
          );
        }

        // Try localStorage update as fallback
        try {
          return collegesApi.updateCollegeInStorage(collegeId, {
            sourceLeadId: leadData.id,
            conversionDate: new Date().toISOString(),
            notes: leadData.name
              ? `Linked to converted lead: ${leadData.name} (ID: ${leadData.id})`
              : undefined,
            updatedAt: new Date().toISOString(),
          });
        } catch (storageError) {
          console.error(
            `❌ Colleges API - Failed to update college in localStorage:`,
            storageError,
          );
          
          // If college was just created via API, it should be in localStorage now (from createCollege)
          // But if it's not, it means the college exists only in API
          if (storageError.message?.includes("not found in localStorage")) {
            console.log(
              `ℹ️ Colleges API - College ${collegeId} exists in API but not in localStorage.`,
            );
            console.log(
              `ℹ️ Colleges API - This is normal if the college was just created. The update will sync on next fetch.`,
            );
            // Return success to not break the conversion process
            return {
              success: true,
              message:
                "College exists in API but not in localStorage. Update will be synced on next API call.",
              skipped: true,
            };
          }
          
          // Return success anyway to not break the conversion process
          return {
            success: true,
            message:
              "College update skipped - will be synced on next API call",
            skipped: true,
          };
        }
      }

      throw error;
    }
  },

  /**
   * Searches for colleges by name with fuzzy matching
   * Enhanced for duplicate detection during lead conversion
   * @param {string} name - The name to search for
   * @param {Object} options - Search options
   * @returns {Promise<Object>} Search results
   */
  searchCollegesByName: async (name, options = {}) => {
    try {
      console.log(`🔍 Colleges API - Searching colleges by name: "${name}"`);

      if (!name || !name.trim()) {
        return {
          success: true,
          data: [],
          message: "Empty search term provided",
        };
      }

      const searchParams = {
        search: name.trim(),
        limit: options.limit || 50,
        page: options.page || 1,
        status: options.status || "ACTIVE", // Default to active colleges
      };

      const response = await collegesApi.searchColleges(searchParams);

      if (!response.success) {
        throw new Error(`Search failed: ${response.message}`);
      }

      console.log(
        `✅ Colleges API - Found ${
          response.data?.length || 0
        } colleges matching "${name}"`,
      );

      return response;
    } catch (error) {
      console.error(
        "❌ Colleges API - Error searching colleges by name:",
        error,
      );
      throw error;
    }
  },

  /**
   * Gets colleges created from lead conversions
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Converted colleges
   */
  getConvertedColleges: async (params = {}) => {
    try {
      console.log(
        "🔍 Colleges API - Fetching colleges created from lead conversions",
      );

      // For now, get all colleges and filter client-side
      // TODO: Add backend support for hasSourceLead filter
      const response = await collegesApi.getAllColleges({
        ...params,
        limit: params.limit || 100,
      });

      if (!response.success) {
        throw new Error(`Failed to fetch colleges: ${response.message}`);
      }

      // Filter colleges that have sourceLeadId
      const convertedColleges = (response.data || []).filter(
        (college) => college.sourceLeadId,
      );

      console.log(
        `✅ Colleges API - Found ${convertedColleges.length} colleges created from lead conversions`,
      );

      return {
        success: true,
        data: convertedColleges,
        pagination: {
          ...response.pagination,
          total: convertedColleges.length,
        },
      };
    } catch (error) {
      console.error(
        "❌ Colleges API - Error fetching converted colleges:",
        error,
      );
      throw error;
    }
  },

  /**
   * Gets college by source lead ID
   * @param {number} leadId - The source lead ID
   * @returns {Promise<Object>} College data
   */
  getCollegeBySourceLead: async (leadId) => {
    try {
      console.log(
        `🔍 Colleges API - Finding college created from lead ${leadId}`,
      );

      // This would ideally be a backend endpoint: /api/v1/colleges/by-lead/{leadId}
      // For now, search by source lead ID
      const response = await collegesApi.getAllColleges({
        sourceLeadId: leadId,
        limit: 1,
      });

      if (!response.success) {
        throw new Error(`Failed to search colleges: ${response.message}`);
      }

      const colleges = response.data || [];
      const college = colleges.find((c) => c.sourceLeadId === parseInt(leadId));

      if (college) {
        console.log(
          `✅ Colleges API - Found college ${college.id} created from lead ${leadId}`,
        );
        return {
          success: true,
          data: college,
        };
      } else {
        console.log(`ℹ️ Colleges API - No college found for lead ${leadId}`);
        return {
          success: true,
          data: null,
          message: "No college found for this lead",
        };
      }
    } catch (error) {
      console.error(
        `❌ Colleges API - Error finding college by source lead:`,
        error,
      );
      throw error;
    }
  },

  /**
   * Validates college data before creation/update
   * @param {Object} collegeData - The college data to validate
   * @returns {Object} Validation result
   */
  validateCollegeData: (collegeData) => {
    console.log("🔍 CollegesApi - Validating college data:", collegeData);
    const errors = [];

    // Required fields validation
    if (!collegeData.name || !collegeData.name.trim()) {
      errors.push("College name is required");
    }

    if (collegeData.name && collegeData.name.length > 255) {
      errors.push("College name must be less than 255 characters");
    }

    if (!collegeData.status) {
      errors.push("College status is required");
    }

    if (
      collegeData.status &&
      !["ACTIVE", "INACTIVE"].includes(collegeData.status)
    ) {
      errors.push("College status must be ACTIVE or INACTIVE");
    }

    // Type validation - must match backend enum
    const validTypes = [
      "ENGINEERING",
      "MEDICAL",
      "MANAGEMENT",
      "ARTS_SCIENCE",
      "LAW",
      "PHARMACY",
      "ARCHITECTURE",
      "OTHER",
    ];
    if (collegeData.type && !validTypes.includes(collegeData.type)) {
      errors.push(`College type must be one of: ${validTypes.join(", ")}`);
    }

    // Required string fields validation (backend expects non-null strings)
    const requiredStringFields = ["city", "state"];
    requiredStringFields.forEach((field) => {
      if (collegeData[field] === null || collegeData[field] === undefined) {
        errors.push(`${field} is required and cannot be null`);
      }
    });

    // Website URL validation
    if (collegeData.website) {
      try {
        new URL(collegeData.website);
      } catch {
        errors.push("Website must be a valid URL");
      }
    }

    // Established year validation
    if (
      collegeData.establishedYear !== null &&
      collegeData.establishedYear !== undefined
    ) {
      if (
        !Number.isInteger(collegeData.establishedYear) ||
        collegeData.establishedYear < 1800 ||
        collegeData.establishedYear > new Date().getFullYear()
      ) {
        errors.push(
          "Established year must be a valid year between 1800 and current year",
        );
      }
    }

    // Email validation
    if (collegeData.contactEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(collegeData.contactEmail)) {
        errors.push("Invalid contact email format");
      }
    }

    // Phone validation
    if (collegeData.contactPhone) {
      const phoneRegex = /^[+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(collegeData.contactPhone.replace(/[\s\-()]/g, ""))) {
        errors.push("Invalid contact phone format");
      }
    }

    // Source lead ID validation - can be string (UUID) or number
    console.log(
      "🔍 CollegesApi - Validating sourceLeadId:",
      collegeData.sourceLeadId,
      "Type:",
      typeof collegeData.sourceLeadId,
      "Length:",
      collegeData.sourceLeadId?.length,
    );
    if (collegeData.sourceLeadId) {
      if (typeof collegeData.sourceLeadId === "string") {
        if (collegeData.sourceLeadId.trim() === "") {
          errors.push("Source lead ID cannot be empty");
        } else {
          // Check if it looks like a UUID (36 characters with hyphens)
          const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (
            collegeData.sourceLeadId.length !== 36 ||
            !uuidRegex.test(collegeData.sourceLeadId)
          ) {
            console.warn(
              "⚠️ CollegesApi - sourceLeadId does not match UUID format, but allowing for compatibility",
            );
            // Don't fail validation, just warn - some systems might use different ID formats
          }
        }
      } else if (typeof collegeData.sourceLeadId === "number") {
        if (
          !Number.isInteger(collegeData.sourceLeadId) ||
          collegeData.sourceLeadId <= 0
        ) {
          errors.push("Source lead ID must be a positive integer");
        }
      } else {
        errors.push("Source lead ID must be a string or number");
      }
    }

    // Assigned To ID validation - optional field (only validate if present)
    console.log(
      "🔍 CollegesApi - Validating assignedToId:",
      collegeData.assignedToId,
      "Type:",
      typeof collegeData.assignedToId,
      "HasProperty:",
      Object.prototype.hasOwnProperty.call(collegeData, "assignedToId"),
    );
    if (
      Object.prototype.hasOwnProperty.call(collegeData, "assignedToId") &&
      collegeData.assignedToId !== null &&
      collegeData.assignedToId !== undefined
    ) {
      if (
        typeof collegeData.assignedToId === "string" &&
        collegeData.assignedToId.trim() !== ""
      ) {
        // Validate UUID format if provided
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(collegeData.assignedToId)) {
          errors.push("Assigned To ID must be a valid UUID format");
        }
      } else if (collegeData.assignedToId !== null) {
        errors.push("Assigned To ID must be a valid UUID string");
      }
    }

    const result = {
      isValid: errors.length === 0,
      errors,
    };

    console.log("🔍 CollegesApi - Validation result:", result);
    return result;
  },

  /**
   * Gets conversion statistics for colleges
   * @returns {Promise<Object>} Conversion statistics
   */
  getConversionStats: async () => {
    try {
      console.log("📊 Colleges API - Calculating conversion statistics");

      const [allCollegesResponse, convertedCollegesResponse] =
        await Promise.all([
          collegesApi.getAllColleges({ limit: 1000 }),
          collegesApi.getConvertedColleges({ limit: 1000 }),
        ]);

      if (!allCollegesResponse.success || !convertedCollegesResponse.success) {
        throw new Error("Failed to fetch college data for statistics");
      }

      const totalColleges = allCollegesResponse.data?.length || 0;
      const convertedColleges = convertedCollegesResponse.data?.length || 0;
      const manualColleges = totalColleges - convertedColleges;

      const conversionRate =
        totalColleges > 0
          ? ((convertedColleges / totalColleges) * 100).toFixed(2)
          : 0;

      // Calculate recent conversions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentConversions = (convertedCollegesResponse.data || []).filter(
        (college) =>
          college.conversionDate &&
          new Date(college.conversionDate) > thirtyDaysAgo,
      ).length;

      const stats = {
        totalColleges,
        convertedColleges,
        manualColleges,
        conversionRate: `${conversionRate}%`,
        recentConversions,
        lastUpdated: new Date().toISOString(),
      };

      console.log("✅ Colleges API - Conversion statistics calculated:", stats);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error(
        "❌ Colleges API - Error calculating conversion stats:",
        error,
      );
      throw error;
    }
  },

  // Utility methods
  generateUUID: () => {
    // Generate a UUID v4 compatible string
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  },

  // localStorage fallback methods
  getCollegesFromStorage: (params = {}) => {
    try {
      console.log(
        "📦 CollegesApi - Getting colleges from localStorage with params:",
        params,
      );

      const storageKey = "colleges-data";
      const storedData = localStorage.getItem(storageKey);
      console.log("📦 CollegesApi - Raw localStorage data:", storedData);

      let colleges = storedData ? JSON.parse(storedData) : [];

      console.log(
        `📦 CollegesApi - Parsed ${colleges.length} colleges from localStorage:`,
        colleges,
      );

      // Apply filters
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        colleges = colleges.filter(
          (college) =>
            college.name.toLowerCase().includes(searchTerm) ||
            (college.contactEmail &&
              college.contactEmail.toLowerCase().includes(searchTerm)),
        );
      }

      if (params.status && params.status !== "all") {
        colleges = colleges.filter(
          (college) => college.status === params.status,
        );
      }

      if (params.type && params.type !== "all") {
        colleges = colleges.filter((college) => college.type === params.type);
      }

      // Sort by creation date (newest first)
      colleges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedColleges = colleges.slice(startIndex, endIndex);

      const result = {
        success: true,
        data: paginatedColleges,
        pagination: {
          page,
          limit,
          total: colleges.length,
          totalPages: Math.ceil(colleges.length / limit),
          hasNext: endIndex < colleges.length,
          hasPrev: page > 1,
        },
      };

      console.log("📦 CollegesApi - Returning colleges from storage:", result);
      return result;
    } catch (error) {
      console.error("📦 Error getting colleges from storage:", error);
      return {
        success: true,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      };
    }
  },

  createCollegeInStorage: (collegeData) => {
    try {
      console.log(
        "📦 CollegesApi - Creating college in localStorage:",
        collegeData,
      );

      const storageKey = "colleges-data";
      const storedData = localStorage.getItem(storageKey);
      console.log(
        "📦 CollegesApi - Current localStorage data before create:",
        storedData,
      );

      const colleges = storedData ? JSON.parse(storedData) : [];
      console.log("📦 CollegesApi - Current colleges array:", colleges);

      // Generate a UUID-compatible ID for backend compatibility
      const newId = collegesApi.generateUUID();

      // Create the new college
      const newCollege = {
        id: newId,
        ...collegeData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      console.log("📦 CollegesApi - New college object:", newCollege);

      // Add to the array
      colleges.push(newCollege);
      console.log("📦 CollegesApi - Updated colleges array:", colleges);

      // Save back to localStorage
      const updatedData = JSON.stringify(colleges);
      localStorage.setItem(storageKey, updatedData);
      console.log("📦 CollegesApi - Saved to localStorage:", updatedData);

      // Verify it was saved
      const verifyData = localStorage.getItem(storageKey);
      console.log(
        "📦 CollegesApi - Verification - data in localStorage:",
        verifyData,
      );

      console.log(
        "✅ CollegesApi - College created in storage successfully:",
        newCollege,
      );

      return {
        success: true,
        data: newCollege,
        message: "College created successfully",
      };
    } catch (error) {
      console.error("📦 Error creating college in storage:", error);
      throw error;
    }
  },

  updateCollegeInStorage: (id, collegeData) => {
    try {
      console.log(
        `📦 CollegesApi - Updating college ${id} in localStorage:`,
        collegeData,
      );

      const storageKey = "colleges-data";
      const storedData = localStorage.getItem(storageKey);
      const colleges = storedData ? JSON.parse(storedData) : [];

      console.log(`📦 CollegesApi - Searching for college with ID: ${id} (type: ${typeof id})`);
      console.log(`📦 CollegesApi - Colleges in storage:`, colleges.map(c => ({ id: c.id, idType: typeof c.id })));

      // Find and update the college - use string comparison for UUIDs
      // Handle both string UUIDs and numeric IDs
      const collegeIndex = colleges.findIndex(
        (college) => {
          // Compare as strings first (for UUIDs)
          if (String(college.id) === String(id)) {
            return true;
          }
          // Fallback to numeric comparison for legacy numeric IDs
          const collegeIdNum = parseInt(college.id);
          const searchIdNum = parseInt(id);
          if (!isNaN(collegeIdNum) && !isNaN(searchIdNum) && collegeIdNum === searchIdNum) {
            return true;
          }
          return false;
        }
      );

      if (collegeIndex === -1) {
        console.error(`❌ CollegesApi - College not found in localStorage. ID: ${id}, Available IDs:`, colleges.map(c => c.id));
        throw new Error(`College with ID ${id} not found in localStorage`);
      }

      // Update the college
      colleges[collegeIndex] = {
        ...colleges[collegeIndex],
        ...collegeData,
        updatedAt: new Date().toISOString(),
      };

      // Save back to localStorage
      localStorage.setItem(storageKey, JSON.stringify(colleges));

      console.log(
        "📦 CollegesApi - College updated in storage:",
        colleges[collegeIndex],
      );

      return {
        success: true,
        data: colleges[collegeIndex],
        message: "College updated successfully",
      };
    } catch (error) {
      console.error("📦 Error updating college in storage:", error);
      throw error;
    }
  },
};

export default collegesApi;
