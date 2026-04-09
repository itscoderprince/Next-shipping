export const ADMIN_ROUTES = {
  DASHBOARD: "/admin/dashboard",
  CATEGORIES: "/admin/category",
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

export const ADMIN_TRASH = "/admin/trash";
export const ADMIN_CATEGORY_EDIT = (id) =>
  id ? `/admin/category/edit/${id}` : "";
