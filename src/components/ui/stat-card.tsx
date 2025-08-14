import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  status?: "stable" | "critical" | "warning" | "success";
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  status,
  className,
  onClick
}: StatCardProps) {
  const getStatusStyles = () => {
    switch (status) {
      case "critical":
        return "border-l-4 border-l-medical-emergency bg-medical-emergency/5";
      case "warning":
        return "border-l-4 border-l-warning bg-warning/5";
      case "success":
        return "border-l-4 border-l-success bg-success/5";
      case "stable":
        return "border-l-4 border-l-medical-stable bg-medical-stable/5";
      default:
        return "";
    }
  };

  const getTrendColor = () => {
    if (!trend) return "";
    return trend.isPositive ? "text-success" : "text-destructive";
  };

  return (
    <Card 
      className={cn(
        "hover-lift cursor-pointer transition-all duration-300",
        getStatusStyles(),
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="text-3xl font-bold text-foreground">
            {value}
          </div>
          
          <div className="flex items-center justify-between">
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
            
            {trend && (
              <Badge 
                variant="secondary" 
                className={cn("text-xs", getTrendColor())}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}