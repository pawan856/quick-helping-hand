import { useState } from "react";
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Activity, 
  Settings, 
  Bell,
  BarChart3,
  Stethoscope,
  Heart,
  Shield,
  UserCheck,
  Menu,
  X
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePatients } from "@/hooks/usePatients";
import { useAppointments } from "@/hooks/useAppointments";
import { useNotifications } from "@/hooks/useNotifications";
import { useVitals } from "@/hooks/useVitals";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function AppSidebar({ collapsed, onToggle }: AppSidebarProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  const { patients } = usePatients();
  const { appointments } = useAppointments();
  const { alerts } = useNotifications();
  const { vitals } = useVitals();

  const openAlertsCount = alerts.filter(a => !a.acknowledged).length;
  const scheduledApptsCount = appointments.filter(a => a.status === "scheduled" || a.status === "in_progress").length;

  const mainNavItems = [
    { title: "Dashboard", url: "/", icon: Home, badge: null },
    { title: "Patients", url: "/patients", icon: Users, badge: patients.length ? String(patients.length) : null },
    { title: "Appointments", url: "/appointments", icon: Calendar, badge: scheduledApptsCount ? String(scheduledApptsCount) : null },
    { title: "Medical Records", url: "/records", icon: FileText, badge: null },
    { title: "Analytics", url: "/analytics", icon: BarChart3, badge: null },
  ];

  const clinicalItems = [
    { title: "Vitals Monitor", url: "/vitals", icon: Activity, badge: vitals.length ? String(vitals.length) : null },
    { title: "Lab Results", url: "/lab-results", icon: Stethoscope, badge: null },
    { title: "Prescriptions", url: "/prescriptions", icon: Heart, badge: null },
    { title: "Treatment Plans", url: "/treatments", icon: UserCheck, badge: null },
  ];

  const systemItems = [
    { title: "Settings", url: "/settings", icon: Settings, badge: null },
    { title: "Security", url: "/security", icon: Shield, badge: null },
    { title: "Notifications", url: "/notifications", icon: Bell, badge: openAlertsCount ? String(openAlertsCount) : null },
  ];

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
    "hover:bg-accent hover:text-accent-foreground",
    isActive(path) 
      ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground" 
      : "text-muted-foreground"
  );

  return (
    <aside className={cn(
      "h-screen bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col z-40",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Heart className="h-5 w-5 text-primary fill-primary/20" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-foreground">HealthCare+</span>
              <p className="text-[10px] text-muted-foreground uppercase font-semibold">Hospital System</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Nav items */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-6">
        <div>
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Main Operations
            </p>
          )}
          <nav className="space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={getNavClass(item.url)}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                        {item.badge}
                      </Badge>
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Clinical Care
            </p>
          )}
          <nav className="space-y-1">
            {clinicalItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={getNavClass(item.url)}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal">
                        {item.badge}
                      </Badge>
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          {!collapsed && (
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Administration
            </p>
          )}
          <nav className="space-y-1">
            {systemItems.map((item) => (
              <NavLink
                key={item.url}
                to={item.url}
                className={getNavClass(item.url)}
                title={collapsed ? item.title : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant={item.title === "Notifications" ? "destructive" : "secondary"}
                        className="text-[10px] h-5 px-1.5 font-normal"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
