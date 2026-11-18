import { useState } from "react";
import { Bell, Search, Settings, Sun, Moon, User, LogOut, HelpCircle, ShieldAlert, Building2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useTenant } from "@/hooks/useTenant";
import { useNotifications } from "@/hooks/useNotifications";
import { useNavigate, Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

interface TopBarProps {
  className?: string;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export function TopBar({ className, isDarkMode, onThemeToggle }: TopBarProps) {
  const { session, profile, roles, signOut } = useAuth();
  const { currentHospital, setHospital, hospitals } = useTenant();
  const { alerts } = useNotifications();
  const navigate = useNavigate();

  const openAlerts = alerts.filter(a => !a.acknowledged);
  const unreadAlerts = openAlerts.slice(0, 4);

  const getInitials = (name?: string | null) => {
    if (!name) return "DR";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <header className={cn(
      "sticky top-0 z-30 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      "border-b border-border shadow-soft",
      className
    )}>
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Multi-tenant Hospital Switcher & Title */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10">
                <Building2 className="h-4 w-4 text-primary" />
                <div className="text-left hidden sm:block">
                  <span className="font-semibold text-xs leading-none text-foreground block">{currentHospital.name}</span>
                  <span className="text-[10px] text-muted-foreground">{currentHospital.location} • {currentHospital.tier}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel className="text-xs text-muted-foreground uppercase font-semibold">
                Switch Hospital Tenant (SaaS)
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {hospitals.map((h) => (
                <DropdownMenuItem
                  key={h.id}
                  onClick={() => setHospital(h)}
                  className={`cursor-pointer py-2 ${h.id === currentHospital.id ? "bg-accent font-semibold" : ""}`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs">{h.name}</span>
                    <span className="text-[10px] text-muted-foreground">{h.location} • {h.code}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Center: Search */}
        <div className="flex-1 max-w-md mx-8 hidden lg:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={`Search ${currentHospital.code} patients, vitals, doctors...`}
              className={cn(
                "w-full pl-10 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                "transition-all duration-200 hover:bg-muted/70"
              )}
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="hover:bg-muted"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                <Bell className="h-4 w-4" />
                {openAlerts.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-red-500 hover:bg-red-600">
                    {openAlerts.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Hospital Alerts</span>
                <Badge variant="outline" className="text-xs">
                  {openAlerts.length} Active
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {unreadAlerts.length === 0 ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    No active alerts
                  </div>
                ) : (
                  unreadAlerts.map((alert) => (
                    <DropdownMenuItem
                      key={alert.id}
                      className="p-3 cursor-pointer"
                      onClick={() => navigate("/notifications")}
                    >
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={alert.severity === "critical" ? "destructive" : "secondary"}
                            className="text-[10px]"
                          >
                            {alert.category}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {format(parseISO(alert.created_at), "p")}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-foreground line-clamp-2">
                          {alert.message}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="p-1">
                <Button
                  variant="ghost"
                  className="w-full text-xs h-8"
                  onClick={() => navigate("/notifications")}
                >
                  View All Alerts
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="hover:bg-muted"
            title="System Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Profile Menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-1 ring-border">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={profile?.avatar_url || ""} alt="User" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                      {getInitials(profile?.full_name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      {profile?.full_name || "Hospital User"}
                    </p>
                    <p className="text-xs text-muted-foreground">{session.user.email}</p>
                    <div className="pt-1 flex gap-1">
                      {roles.length > 0 ? (
                        roles.map((r) => (
                          <Badge key={r} variant="outline" className="text-[10px] capitalize">
                            {r}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">
                          Staff
                        </Badge>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/security")}>
                  <ShieldAlert className="mr-2 h-4 w-4" />
                  <span>Security & Audits</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")} className="text-xs">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
