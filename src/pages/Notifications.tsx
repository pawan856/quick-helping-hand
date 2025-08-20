import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Bell, 
  Search, 
  Filter, 
  MoreVertical,
  Check,
  Trash2,
  AlertCircle,
  Calendar,
  FileText,
  Settings,
  Clock,
  User,
  Stethoscope
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const notificationsData = [
  {
    id: "1",
    title: "Critical Lab Result Alert",
    message: "Patient Arjun Singh has a critical cholesterol level that requires immediate attention.",
    category: "Clinical",
    type: "Critical",
    timestamp: "2024-01-21 10:30:00",
    read: false,
    actionable: true,
    patientId: "P-2024-001"
  },
  {
    id: "2",
    title: "Appointment Reminder", 
    message: "Upcoming appointment with Kavya Reddy at 2:00 PM today in Cardiology.",
    category: "Clinical",
    type: "Reminder",
    timestamp: "2024-01-21 09:00:00",
    read: false,
    actionable: true,
    patientId: "P-2024-002"
  },
  {
    id: "3",
    title: "System Maintenance Scheduled",
    message: "Scheduled maintenance will occur tonight from 11 PM to 1 AM. Please save your work.",
    category: "System",
    type: "Info",
    timestamp: "2024-01-21 08:15:00",
    read: true,
    actionable: false,
    patientId: null
  },
  {
    id: "4",
    title: "New Patient Registration",
    message: "New patient Priya Nair has been registered and assigned to your department.",
    category: "Clinical",
    type: "Info",
    timestamp: "2024-01-20 16:45:00",
    read: true,
    actionable: true,
    patientId: "P-2024-004"
  },
  {
    id: "5",
    title: "Password Expiry Warning",
    message: "Your password will expire in 3 days. Please update it to maintain account security.",
    category: "System",
    type: "Warning",
    timestamp: "2024-01-20 14:30:00",
    read: false,
    actionable: true,
    patientId: null
  },
  {
    id: "6",
    title: "Treatment Plan Updated",
    message: "Treatment plan for Vikram Gupta has been updated with new medication protocols.",
    category: "Clinical", 
    type: "Update",
    timestamp: "2024-01-20 11:20:00",
    read: true,
    actionable: true,
    patientId: "P-2024-003"
  }
];

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onAction }: any) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "Critical": return "destructive";
      case "Warning": return "default";
      case "Reminder": return "secondary";
      case "Update": return "outline";
      default: return "outline";
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "Clinical": return Stethoscope;
      case "System": return Settings;
      default: return Bell;
    }
  };

  const Icon = getIcon(notification.category);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
        notification.read ? 'bg-background' : 'bg-primary/5 border-primary/20'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={false}
            className="mt-1"
          />
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            notification.read ? 'bg-muted' : 'bg-primary/10'
          }`}>
            <Icon className={`h-5 w-5 ${notification.read ? 'text-muted-foreground' : 'text-primary'}`} />
          </div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {notification.title}
                </h3>
                {!notification.read && (
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                )}
              </div>
              <p className={`text-sm mt-1 ${notification.read ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                {notification.message}
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={getTypeColor(notification.type) as any}>
                {notification.type}
              </Badge>
              <Badge variant="outline">{notification.category}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {notification.timestamp}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {notification.actionable && (
                <Button size="sm" variant="outline" onClick={() => onAction(notification)}>
                  View Details
                </Button>
              )}
              {!notification.read && (
                <Button size="sm" variant="ghost" onClick={() => onMarkAsRead(notification.id)}>
                  <Check className="h-4 w-4" />
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => onDelete(notification.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(notificationsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    toast({
      title: "Notification Marked as Read",
      description: "The notification has been marked as read.",
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification Deleted",
      description: "The notification has been deleted.",
    });
  };

  const handleAction = (notification: any) => {
    toast({
      title: "Action Triggered",
      description: `Viewing details for: ${notification.title}`,
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    toast({
      title: "All Notifications Marked as Read",
      description: "All notifications have been marked as read.",
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === "all" || 
                      (activeTab === "unread" && !notif.read) ||
                      (activeTab === "clinical" && notif.category === "Clinical") ||
                      (activeTab === "system" && notif.category === "System");
    return matchesSearch && matchesTab;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const clinicalCount = notifications.filter(n => n.category === "Clinical").length;
  const systemCount = notifications.filter(n => n.category === "System").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">Stay updated with important alerts and messages</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-destructive">{unreadCount}</p>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{clinicalCount}</p>
                  <p className="text-sm text-muted-foreground">Clinical</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-accent">{systemCount}</p>
                  <p className="text-sm text-muted-foreground">System</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-morphism">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Center
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">
                    All ({notifications.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread ({unreadCount})
                  </TabsTrigger>
                  <TabsTrigger value="clinical">
                    Clinical ({clinicalCount})
                  </TabsTrigger>
                  <TabsTrigger value="system">
                    System ({systemCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-muted-foreground mb-2">No notifications found</h3>
                      <p className="text-sm text-muted-foreground">
                        {searchTerm 
                          ? "Try adjusting your search terms"
                          : "You're all caught up! No new notifications at this time."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredNotifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <NotificationItem
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                            onDelete={handleDelete}
                            onAction={handleAction}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}