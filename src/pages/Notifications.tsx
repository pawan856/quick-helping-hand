import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Search,
  Check,
  Trash2,
  AlertCircle,
  Plus,
  Clock,
  User,
  Calendar,
  FileText,
  Settings as SettingsIcon,
  Stethoscope,
  Send
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface NotificationItemData {
  id: string;
  title: string;
  message: string;
  category: "Clinical" | "System" | "Pharmacy";
  type: "Critical" | "Warning" | "Reminder" | "Info";
  timestamp: string;
  read: boolean;
  actionable: boolean;
  patientName?: string;
}

const initialNotifications: NotificationItemData[] = [
  {
    id: "1",
    title: "Critical Lab Result Alert",
    message: "Patient Arjun Singh has a critical cholesterol level and elevated cardiac markers.",
    category: "Clinical",
    type: "Critical",
    timestamp: "10 mins ago",
    read: false,
    actionable: true,
    patientName: "Arjun Singh",
  },
  {
    id: "2",
    title: "Appointment Reminder",
    message: "Upcoming consultation with Kavya Reddy scheduled today in Cardiology Clinic.",
    category: "Clinical",
    type: "Reminder",
    timestamp: "45 mins ago",
    read: false,
    actionable: true,
    patientName: "Kavya Reddy",
  },
  {
    id: "3",
    title: "System Maintenance Notice",
    message: "Scheduled server data backup will occur tonight at 11:00 PM. System remains operational.",
    category: "System",
    type: "Info",
    timestamp: "2 hours ago",
    read: true,
    actionable: false,
  },
  {
    id: "4",
    title: "Prescription Refill Request",
    message: "Patient Priya Patel requested renewal for Metformin 500mg prescription.",
    category: "Pharmacy",
    type: "Warning",
    timestamp: "3 hours ago",
    read: false,
    actionable: true,
    patientName: "Priya Patel",
  },
  {
    id: "5",
    title: "Emergency Bed Allocation",
    message: "ICU Bed 04 assigned to incoming emergency trauma patient Rajesh Sharma.",
    category: "Clinical",
    type: "Critical",
    timestamp: "5 hours ago",
    read: true,
    actionable: true,
    patientName: "Rajesh Sharma",
  },
];

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItemData[]>(initialNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Broadcast Alert Form
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    category: "Clinical" as "Clinical" | "System" | "Pharmacy",
    type: "Critical" as "Critical" | "Warning" | "Reminder" | "Info",
    patientName: "",
  });

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.message.trim()) {
      toast({ title: "Title and message are required", variant: "destructive" });
      return;
    }

    const newNotification: NotificationItemData = {
      id: String(Date.now()),
      title: formData.title,
      message: formData.message,
      category: formData.category,
      type: formData.type,
      timestamp: "Just now",
      read: false,
      actionable: Boolean(formData.patientName),
      patientName: formData.patientName || undefined,
    };

    setNotifications([newNotification, ...notifications]);
    toast({
      title: "Alert Broadcasted Successfully",
      description: `Broadcasted to all hospital clinical staff.`,
    });

    setIsDialogOpen(false);
    setFormData({
      title: "",
      message: "",
      category: "Clinical",
      type: "Critical",
      patientName: "",
    });
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    toast({ title: "Notification marked as read" });
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast({ title: "Notification deleted" });
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (notif.patientName && notif.patientName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "unread" && !notif.read) ||
      (activeTab === "clinical" && notif.category === "Clinical") ||
      (activeTab === "system" && notif.category === "System");

    return matchesSearch && matchesTab;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "Critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "Warning":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Warning</Badge>;
      case "Reminder":
        return <Badge className="bg-blue-600 hover:bg-blue-700">Reminder</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Clinical":
        return <Stethoscope className="h-5 w-5 text-primary" />;
      case "Pharmacy":
        return <FileText className="h-5 w-5 text-cyan-500" />;
      default:
        return <SettingsIcon className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Bell className="h-8 w-8 text-primary mr-3" />
              Hospital Notifications & Alerts
              {unreadCount > 0 && (
                <Badge className="ml-3 bg-red-500 hover:bg-red-600">{unreadCount} Unread</Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time clinical warnings, emergency broadcasts, and operational notifications
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Broadcast Alert
            </Button>
          </div>
        </div>

        {/* Search & Tabs */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alert, message or patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
                  <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
                  <TabsTrigger value="clinical">Clinical</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Bell className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p className="text-base font-medium">No notifications matching criteria</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notif) => (
              <Card
                key={notif.id}
                className={`transition-all hover:shadow-md ${
                  notif.read ? "opacity-75 bg-card" : "border-l-4 border-l-primary bg-primary/5"
                }`}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-base ${notif.read ? "text-foreground/80" : "text-foreground"}`}>
                          {notif.title}
                        </span>
                        {getTypeBadge(notif.type)}
                        <Badge variant="outline" className="text-xs">
                          {notif.category}
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground">{notif.message}</p>

                    {notif.patientName && (
                      <p className="text-xs font-medium text-primary flex items-center pt-1">
                        <User className="h-3 w-3 mr-1" />
                        Patient: {notif.patientName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!notif.read && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notif.id)}
                        title="Mark as Read"
                      >
                        <Check className="h-4 w-4 text-emerald-600" />
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(notif.id)}
                      title="Delete Notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Broadcast Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Broadcast Hospital Alert</DialogTitle>
              <DialogDescription>
                Publish a clinical or operational emergency warning across the hospital.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleBroadcast} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="alert_title">Alert Title *</Label>
                <Input
                  id="alert_title"
                  required
                  placeholder="e.g. Critical SpO2 Alarm / Code Blue Notice"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alert_type">Priority Level *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(val: any) => setFormData({ ...formData, type: val })}
                  >
                    <SelectTrigger id="alert_type">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Critical">Critical</SelectItem>
                      <SelectItem value="Warning">Warning</SelectItem>
                      <SelectItem value="Reminder">Reminder</SelectItem>
                      <SelectItem value="Info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert_category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val: any) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger id="alert_category">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clinical">Clinical</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="System">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert_patient">Patient Name (Optional)</Label>
                <Input
                  id="alert_patient"
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert_message">Message Description *</Label>
                <Textarea
                  id="alert_message"
                  required
                  placeholder="Describe the medical alert or emergency instructions..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4 mr-2" />
                  Broadcast Alert
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
