import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Calendar,
  ChevronDown,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  userRole?: "employee" | "admin";
  userName?: string;
  userAvatar?: string;
  notificationCount?: number;
  onLogout?: () => void;
}

const Header = ({
  userRole = "employee",
  userName = "John Doe",
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  notificationCount = 3,
  onLogout = () => console.log("Logout clicked"),
}: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = userRole === "admin";

  const navigationLinks = [
    { name: "Dashboard", href: "/", icon: null },
    { name: "My Leaves", href: "/leaves", icon: Calendar },
    { name: "Request Leave", href: "/request", icon: FileText },
    ...(isAdmin
      ? [
          { name: "Department", href: "/department", icon: null },
          { name: "Reports", href: "/reports", icon: null },
        ]
      : []),
  ];

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="py-4">
                <div className="px-4 py-2">
                  <h2 className="text-xl font-bold">College LMS</h2>
                </div>
                <nav className="mt-6">
                  <ul className="space-y-2">
                    {navigationLinks.map((link) => (
                      <li key={link.name}>
                        <Link
                          to={link.href}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.icon && <link.icon className="mr-2 h-5 w-5" />}
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">College LMS</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigationLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-gray-700 hover:text-primary font-medium"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side - Notifications and Profile */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
                    variant="destructive"
                  >
                    {notificationCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium">Leave Request Approved</p>
                  <p className="text-sm text-gray-500">
                    Your vacation request for June 10-15 has been approved.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium">New Department Policy</p>
                  <p className="text-sm text-gray-500">
                    There's a new policy regarding remote work arrangements.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Yesterday</p>
                </div>
                <div className="p-3 hover:bg-gray-50 cursor-pointer">
                  <p className="font-medium">Leave Balance Updated</p>
                  <p className="text-sm text-gray-500">
                    Your sick leave balance has been updated.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">3 days ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2 text-center">
                <Button variant="link" size="sm">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="hidden md:inline font-medium">{userName}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
