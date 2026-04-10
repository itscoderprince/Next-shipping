/**
 * ADMIN ROUTES CONFIGURATION
 * 
 * This file contains all the URL paths for the Admin Panel.
 * It is structured to be scalable and easy to maintain.
 */

// Base admin path
const BASE = "/admin";

export const ADMIN_ROUTES = {
  // Core Dashboards
  DASHBOARD: `${BASE}/dashboard`,
  SETTINGS: `${BASE}/settings`,
  ANALYTICS: `${BASE}/analytics`,
  TRASH: `${BASE}/trash`,

  // Module Routes (Structured)
  CATEGORY: {
    SHOW: `${BASE}/category`,
    EDIT: (id) => (id ? `${BASE}/category/edit/${id}` : ""),
  },

  PRODUCT: {
    SHOW: `${BASE}/product`,
    ADD: `${BASE}/product/add`,
    EDIT: (id) => (id ? `${BASE}/product/edit/${id}` : ""),
  },

  MEDIA: {
    SHOW: `${BASE}/media`,
    EDIT: (id) => (id ? `${BASE}/media/edit/${id}` : ""),
  },

  // Customer & Sales
  ORDERS: `${BASE}/orders`,
  CUSTOMERS: `${BASE}/customers`,
  COUPONS: `${BASE}/coupons`,

  // 🟢 COMPATIBILITY ALIASES (to prevent breaking existing code)
  CATEGORIES: `${BASE}/category`,
  PRODUCTS: `${BASE}/product`,
  MEIDA: `${BASE}/media`, // Keeping the typo alias just in case, but mapped to correct path
};

/**
 * FLAT EXPORTS (Recommended for most cases)
 */
export const ADMIN_DASHBOARD = ADMIN_ROUTES.DASHBOARD;
export const ADMIN_TRASH = ADMIN_ROUTES.TRASH;
export const ADMIN_SETTINGS = ADMIN_ROUTES.SETTINGS;
export const ADMIN_ANALYTICS = ADMIN_ROUTES.ANALYTICS;

// Category
export const ADMIN_CATEGORY_SHOW = ADMIN_ROUTES.CATEGORY.SHOW;
export const ADMIN_CATEGORY_EDIT = ADMIN_ROUTES.CATEGORY.EDIT;

// Product
export const ADMIN_PRODUCT_SHOW = ADMIN_ROUTES.PRODUCT.SHOW;
export const ADMIN_PRODUCT_ADD = ADMIN_ROUTES.PRODUCT.ADD;
export const ADMIN_PRODUCT_EDIT = ADMIN_ROUTES.PRODUCT.EDIT;

// Media
export const ADMIN_MEDIA_SHOW = ADMIN_ROUTES.MEDIA.SHOW;
export const ADMIN_MEDIA_EDIT = ADMIN_ROUTES.MEDIA.EDIT;

// Others
export const ADMIN_ORDERS = ADMIN_ROUTES.ORDERS;
export const ADMIN_CUSTOMERS = ADMIN_ROUTES.CUSTOMERS;
export const ADMIN_COUPONS = ADMIN_ROUTES.COUPONS;
