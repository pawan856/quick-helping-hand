import { useState } from "react";
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Settings, 
  Bell,
  Search,
  BarChart3,
  Stethoscope,
  Heart,
  Shield,
  UserCheck,
  Clock,
  Menu,
  X
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: Home, badge: null },
  { title: "Patients", url: "/patients", icon: Users, badge: "24" },
  { title: "Appointments", url: "/appointments", icon: Calendar, badge: "5" },
  { title: "Medical Records", url: "/records", icon: FileText, badge: null },
  { title: "Analytics", url: "/analytics", icon: BarChart3, badge: null },
];

const clinicalItems = [
  { title: "Vitals Monitor", url: "/vitals", icon: Activity, badge: "3" },
  { title: "Lab Results", url: "/lab-results", icon: Stethoscope, badge: "12" },
  { title: "Prescriptions", url: "/prescriptions", icon: Heart, badge: null },
  { title: "Treatment Plans", url: "/treatments", icon: UserCheck, badge: null },
];

const systemItems = [
  { title: "Settings", url: "/settings", icon: Settings, badge: null },
  { title: "Security", url: "/security", icon: Shield, badge: null },
  { title: "Notifications", url: "/notifications", icon: Bell, badge: "8" },
];

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => cn(
    "w-full justify-start gap-3 text-left font-medium transition-all duration-200",
    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
    isActive(path) 
      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" 
      : "text-sidebar-foreground",
    collapsed && "justify-center px-2"
  );

  const NavSection = ({ title, items, className = "" }: { 
    title: string; 
    items: typeof mainNavItems; 
    className?: string;
  }) => (
    <div className={cn("space-y-1", className)}>
      {!collapsed && (
        <h4 className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider px-3 mb-2">
          {title}
        </h4>
      )}
      {items.map((item) => (
        <NavLink key={item.url} to={item.url} className="block">
          <Button variant="ghost" className={getNavClass(item.url)}>
            <item.icon className={cn("h-4 w-4 flex-shrink-0", collapsed ? "h-5 w-5" : "")} />
            {!collapsed && (
              <>
                <span className="flex-1 truncate">{item.title}</span>
                {item.badge && (
                  <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Button>
        </NavLink>
      ))}
    </div>
  );

  return (
    <div className={cn(
      "relative flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-all duration-300",
      "shadow-soft",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-sidebar-foreground">HealthCare Pro</h1>
              <p className="text-xs text-sidebar-foreground/60">Enterprise System</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 hover:bg-sidebar-accent"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Search */}
      {!collapsed && (
        <div className="p-4 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Quick search..."
              className="w-full pl-10 pr-4 py-2 bg-sidebar-accent border border-sidebar-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sidebar-ring"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <NavSection title="Main" items={mainNavItems} />
        <NavSection title="Clinical" items={clinicalItems} />
        <NavSection title="System" items={systemItems} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">DR</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">Dr. Priya Patel</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">Chief Medical Officer</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xs font-medium text-primary-foreground">DR</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}