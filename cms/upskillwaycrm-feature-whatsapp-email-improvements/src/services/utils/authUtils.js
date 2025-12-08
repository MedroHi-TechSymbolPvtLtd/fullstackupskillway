import Cookies from "js-cookie";

// Token keys
const TOKEN_KEY = "upskillway_access_token";
const REFRESH_TOKEN_KEY = "upskillway_refresh_token";
const USER_KEY = "upskillway_user";

// Cookie options
const COOKIE_OPTIONS = {
  secure: false, // Set to false for development to ensure cookies work
  sameSite: "lax", // Changed from strict to lax for better compatibility
  expires: 7, // 7 days
};

const REFRESH_COOKIE_OPTIONS = {
  ...COOKIE_OPTIONS,
  expires: 30, // 30 days
};

export const authUtils = {
  // Access token management
  setToken: (token) => {
    if (token) {
      Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  getToken: () => {
    const cookieToken = Cookies.get(TOKEN_KEY);
    const localToken = localStorage.getItem(TOKEN_KEY);
    const token = cookieToken || localToken;
    return token;
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  // Refresh token management
  setRefreshToken: (refreshToken) => {
    if (refreshToken) {
      try {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken, REFRESH_COOKIE_OPTIONS);
      } catch (error) {
        console.error("Error during refresh token storage:", error);
      }
    }
  },

  getRefreshToken: () => {
    const cookieRefreshToken = Cookies.get(REFRESH_TOKEN_KEY);
    const localRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const refreshToken = cookieRefreshToken || localRefreshToken;
    return refreshToken;
  },

  removeRefreshToken: () => {
    Cookies.remove(REFRESH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // User data management
  setUser: (user) => {
    if (user) {
      const userStr = JSON.stringify(user);
      Cookies.set(USER_KEY, userStr, COOKIE_OPTIONS);
      localStorage.setItem(USER_KEY, userStr);
    }
  },

  getUser: () => {
    const userStr = Cookies.get(USER_KEY) || localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  removeUser: () => {
    Cookies.remove(USER_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Utility
  isAuthenticated: () => {
    return !!(Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY));
  },

  clearAuth: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  clearAll: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    Cookies.remove(USER_KEY);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};
