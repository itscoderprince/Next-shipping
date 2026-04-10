import { NextResponse } from "next/server";
import { LOGIN, USER_DASHBOARD } from "./routes/Website.route";
import { ADMIN_ROUTES } from "./routes/Admin.route";
import { verifyToken } from "./lib/token";

export async function proxy(req) {
  try {
    const pathname = req.nextUrl.pathname;
    const hasToken = req.cookies.has("panda_bees");

    if (!hasToken) {
      if (!pathname.startsWith("/auth")) {
        return NextResponse.redirect(new URL(LOGIN, req.nextUrl));
      }
      return NextResponse.next();
    }

    // Verify token
    const token = req.cookies.get("panda_bees")?.value;

    if (!token || typeof token !== "string") {
      if (pathname.startsWith("/auth")) return NextResponse.next();
      const response = NextResponse.redirect(new URL(LOGIN, req.nextUrl));
      response.cookies.delete("panda_bees");
      return response;
    }

    const payload = await verifyToken(token);

    if (!payload) {
      if (pathname.startsWith("/auth")) return NextResponse.next();
      const response = NextResponse.redirect(new URL(LOGIN, req.nextUrl));
      response.cookies.delete("panda_bees");
      return response;
    }

    const role = payload.role;

    // Prevent logged-in users from accessing auth routes
    if (pathname.startsWith("/auth")) {
      return NextResponse.redirect(
        new URL(
          role === "admin" ? ADMIN_ROUTES.DASHBOARD : USER_DASHBOARD,
          req.nextUrl,
        ),
      );
    }

    // Protect admin routes from non-admins
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(LOGIN, req.nextUrl));
    }

    // Protect user routes from non-users
    if (
      (pathname.startsWith("/my-account") || pathname.startsWith("/user")) &&
      role !== "user"
    ) {
      return NextResponse.redirect(new URL(LOGIN, req.nextUrl));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy Error:", error);
    const pathname = req.nextUrl.pathname;
    if (pathname.startsWith("/auth")) return NextResponse.next();
    return NextResponse.redirect(new URL(LOGIN, req.nextUrl));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*",
    "/user/:path*",
    "/my-account/:path*",
  ],
};
