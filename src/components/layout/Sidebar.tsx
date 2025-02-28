import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Calendar,
  FileText,
  Clock,
  BarChart,
  Settings,
  Users,
  HelpCircle,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  userRole?: "employee" | "admin";
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  title: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItem[];
}

const Sidebar = ({
  userRole = "employee",
  collapsed = false,
  onToggleCollapse = () => {},
}: SidebarProps) => {
  const location = useLocation();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({
    reports: false,
    settings: false,
  });

  const employeeNavItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/",
    },
    {
      title: "My Leaves",
      icon: <Calendar className="h-5 w-5" />,
      path: "/my-leaves",
    },
    {
      title: "Request Leave",
      icon: <FileText className="h-5 w-5" />,
      path: "/request-leave",
    },
    {
      title: "Leave History",
      icon: <Clock className="h-5 w-5" />,
      path: "/leave-history",
    },
    {
      title: "Department Calendar",
      icon: <Users className="h-5 w-5" />,
      path: "/department-calendar",
    },
    {
      title: "Help & Support",
      icon: <HelpCircle className="h-5 w-5" />,
      path: "/help",
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/admin",
    },
    {
      title: "Leave Requests",
      icon: <FileText className="h-5 w-5" />,
      path: "/admin/leave-requests",
    },
    {
      title: "Department Calendar",
      icon: <Calendar className="h-5 w-5" />,
      path: "/admin/department-calendar",
    },
    {
      title: "Reports",
      icon: <BarChart className="h-5 w-5" />,
      path: "/admin/reports",
      children: [
        {
          title: "Leave Summary",
          icon: <FileText className="h-4 w-4" />,
          path: "/admin/reports/leave-summary",
        },
        {
          title: "Department Analysis",
          icon: <Users className="h-4 w-4" />,
          path: "/admin/reports/department-analysis",
        },
        {
          title: "Yearly Overview",
          icon: <Calendar className="h-4 w-4" />,
          path: "/admin/reports/yearly-overview",
        },
      ],
    },
    {
      title: "Employees",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/employees",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      path: "/admin/settings",
      children: [
        {
          title: "Leave Types",
          icon: <FileText className="h-4 w-4" />,
          path: "/admin/settings/leave-types",
        },
        {
          title: "Departments",
          icon: <Users className="h-4 w-4" />,
          path: "/admin/settings/departments",
        },
        {
          title: "System Settings",
          icon: <Settings className="h-4 w-4" />,
          path: "/admin/settings/system",
        },
      ],
    },
  ];

  const navItems = userRole === "admin" ? adminNavItems : employeeNavItems;

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div
      className={cn(
        "h-full bg-white border-r flex flex-col transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[250px]",
      )}
    >
      <div className="p-4 border-b flex items-center justify-center h-16">
        {!collapsed ? (
          <div className="font-bold text-xl text-primary">Leave Manager</div>
        ) : (
          <div className="font-bold text-xl text-primary">LM</div>
        )}
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item, index) => {
            if (item.children) {
              return (
                <Collapsible
                  key={index}
                  open={openSubmenus[item.title.toLowerCase()]}
                  onOpenChange={() => toggleSubmenu(item.title.toLowerCase())}
                  className="w-full"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-between px-3 py-2 text-sm font-medium",
                        isActive(item.path)
                          ? "bg-gray-100"
                          : "hover:bg-gray-50",
                      )}
                    >
                      <div className="flex items-center">
                        {item.icon}
                        {!collapsed && (
                          <span className="ml-3">{item.title}</span>
                        )}
                      </div>
                      {!collapsed && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform",
                            openSubmenus[item.title.toLowerCase()] &&
                              "rotate-180",
                          )}
                        />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    {!collapsed && (
                      <div className="pl-8 mt-1 space-y-1">
                        {item.children.map((child, childIndex) => (
                          <Link
                            key={childIndex}
                            to={child.path}
                            className={cn(
                              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                              isActive(child.path)
                                ? "bg-gray-100 text-primary"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                            )}
                          >
                            {child.icon}
                            <span className="ml-3">{child.title}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return collapsed ? (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center justify-center p-3 rounded-md",
                        isActive(item.path)
                          ? "bg-gray-100 text-primary"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      {item.icon}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Link
                key={index}
                to={item.path}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive(item.path)
                    ? "bg-gray-100 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t">
        {collapsed ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            variant="ghost"
            className="w-full flex items-center justify-start text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
