export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  CATEGORIES: "/admin/categories",
  PRODUCTS: "/admin/products",
  COUPONS: "/admin/coupons",
  ORDERS: "/admin/orders",
  CUSTOMERS: "/admin/customers",
  MEIDA: "/admin/media", // Keeping the typo 'MEIDA' as per the user's provided code for consistency
  SETTINGS: "/admin/settings",
  ANALYTICS: "/admin/analytics",
};

// export const ADMIN_DASHBOARD = "/admin/dashboard";

export const ADMIN_MEDIA_SHOW = "/admin/media";
export const ADMIN_MEDIA_EDIT = (id) => (id ? `/admin/media/edit/${id}` : "");
