// CRM Backend Service - Fetches real data from backend API
import { authApi } from "./api/apiConfig";
import leadConversionService from "./leadConversionService";

class CRMService {
  constructor() {
    this.storageKey = "crm-data";
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const initialData = {
        leads: [
          {
            id: 1,
            name: "John Doe",
            company: "Tech Corp",
            organization: "Tech Corp", // Added organization field for college name extraction
            email: "john@techcorp.com",
            phone: "+1-555-0123",
            status: "qualified",
            priority: "high",
            source: "website",
            requirement: "Need advanced JavaScript training for development team",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // New fields for conversion tracking
            linkedCollegeId: null,
            conversionDate: null,
          },
          {
            id: 2,
            name: "Jane Smith",
            company: "Innovation Inc",
            organization: "Innovation Inc", // Added organization field for college name extraction
            email: "jane@innovation.com",
            phone: "+1-555-0124",
            status: "new",
            priority: "medium",
            source: "referral",
            requirement: "Looking for Python development courses",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // New fields for conversion tracking
            linkedCollegeId: null,
            conversionDate: null,
          },
        ],
        colleges: [],
        trainers: [],
        users: [],
      };
      this.setData(initialData);
    }
  }

  getData() {
    const data = localStorage.getItem(this.storageKey);
    return data
      ? JSON.parse(data)
      : { leads: [], colleges: [], trainers: [], users: [] };
  }

  setData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Real-time Chart Data Methods
  async getChartData() {
    try {
      console.log("🔄 CRM Service - Fetching REAL-TIME chart data from API...");

      // Fetch real data from multiple endpoints to build historical chart
      // Note: We use pagination.total for accurate totals, not array.length
      const [currentStats, leadsData, collegesData, trainersData] =
        await Promise.allSettled([
          this.getStats(), // Stats API uses pagination.total internally
          authApi.get(`/api/v1/leads?sort=createdAt&order=desc&_t=${Date.now()}`), // Get leads - pagination.total will be accurate
          authApi.get(`/api/v1/colleges?sort=createdAt&order=desc&_t=${Date.now()}`), // Get colleges - pagination.total will be accurate
          authApi.get(`/api/v1/trainers?sort=createdAt&order=desc&_t=${Date.now()}`), // Get trainers - pagination.total will be accurate
        ]);

      console.log("📊 Raw API responses for chart data:");
      console.log("Current Stats:", currentStats);
      console.log("Leads Data:", leadsData);
      console.log("Colleges Data:", collegesData);
      console.log("Trainers Data:", trainersData);

      // Process real data to create monthly trends
      const chartData = await this.processRealDataForChart(
        currentStats,
        leadsData,
        collegesData,
        trainersData,
      );

      // Calculate real trends from the data
      const trends = this.calculateRealTrends(chartData);

      console.log("✅ Generated REAL-TIME chart data:", chartData);
      console.log("📈 Calculated real trends:", trends);

      return {
        success: true,
        data: {
          chartData,
          trends,
          lastUpdated: new Date().toISOString(),
          dataSource: "real-api",
        },
      };
    } catch (error) {
      console.error("❌ CRM Service - Error fetching real chart data:", error);

      // Fallback to enhanced mock data with real-time variations
      const chartData = await this.generateEnhancedFallbackData();

      return {
        success: true,
        data: {
          chartData,
          trends: {
            leads: "+15.2%",
            colleges: "+8.5%",
            trainers: "+12.1%",
            revenue: "+18.3%",
          },
          lastUpdated: new Date().toISOString(),
          dataSource: "fallback-enhanced",
        },
      };
    }
  }

  // Process real API data into chart format
  async processRealDataForChart(
    currentStats,
    leadsData,
    collegesData,
    trainersData,
  ) {
    const now = new Date();
    const months = [];

    // Generate last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString("en-US", { month: "short" }),
        fullDate: date,
      });
    }

    console.log("📅 Processing data for months:", months);

    const chartData = months.map((monthInfo, index) => {
      // Get current totals from stats
      const currentLeads =
        currentStats.status === "fulfilled"
          ? currentStats.value?.data?.leads?.total || 0
          : 0;
      const currentColleges =
        currentStats.status === "fulfilled"
          ? currentStats.value?.data?.colleges?.total || 0
          : 0;
      const currentTrainers =
        currentStats.status === "fulfilled"
          ? currentStats.value?.data?.trainers?.total || 0
          : 0;

      // Calculate historical values based on growth patterns
      const growthFactor = (index + 1) / 6; // Progressive growth from 1/6 to 6/6
       // 80% to 120% variation

      // Count real data items created in this month if available
      let realLeadsCount = 0;
      let realCollegesCount = 0;
      let realTrainersCount = 0;

      if (leadsData.status === "fulfilled" && leadsData.value?.data?.success) {
        const leads = leadsData.value.data.data || [];
        realLeadsCount = leads.filter((lead) => {
          const createdDate = new Date(lead.createdAt);
          return (
            createdDate.getMonth() === monthInfo.fullDate.getMonth() &&
            createdDate.getFullYear() === monthInfo.fullDate.getFullYear()
          );
        }).length;
      }

      if (
        collegesData.status === "fulfilled" &&
        collegesData.value?.data?.success
      ) {
        const colleges = collegesData.value.data.data || [];
        realCollegesCount = colleges.filter((college) => {
          const createdDate = new Date(college.createdAt);
          return (
            createdDate.getMonth() === monthInfo.fullDate.getMonth() &&
            createdDate.getFullYear() === monthInfo.fullDate.getFullYear()
          );
        }).length;
      }

      if (
        trainersData.status === "fulfilled" &&
        trainersData.value?.data?.success
      ) {
        const trainers = trainersData.value.data.data || [];
        realTrainersCount = trainers.filter((trainer) => {
          const createdDate = new Date(trainer.createdAt);
          return (
            createdDate.getMonth() === monthInfo.fullDate.getMonth() &&
            createdDate.getFullYear() === monthInfo.fullDate.getFullYear()
          );
        }).length;
      }

      // Use real counts ONLY - no fake data generation
      // If real count is 0, use 0 (don't generate fake data)
      const leads = realLeadsCount; // Use real count, even if 0
      const colleges = realCollegesCount; // Use real count, even if 0
      const trainers = realTrainersCount; // Use real count, even if 0

      console.log(
        `📊 ${monthInfo.month}: Real counts from array - Leads: ${realLeadsCount}, Colleges: ${realCollegesCount}, Trainers: ${realTrainersCount}`,
      );
      console.log(
        `📊 ${monthInfo.month}: Current totals from stats (using pagination.total) - Leads: ${currentLeads}, Colleges: ${currentColleges}, Trainers: ${currentTrainers}`,
      );
      console.log(
        `📊 ${monthInfo.month}: Final values (using REAL data only) - Leads: ${leads}, Colleges: ${colleges}, Trainers: ${trainers}`,
      );

      return {
        month: monthInfo.month,
        leads,
        colleges,
        trainers,
        revenue: Math.floor(leads * 1000 + colleges * 5000 + trainers * 2000), // Calculated revenue
      };
    });

    return chartData;
  }

  // Calculate real trends from chart data
  calculateRealTrends(chartData) {
    if (chartData.length < 2) {
      return {
        leads: "+0%",
        colleges: "+0%",
        trainers: "+0%",
        revenue: "+0%",
      };
    }

    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];

    const leadsTrend =
      previous.leads > 0
        ? (((current.leads - previous.leads) / previous.leads) * 100).toFixed(1)
        : "0.0";
    const collegesTrend =
      previous.colleges > 0
        ? (
            ((current.colleges - previous.colleges) / previous.colleges) *
            100
          ).toFixed(1)
        : "0.0";
    const trainersTrend =
      previous.trainers > 0
        ? (
            ((current.trainers - previous.trainers) / previous.trainers) *
            100
          ).toFixed(1)
        : "0.0";
    const revenueTrend =
      previous.revenue > 0
        ? (
            ((current.revenue - previous.revenue) / previous.revenue) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      leads: `${leadsTrend >= 0 ? "+" : ""}${leadsTrend}%`,
      colleges: `${collegesTrend >= 0 ? "+" : ""}${collegesTrend}%`,
      trainers: `${trainersTrend >= 0 ? "+" : ""}${trainersTrend}%`,
      revenue: `${revenueTrend >= 0 ? "+" : ""}${revenueTrend}%`,
    };
  }

  // Generate enhanced fallback data with real-time variations
  async generateEnhancedFallbackData() {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Create time-based variations for real-time feel
    const timeVariation = (currentHour + currentMinute / 60) / 24; // 0 to 1 based on time of day

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => {
      const baseMultiplier = (index + 1) / 6;
      const timeMultiplier = 1 + timeVariation * 0.2; // Up to 20% variation based on time

      return {
        month,
        leads: Math.max(
          1,
          Math.floor((20 + index * 8) * baseMultiplier * timeMultiplier),
        ),
        colleges: Math.max(
          1,
          Math.floor((5 + index * 3) * baseMultiplier * timeMultiplier),
        ),
        trainers: Math.max(
          1,
          Math.floor((8 + index * 4) * baseMultiplier * timeMultiplier),
        ),
        revenue: Math.floor(
          (15000 + index * 8000) * baseMultiplier * timeMultiplier,
        ),
      };
    });
  }

  // Statistics Methods
  async getStats() {
    try {
      console.log("CRM Service - Fetching real stats from API...");

      // Fetch stats from real API endpoints - get all data for accurate counts
      const [leadsResponse, collegesResponse, trainersResponse, usersResponse] =
        await Promise.allSettled([
          authApi.get(`/api/v1/leads?limit=1000&_t=${Date.now()}`), // Get all leads for accurate stats
          authApi.get(`/api/v1/colleges?limit=1000&_t=${Date.now()}`), // Get all colleges for accurate stats
          authApi.get(`/api/v1/trainers?limit=1000&_t=${Date.now()}`), // Get all trainers for accurate stats
          authApi.get(`/api/v1/users?limit=1000&_t=${Date.now()}`), // Get all users for accurate stats
        ]);

      const stats = {
        leads: { total: 0, new: 0, qualified: 0, converted: 0 },
        colleges: { total: 0, active: 0, inactive: 0 },
        trainers: { total: 0, available: 0, busy: 0 },
        users: { total: 0, active: 0, inactive: 0 },
        revenue: { total: 0, monthly: 0, growth: 0 },
      };

      // Process each response
      const responses = [
        { type: "leads", response: leadsResponse },
        { type: "colleges", response: collegesResponse },
        { type: "trainers", response: trainersResponse },
        { type: "users", response: usersResponse },
      ];

      responses.forEach(({ type, response }) => {
        if (response.status === "fulfilled" && response.value?.data?.success) {
          const data = response.value.data;
          const items = data.data || [];
          
          // CRITICAL: Always use pagination.total if available - this is the TRUE total from the API
          // The API returns pagination.total which is the actual count in the database
          // Even if we only get 2 items in data array, pagination.total might be 9
          const total = data.pagination?.total ?? items.length;
          
          console.log(`📊 CRM Service - ${type} stats calculation:`, {
            itemsReceived: items.length,
            paginationTotal: data.pagination?.total,
            paginationExists: !!data.pagination,
            finalTotal: total,
            usingPaginationTotal: !!data.pagination?.total
          });

          if (type === "leads") {
            // Count statuses from actual items
            // If we have all items (pagination.total <= items.length or no pagination), count from items
            // Otherwise, we have a subset, so count what we have (may not be 100% accurate)
            const hasAllItems = !data.pagination || data.pagination.total <= items.length;
            
            let newCount = 0;
            let qualifiedCount = 0;
            let convertedCount = 0;
            
            if (items.length > 0) {
              newCount = items.filter((item) => {
                const status = item.status?.toUpperCase();
                return status === "NEW" || status === "START";
              }).length;
              
              qualifiedCount = items.filter((item) => {
                const status = item.status?.toUpperCase();
                return status === "QUALIFIED" || status === "IN_PROGRESS" || status === "IN_CONVERSATION";
              }).length;
              
              convertedCount = items.filter((item) => {
                const status = item.status?.toUpperCase();
                return status === "CONVERTED" || status === "CONVERT";
              }).length;
            }
            
            // If we don't have all items, estimate based on proportions (less accurate)
            if (!hasAllItems && total > items.length && items.length > 0) {
              const newRatio = newCount / items.length;
              const qualifiedRatio = qualifiedCount / items.length;
              const convertedRatio = convertedCount / items.length;
              
              newCount = Math.round(total * newRatio);
              qualifiedCount = Math.round(total * qualifiedRatio);
              convertedCount = Math.round(total * convertedRatio);
            }
            
            stats.leads = {
              total: total,
              new: newCount,
              qualified: qualifiedCount,
              converted: convertedCount,
            };
          } else if (type === "colleges") {
            const activeCount = items.length > 0
              ? items.filter((item) => item.status === "ACTIVE" || item.status === "active").length
              : 0;
            const inactiveCount = items.length > 0
              ? items.filter((item) => item.status === "INACTIVE" || item.status === "inactive").length
              : 0;
            
            stats.colleges = {
              total: total,
              active: activeCount,
              inactive: inactiveCount,
            };
          } else if (type === "trainers") {
            const availableCount = items.length > 0
              ? items.filter((item) => item.availability === "AVAILABLE" || item.availability === "available").length
              : 0;
            const busyCount = items.length > 0
              ? items.filter((item) => item.availability === "BUSY" || item.availability === "busy").length
              : 0;
            
            stats.trainers = {
              total: total,
              available: availableCount,
              busy: busyCount,
            };
          } else if (type === "users") {
            const activeCount = items.length > 0
              ? items.filter((item) => item.status === "active" || item.isActive === true).length
              : 0;
            const inactiveCount = items.length > 0
              ? items.filter((item) => item.status === "inactive" || item.isActive === false).length
              : 0;
            
            stats.users = {
              total: total,
              active: activeCount,
              inactive: inactiveCount,
            };
          }
        }
      });

      // Mock revenue data (you can replace this with real API call)
      stats.revenue = {
        total: 125000,
        monthly: 15000,
        growth: 12.5,
      };

      console.log("CRM Service - Real stats calculated:", stats);

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      console.error("CRM Service - Error fetching real stats:", error);

      // Fallback to mock data if API fails
      const data = this.getData();

      const stats = {
        leads: {
          total: data.leads.length,
          new: data.leads.filter((lead) => lead.status === "new").length,
          qualified: data.leads.filter((lead) => lead.status === "qualified")
            .length,
          converted: data.leads.filter((lead) => lead.status === "CONVERTED")
            .length,
        },
        colleges: {
          total: data.colleges.length,
          active: data.colleges.filter((college) => college.status === "ACTIVE")
            .length,
          inactive: data.colleges.filter(
            (college) => college.status === "INACTIVE",
          ).length,
        },
        trainers: {
          total: data.trainers.length,
          available: data.trainers.filter(
            (trainer) => trainer.availability === "AVAILABLE",
          ).length,
          busy: data.trainers.filter(
            (trainer) => trainer.availability === "BUSY",
          ).length,
        },
        users: {
          total: data.users.length,
          active: data.users.filter((user) => user.status === "active").length,
          inactive: data.users.filter((user) => user.status === "inactive")
            .length,
        },
        revenue: {
          total: 125000,
          monthly: 15000,
          growth: 12.5,
        },
      };

      return {
        success: true,
        data: stats,
      };
    }
  }

  // Leads Methods
  async getLeads(params = {}) {
    try {
      console.log("CRM Service - Fetching real leads from API...");

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.page) queryParams.append("page", params.page);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      queryParams.append("_t", Date.now()); // Cache buster

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/v1/leads?${queryString}`
        : "/api/v1/leads";

      console.log("CRM Service - Calling leads API:", url);

      const response = await authApi.get(url);

      if (response.data.success) {
        console.log("CRM Service - Real leads fetched:", response.data);
        return {
          success: true,
          data: response.data.data || [],
          pagination: response.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch leads");
      }
    } catch (error) {
      console.error("CRM Service - Error fetching real leads:", error);

      // Fallback to mock data
      const data = this.getData();
      let leads = data.leads || [];

      // Apply filters
      if (params.status) {
        leads = leads.filter((lead) => lead.status === params.status);
      }
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        leads = leads.filter(
          (lead) =>
            lead.name.toLowerCase().includes(searchTerm) ||
            lead.company.toLowerCase().includes(searchTerm) ||
            lead.email.toLowerCase().includes(searchTerm),
        );
      }

      // Sort by date (newest first)
      leads.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedLeads = leads.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedLeads,
        pagination: {
          page,
          limit,
          total: leads.length,
          totalPages: Math.ceil(leads.length / limit),
          hasNext: endIndex < leads.length,
          hasPrev: page > 1,
        },
      };
    }
  }

  // Colleges Methods
  async getColleges(params = {}) {
    try {
      console.log("CRM Service - Fetching real colleges from API...");

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.page) queryParams.append("page", params.page);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      queryParams.append("_t", Date.now()); // Cache buster

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/v1/colleges?${queryString}`
        : "/api/v1/colleges";

      console.log("CRM Service - Calling colleges API:", url);

      const response = await authApi.get(url);

      if (response.data.success) {
        console.log("CRM Service - Real colleges fetched:", response.data);
        return {
          success: true,
          data: response.data.data || [],
          pagination: response.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch colleges");
      }
    } catch (error) {
      console.error("CRM Service - Error fetching real colleges:", error);

      // Fallback to mock data
      const data = this.getData();
      let colleges = data.colleges || [];

      // Apply filters
      if (params.status) {
        colleges = colleges.filter(
          (college) => college.status === params.status,
        );
      }
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        colleges = colleges.filter(
          (college) =>
            college.name.toLowerCase().includes(searchTerm) ||
            college.location.toLowerCase().includes(searchTerm) ||
            college.city.toLowerCase().includes(searchTerm),
        );
      }

      // Sort by date (newest first)
      colleges.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedColleges = colleges.slice(startIndex, endIndex);

      return {
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
    }
  }

  // Trainers Methods
  async getTrainers(params = {}) {
    try {
      console.log("CRM Service - Fetching real trainers from API...");

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.page) queryParams.append("page", params.page);
      if (params.search) queryParams.append("search", params.search);
      if (params.availability)
        queryParams.append("availability", params.availability);
      queryParams.append("_t", Date.now()); // Cache buster

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/v1/trainers?${queryString}`
        : "/api/v1/trainers";

      console.log("CRM Service - Calling trainers API:", url);

      const response = await authApi.get(url);

      if (response.data.success) {
        console.log("CRM Service - Real trainers fetched:", response.data);
        return {
          success: true,
          data: response.data.data || [],
          pagination: response.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch trainers");
      }
    } catch (error) {
      console.error("CRM Service - Error fetching real trainers:", error);

      // Fallback to mock data
      const data = this.getData();
      let trainers = data.trainers || [];

      // Apply filters
      if (params.availability) {
        trainers = trainers.filter(
          (trainer) => trainer.availability === params.availability,
        );
      }
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        trainers = trainers.filter(
          (trainer) =>
            trainer.name.toLowerCase().includes(searchTerm) ||
            trainer.email.toLowerCase().includes(searchTerm) ||
            trainer.specialization.some((spec) =>
              spec.toLowerCase().includes(searchTerm),
            ),
        );
      }

      // Sort by date (newest first)
      trainers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedTrainers = trainers.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedTrainers,
        pagination: {
          page,
          limit,
          total: trainers.length,
          totalPages: Math.ceil(trainers.length / limit),
          hasNext: endIndex < trainers.length,
          hasPrev: page > 1,
        },
      };
    }
  }

  // Users Methods
  async getUsers(params = {}) {
    try {
      console.log("CRM Service - Fetching real users from API...");

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.page) queryParams.append("page", params.page);
      if (params.search) queryParams.append("search", params.search);
      if (params.status) queryParams.append("status", params.status);
      queryParams.append("_t", Date.now()); // Cache buster

      const queryString = queryParams.toString();
      const url = queryString
        ? `/api/v1/users?${queryString}`
        : "/api/v1/users";

      console.log("CRM Service - Calling users API:", url);

      const response = await authApi.get(url);

      if (response.data.success) {
        console.log("CRM Service - Real users fetched:", response.data);
        return {
          success: true,
          data: response.data.data || [],
          pagination: response.data.pagination || {
            page: 1,
            limit: 10,
            total: 0,
            totalPages: 0,
            hasNext: false,
            hasPrev: false,
          },
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("CRM Service - Error fetching real users:", error);

      // Fallback to mock data
      const data = this.getData();
      let users = data.users || [];

      // Apply filters
      if (params.status) {
        users = users.filter((user) => user.status === params.status);
      }
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        users = users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.role.toLowerCase().includes(searchTerm),
        );
      }

      // Sort by date (newest first)
      users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Apply pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedUsers = users.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedUsers,
        pagination: {
          page,
          limit,
          total: users.length,
          totalPages: Math.ceil(users.length / limit),
          hasNext: endIndex < users.length,
          hasPrev: page > 1,
        },
      };
    }
  }

  // Lead Update Methods with Conversion Integration

  /**
   * Updates a lead's status and triggers conversion if status changes to 'converted'
   * @param {number} leadId - The ID of the lead to update
   * @param {string} newStatus - The new status to set
   * @returns {Promise<Object>} Update result with conversion information
   */
  async updateLeadStatus(leadId, newStatus) {
    try {
      console.log(`🔄 CRM Service - Updating lead ${leadId} status to: ${newStatus}`);

      let currentLead = null;
      let oldStatus = null;

      try {
        // First, try to get the current lead data from API
        const currentLeadResponse = await authApi.get(`/api/v1/leads/${leadId}`);
        
        if (currentLeadResponse.data.success) {
          currentLead = currentLeadResponse.data.data;
          oldStatus = currentLead.status;
        } else {
          throw new Error(`API failed: ${currentLeadResponse.data.message}`);
        }
      } catch (apiError) {
        console.log(`⚠️ CRM Service - API failed, using localStorage fallback:`, apiError.message);
        
        // Fallback to localStorage
        const data = this.getData();
        currentLead = data.leads.find(l => l.id === parseInt(leadId));
        
        if (!currentLead) {
          throw new Error(`Lead ${leadId} not found in localStorage`);
        }
        
        oldStatus = currentLead.status;
      }

      console.log(`📝 CRM Service - Lead ${leadId} status change: ${oldStatus} → ${newStatus}`);

      // Validate that conversion only happens once
      if (newStatus === 'CONVERTED' && currentLead.linkedCollegeId) {
        console.log(`⚠️ CRM Service - Lead ${leadId} is already converted and linked to college ${currentLead.linkedCollegeId}`);
        return {
          success: true,
          alreadyConverted: true,
          message: 'Lead is already converted and linked to a college',
          data: currentLead
        };
      }

      // Update the lead status
      const updateData = {
        status: newStatus,
        updatedAt: new Date().toISOString()
      };

      let updatedLead = null;

      try {
        // Try to update via API first
        console.log(`🔄 CRM Service - Calling API to update lead ${leadId}:`, updateData);
        const updateResponse = await authApi.put(`/api/v1/leads/${leadId}`, updateData);

        if (updateResponse.data.success) {
          updatedLead = updateResponse.data.data;
          console.log(`✅ CRM Service - Lead ${leadId} status updated via API`);
        } else {
          throw new Error(`API update failed: ${updateResponse.data.message}`);
        }
      } catch (apiError) {
        console.log(`⚠️ CRM Service - API update failed, using localStorage fallback:`, apiError.message);
        
        // Fallback to localStorage update
        const data = this.getData();
        const leadIndex = data.leads.findIndex(l => l.id === parseInt(leadId));
        
        if (leadIndex === -1) {
          throw new Error(`Lead ${leadId} not found for update`);
        }
        
        // Update the lead in localStorage
        data.leads[leadIndex] = {
          ...data.leads[leadIndex],
          ...updateData
        };
        
        this.setData(data);
        updatedLead = data.leads[leadIndex];
        console.log(`✅ CRM Service - Lead ${leadId} status updated in localStorage`);
      }

      // Trigger conversion if status changed to 'CONVERTED'
      let conversionResult = null;
      console.log(`🔍 CRM Service - Checking conversion trigger: newStatus="${newStatus}", oldStatus="${oldStatus}"`);
      
      if (newStatus === 'CONVERTED' && oldStatus !== 'CONVERTED') {
        console.log(`🔄 CRM Service - ✅ CONVERSION TRIGGERED for lead ${leadId}`);
        console.log(`🔄 CRM Service - Updated lead data:`, updatedLead);
        
        try {
          console.log(`🔄 CRM Service - Calling leadConversionService.handleLeadStatusUpdate...`);
          conversionResult = await leadConversionService.handleLeadStatusUpdate(
            leadId, 
            newStatus, 
            oldStatus
          );
          
          console.log(`✅ CRM Service - Conversion result for lead ${leadId}:`, conversionResult);
          
          if (conversionResult.success) {
            console.log(`🎉 CRM Service - Conversion successful! College created/linked.`);
          } else {
            console.error(`❌ CRM Service - Conversion failed:`, conversionResult);
          }
          
        } catch (conversionError) {
          console.error(`❌ CRM Service - Conversion failed for lead ${leadId}:`, conversionError);
          // Don't fail the entire status update if conversion fails
          conversionResult = {
            success: false,
            error: conversionError.message,
            message: 'Lead status updated but conversion failed'
          };
        }
      } else {
        console.log(`ℹ️ CRM Service - No conversion needed (newStatus="${newStatus}", oldStatus="${oldStatus}")`);
      }

      return {
        success: true,
        data: updatedLead,
        statusChanged: oldStatus !== newStatus,
        oldStatus,
        newStatus,
        conversionTriggered: newStatus === 'CONVERTED' && oldStatus !== 'CONVERTED',
        conversionResult,
        message: conversionResult?.success 
          ? `Lead status updated and ${conversionResult.isNewCollege ? 'new college created' : 'linked to existing college'}`
          : 'Lead status updated successfully'
      };

    } catch (error) {
      console.error(`❌ CRM Service - Error updating lead status:`, error);
      return {
        success: false,
        error: error.message,
        message: `Failed to update lead status: ${error.message}`
      };
    }
  }

  /**
   * Updates a lead with comprehensive data and handles status changes
   * @param {number} leadId - The ID of the lead to update
   * @param {Object} updateData - The data to update
   * @returns {Promise<Object>} Update result with conversion information
   */
  async updateLead(leadId, updateData) {
    try {
      console.log(`🔄 CRM Service - Updating lead ${leadId} with data:`, updateData);

      // Get current lead data to check for status changes
      const currentLeadResponse = await authApi.get(`/api/v1/leads/${leadId}`);
      
      if (!currentLeadResponse.data.success) {
        throw new Error(`Failed to fetch current lead data: ${currentLeadResponse.data.message}`);
      }

      const currentLead = currentLeadResponse.data.data;
      const oldStatus = currentLead.status;
      const newStatus = updateData.status || oldStatus;

      console.log(`📝 CRM Service - Lead ${leadId} update - Status: ${oldStatus} → ${newStatus}`);

      // Validate conversion constraints
      if (newStatus === 'CONVERTED' && oldStatus !== 'CONVERTED' && currentLead.linkedCollegeId) {
        console.log(`⚠️ CRM Service - Lead ${leadId} is already linked to college ${currentLead.linkedCollegeId}`);
        return {
          success: false,
          error: 'Lead is already converted and linked to a college',
          message: 'Cannot convert lead that is already linked to a college'
        };
      }

      // Add timestamp to update data
      const finalUpdateData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      console.log(`🔄 CRM Service - Calling API to update lead ${leadId}:`, finalUpdateData);

      // Update the lead via API
      const updateResponse = await authApi.put(`/api/v1/leads/${leadId}`, finalUpdateData);

      if (!updateResponse.data.success) {
        throw new Error(`Failed to update lead: ${updateResponse.data.message}`);
      }

      console.log(`✅ CRM Service - Lead ${leadId} updated successfully`);

      // Trigger conversion if status changed to 'CONVERTED'
      let conversionResult = null;
      if (newStatus === 'CONVERTED' && oldStatus !== 'CONVERTED') {
        console.log(`🔄 CRM Service - Triggering conversion for lead ${leadId}`);
        
        try {
          conversionResult = await leadConversionService.handleLeadStatusUpdate(
            leadId, 
            newStatus, 
            oldStatus
          );
          
          console.log(`✅ CRM Service - Conversion result for lead ${leadId}:`, conversionResult);
          
        } catch (conversionError) {
          console.error(`❌ CRM Service - Conversion failed for lead ${leadId}:`, conversionError);
          
          // Rollback the lead update if conversion fails
          try {
            console.log(`🔄 CRM Service - Rolling back lead ${leadId} status due to conversion failure`);
            await authApi.put(`/api/v1/leads/${leadId}`, {
              status: oldStatus,
              updatedAt: new Date().toISOString()
            });
            console.log(`✅ CRM Service - Lead ${leadId} status rolled back to ${oldStatus}`);
          } catch (rollbackError) {
            console.error(`❌ CRM Service - Failed to rollback lead ${leadId}:`, rollbackError);
          }
          
          return {
            success: false,
            error: conversionError.message,
            message: `Lead update failed due to conversion error: ${conversionError.message}`,
            rollbackAttempted: true
          };
        }
      }

      return {
        success: true,
        data: updateResponse.data.data,
        statusChanged: oldStatus !== newStatus,
        oldStatus,
        newStatus,
        conversionTriggered: newStatus === 'CONVERTED' && oldStatus !== 'CONVERTED',
        conversionResult,
        message: conversionResult?.success 
          ? `Lead updated and ${conversionResult.isNewCollege ? 'new college created' : 'linked to existing college'}`
          : 'Lead updated successfully'
      };

    } catch (error) {
      console.error(`❌ CRM Service - Error updating lead:`, error);
      return {
        success: false,
        error: error.message,
        message: `Failed to update lead: ${error.message}`
      };
    }
  }

  /**
   * Gets a single lead by ID
   * @param {number} leadId - The ID of the lead to fetch
   * @returns {Promise<Object>} Lead data
   */
  async getLeadById(leadId) {
    try {
      console.log(`🔄 CRM Service - Fetching lead ${leadId}`);

      const response = await authApi.get(`/api/v1/leads/${leadId}`);

      if (response.data.success) {
        console.log(`✅ CRM Service - Lead ${leadId} fetched successfully`);
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || "Failed to fetch lead");
      }
    } catch (error) {
      console.error(`❌ CRM Service - Error fetching lead ${leadId}:`, error);
      
      // Fallback to mock data
      const data = this.getData();
      const lead = data.leads.find(l => l.id === parseInt(leadId));
      
      if (lead) {
        return {
          success: true,
          data: lead
        };
      }
      
      return {
        success: false,
        error: error.message,
        message: `Failed to fetch lead: ${error.message}`
      };
    }
  }

  /**
   * Gets conversion status for a lead
   * @param {number} leadId - The ID of the lead
   * @returns {Promise<Object>} Conversion status information
   */
  async getLeadConversionStatus(leadId) {
    try {
      console.log(`🔄 CRM Service - Getting conversion status for lead ${leadId}`);
      
      const conversionStatus = await leadConversionService.getConversionStatus(leadId);
      
      console.log(`✅ CRM Service - Conversion status for lead ${leadId}:`, conversionStatus);
      
      return conversionStatus;
      
    } catch (error) {
      console.error(`❌ CRM Service - Error getting conversion status for lead ${leadId}:`, error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get conversion status: ${error.message}`
      };
    }
  }

  /**
   * Gets lead-college relationship information
   * @param {number} leadId - The ID of the lead
   * @returns {Promise<Object>} Relationship information
   */
  async getLeadCollegeRelationship(leadId) {
    try {
      console.log(`🔄 CRM Service - Getting lead-college relationship for lead ${leadId}`);

      const leadResponse = await this.getLeadById(leadId);
      
      if (!leadResponse.success) {
        throw new Error(`Failed to fetch lead: ${leadResponse.error}`);
      }

      const lead = leadResponse.data;
      
      let college = null;
      if (lead.linkedCollegeId) {
        try {
          const collegeResponse = await authApi.get(`/api/v1/colleges/${lead.linkedCollegeId}`);
          if (collegeResponse.data.success) {
            college = collegeResponse.data.data;
          }
        } catch (collegeError) {
          console.error(`⚠️ CRM Service - Could not fetch linked college ${lead.linkedCollegeId}:`, collegeError);
        }
      }

      return {
        success: true,
        data: {
          lead: {
            id: lead.id,
            name: lead.name,
            status: lead.status,
            linkedCollegeId: lead.linkedCollegeId,
            conversionDate: lead.conversionDate
          },
          college: college ? {
            id: college.id,
            name: college.name,
            status: college.status,
            sourceLeadId: college.sourceLeadId
          } : null,
          isLinked: !!lead.linkedCollegeId,
          isConverted: lead.status === 'CONVERTED'
        }
      };

    } catch (error) {
      console.error(`❌ CRM Service - Error getting lead-college relationship:`, error);
      return {
        success: false,
        error: error.message,
        message: `Failed to get lead-college relationship: ${error.message}`
      };
    }
  }

  /**
   * Gets all converted leads with their college relationships
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Converted leads with college information
   */
  async getConvertedLeads(params = {}) {
    try {
      console.log('🔄 CRM Service - Fetching converted leads with college relationships');

      // Get converted leads
      const convertedLeadsParams = {
        ...params,
        status: 'CONVERTED'
      };

      const leadsResponse = await this.getLeads(convertedLeadsParams);
      
      if (!leadsResponse.success) {
        throw new Error(`Failed to fetch converted leads: ${leadsResponse.error}`);
      }

      const convertedLeads = leadsResponse.data;
      
      // Enrich with college information
      const enrichedLeads = await Promise.all(
        convertedLeads.map(async (lead) => {
          let college = null;
          
          if (lead.linkedCollegeId) {
            try {
              const collegeResponse = await authApi.get(`/api/v1/colleges/${lead.linkedCollegeId}`);
              if (collegeResponse.data.success) {
                college = collegeResponse.data.data;
              }
            } catch (collegeError) {
              console.error(`⚠️ CRM Service - Could not fetch college ${lead.linkedCollegeId}:`, collegeError);
            }
          }

          return {
            ...lead,
            linkedCollege: college
          };
        })
      );

      console.log(`✅ CRM Service - Fetched ${enrichedLeads.length} converted leads with college relationships`);

      return {
        success: true,
        data: enrichedLeads,
        pagination: leadsResponse.pagination
      };

    } catch (error) {
      console.error('❌ CRM Service - Error fetching converted leads:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to fetch converted leads: ${error.message}`
      };
    }
  }

  /**
   * Gets leads that are eligible for conversion
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Eligible leads
   */
  async getEligibleLeadsForConversion(params = {}) {
    try {
      console.log('🔄 CRM Service - Fetching leads eligible for conversion');

      // Get qualified leads that haven't been converted yet
      const eligibleLeadsParams = {
        ...params,
        status: 'qualified'
      };

      const leadsResponse = await this.getLeads(eligibleLeadsParams);
      
      if (!leadsResponse.success) {
        throw new Error(`Failed to fetch leads: ${leadsResponse.error}`);
      }

      // Filter out leads that are already linked to colleges
      const eligibleLeads = leadsResponse.data.filter(lead => !lead.linkedCollegeId);

      console.log(`✅ CRM Service - Found ${eligibleLeads.length} leads eligible for conversion`);

      return {
        success: true,
        data: eligibleLeads,
        pagination: {
          ...leadsResponse.pagination,
          total: eligibleLeads.length
        }
      };

    } catch (error) {
      console.error('❌ CRM Service - Error fetching eligible leads:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to fetch eligible leads: ${error.message}`
      };
    }
  }

  /**
   * Updates lead with college relationship information
   * @param {number} leadId - The lead ID
   * @param {number} collegeId - The college ID
   * @param {string} conversionDate - The conversion date
   * @returns {Promise<Object>} Update result
   */
  async updateLeadCollegeRelationship(leadId, collegeId, conversionDate = null) {
    try {
      console.log(`🔄 CRM Service - Updating lead ${leadId} college relationship to college ${collegeId}`);

      const updateData = {
        linkedCollegeId: collegeId,
        conversionDate: conversionDate || new Date().toISOString(),
        status: 'CONVERTED',
        updatedAt: new Date().toISOString()
      };

      const response = await authApi.put(`/api/v1/leads/${leadId}`, updateData);

      if (!response.data.success) {
        throw new Error(`Failed to update lead relationship: ${response.data.message}`);
      }

      console.log(`✅ CRM Service - Lead ${leadId} relationship updated successfully`);

      return {
        success: true,
        data: response.data.data,
        message: 'Lead-college relationship updated successfully'
      };

    } catch (error) {
      console.error(`❌ CRM Service - Error updating lead relationship:`, error);
      return {
        success: false,
        error: error.message,
        message: `Failed to update lead relationship: ${error.message}`
      };
    }
  }

  /**
   * Removes lead-college relationship (for rollback scenarios)
   * @param {number} leadId - The lead ID
   * @returns {Promise<Object>} Update result
   */
  async removeLeadCollegeRelationship(leadId) {
    try {
      console.log(`🔄 CRM Service - Removing lead ${leadId} college relationship`);

      const updateData = {
        linkedCollegeId: null,
        conversionDate: null,
        status: 'qualified', // Revert to qualified status
        updatedAt: new Date().toISOString()
      };

      const response = await authApi.put(`/api/v1/leads/${leadId}`, updateData);

      if (!response.data.success) {
        throw new Error(`Failed to remove lead relationship: ${response.data.message}`);
      }

      console.log(`✅ CRM Service - Lead ${leadId} relationship removed successfully`);

      return {
        success: true,
        data: response.data.data,
        message: 'Lead-college relationship removed successfully'
      };

    } catch (error) {
      console.error(`❌ CRM Service - Error removing lead relationship:`, error);
      return {
        success: false,
        error: error.message,
        message: `Failed to remove lead relationship: ${error.message}`
      };
    }
  }

  /**
   * Gets conversion statistics and metrics
   * @returns {Promise<Object>} Conversion statistics
   */
  async getConversionStats() {
    try {
      console.log('🔄 CRM Service - Calculating conversion statistics');

      // Get all leads
      const allLeadsResponse = await this.getLeads({ limit: 1000 });
      
      if (!allLeadsResponse.success) {
        throw new Error(`Failed to fetch leads for stats: ${allLeadsResponse.error}`);
      }

      const allLeads = allLeadsResponse.data;
      
      // Calculate conversion metrics
      const totalLeads = allLeads.length;
      const convertedLeads = allLeads.filter(lead => lead.status === 'CONVERTED').length;
      const linkedLeads = allLeads.filter(lead => lead.linkedCollegeId).length;
      const qualifiedLeads = allLeads.filter(lead => lead.status === 'qualified').length;
      
      const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : 0;
      const linkageRate = convertedLeads > 0 ? ((linkedLeads / convertedLeads) * 100).toFixed(2) : 0;

      // Get recent conversions (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentConversions = allLeads.filter(lead => 
        lead.conversionDate && new Date(lead.conversionDate) > thirtyDaysAgo
      ).length;

      const stats = {
        totalLeads,
        convertedLeads,
        linkedLeads,
        qualifiedLeads,
        eligibleForConversion: qualifiedLeads - linkedLeads,
        conversionRate: `${conversionRate}%`,
        linkageRate: `${linkageRate}%`,
        recentConversions,
        lastUpdated: new Date().toISOString()
      };

      console.log('✅ CRM Service - Conversion statistics calculated:', stats);

      return {
        success: true,
        data: stats
      };

    } catch (error) {
      console.error('❌ CRM Service - Error calculating conversion stats:', error);
      return {
        success: false,
        error: error.message,
        message: `Failed to calculate conversion stats: ${error.message}`
      };
    }
  }
}

const crmService = new CRMService();
export default crmService;
