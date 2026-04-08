"use client"

import * as React from "react"
import {
  LayoutDashboard,
  Layers,
  Package,
  Tag,
  ShoppingCart,
  Users,
  Star,
  Image as ImageIcon,
  Settings2,
} from "lucide-react"

import Image from "next/image"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { ADMIN_ROUTES } from "@/routes/Admin.route"

// Ecommerce Admin specific configuration data
const data = {
  user: {
    name: "Admin User",
    email: "admin@pandabees.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Category",
      url: ADMIN_ROUTES.CATEGORIES,
      icon: Layers,
      isActive: true,
      items: [
        {
          title: "Show All",
          url: ADMIN_ROUTES.CATEGORIES,
        },
        {
          title: "Add New",
          url: `${ADMIN_ROUTES.CATEGORIES}/add`,
        },
      ],
    },
    {
      title: "Product",
      url: ADMIN_ROUTES.PRODUCTS,
      icon: Package,
      items: [
        {
          title: "Show All",
          url: ADMIN_ROUTES.PRODUCTS,
        },
        {
          title: "Add New",
          url: `${ADMIN_ROUTES.PRODUCTS}/add`,
        },
      ],
    },
    {
      title: "Coupons",
      url: ADMIN_ROUTES.COUPONS,
      icon: Tag,
      items: [
        {
          title: "Show All",
          url: ADMIN_ROUTES.COUPONS,
        },
        {
          title: "Add New",
          url: `${ADMIN_ROUTES.COUPONS}/add`,
        },
      ],
    },
    {
      title: "Settings",
      url: ADMIN_ROUTES.SETTINGS,
      icon: Settings2,
      items: [
        {
          title: "General",
          url: ADMIN_ROUTES.SETTINGS,
        },
        {
          title: "Analytics",
          url: ADMIN_ROUTES.ANALYTICS,
        },
      ],
    },
  ],
  management: [
    {
      name: "Orders",
      url: ADMIN_ROUTES.ORDERS,
      icon: ShoppingCart,
    },
    {
      name: "Customers",
      url: ADMIN_ROUTES.CUSTOMERS,
      icon: Users,
    },
    {
      name: "Reviews",
      url: "#",
      icon: Star,
    },
    {
      name: "Media Library",
      url: ADMIN_ROUTES.MEIDA,
      icon: ImageIcon,
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex h-16 shrink-0 items-center justify-center border-b px-2 transition-all duration-300 group-data-[collapsible=icon]:h-12">
        <SidebarMenu className="transition-all duration-300">
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link href={ADMIN_ROUTES.DASHBOARD} className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center">
                <div className="flex aspect-square size-9 shrink-0 items-center justify-center rounded-lg border bg-background shadow-sm hover:ring-1 ring-zinc-200 transition-all">
                  <Image
                    src="/images/favicon.ico"
                    alt="PandaBees"
                    width={28}
                    height={28}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-bold text-lg">PandaBees</span>
                  <span className="truncate text-xs text-muted-foreground font-medium">Administration</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Main Navigation</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href={ADMIN_ROUTES.DASHBOARD}>
                  <LayoutDashboard className="size-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <NavMain items={data.navMain} />
        <NavProjects projects={data.management} label="Management" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
