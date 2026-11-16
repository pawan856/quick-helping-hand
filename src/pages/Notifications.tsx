import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Search,
  Check,
  Trash2,
  AlertCircle,
  Plus,
  Loader2,
  Clock,
  CheckCheck
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
import { useNotifications, Alert } from "@/hooks/useNotifications";
import { usePatients } from "@/hooks/usePatients";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";

type AlertSeverity = "low" | "medium" | "high" | "critical";

const Notifications = () => {
  const { alerts, isLoading, error, acknowledgeAlert, createAlert, deleteAlert } = useNotifications();
  const { patients } = usePatients();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // New Alert Form
  const [formData, setFormData] = useState({
    message: "",
    severity: "medium" as AlertSeverity,
    category: "Clinical",
    patient_id: "",
  });

  const unreadCount = alerts.filter((a) => !a.acknowledged).length;

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.patients?.full_name && alert.patients.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) {
      toast({ title: "Message is required", variant: "destructive" });
      return;
    }

    try {
      await createAlert.mutateAsync({
        message: formData.message,
        severity: formData.severity,
        category: formData.category,
        patient_id: formData.patient_id || null,
        acknowledged: false,
      });
      toast({ title: "Alert broadcasted successfully" });
      setIsDialogOpen(false);
      setFormData({
        message: "",
        severity: "medium",
        category: "Clinical",
        patient_id: "",
      });
    } catch (err: any) {
      toast({ title: "Failed to broadcast alert", description: err.message, variant: "destructive" });
    }
  };

  const handleAcknowledge = async (id: string) => {
    try {
      await acknowledgeAlert.mutateAsync(id);
      toast({ title: "Alert marked as acknowledged" });
    } catch (err: any) {
      toast({ title: "Error acknowledging alert", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAlert.mutateAsync(id);
      toast({ title: "Alert removed" });
    } catch (err: any) {
      toast({ title: "Failed to delete alert", variant: "destructive" });
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
      case "low":
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Bell className="mr-3 h-8 w-8 text-primary" />
              Real-time Hospital Alerts
              {unreadCount > 0 && (
                <Badge className="ml-3 bg-red-500 hover:bg-red-600">{unreadCount} Pending</Badge>
              )}
            </h1>
            <p className="text-muted-foreground">Emergency alerts, clinical warnings, and system notices</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Broadcast Alert
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search alert message, category or patient..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card>
              <CardContent className="py-8 text-center text-destructive">
                Error loading alerts: {(error as any).message}
              </CardContent>
            </Card>
          ) : filteredAlerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Bell className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p className="text-base font-medium">No alerts currently</p>
                <p className="text-sm">Everything is running smoothly.</p>
              </CardContent>
            </Card>
          ) : (
            filteredAlerts.map((alert) => {
              let timeStr = alert.created_at;
              try {
                timeStr = format(parseISO(alert.created_at), "PPP p");
              } catch (e) {
                // ignore
              }

              return (
                <Card
                  key={alert.id}
                  className={`transition-all ${
                    alert.acknowledged
                      ? "opacity-60 bg-muted/40"
                      : alert.severity === "critical"
                      ? "border-l-4 border-l-red-500 shadow-sm"
                      : "border-l-4 border-l-amber-500 shadow-sm"
                  }`}
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getSeverityBadge(alert.severity)}
                        <Badge variant="outline" className="text-xs">
                          {alert.category}
                        </Badge>
                        {alert.patients && (
                          <span className="text-xs font-medium text-foreground">
                            Patient: {alert.patients.full_name} ({alert.patients.mrn})
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center ml-auto sm:ml-0">
                          <Clock className="mr-1 h-3 w-3" />
                          {timeStr}
                        </span>
                      </div>
                      <p className="text-sm font-medium pt-1 text-foreground">{alert.message}</p>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      {!alert.acknowledged ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAcknowledge(alert.id)}
                          className="text-xs"
                        >
                          <Check className="mr-1 h-3.5 w-3.5" />
                          Acknowledge
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground flex items-center mr-2">
                          <CheckCheck className="mr-1 h-4 w-4 text-emerald-600" />
                          Acknowledged
                        </span>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(alert.id)}
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Broadcast Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Broadcast Hospital Alert</DialogTitle>
              <DialogDescription>
                Publish an alert to hospital staff and clinical dashboards.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity Level *</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(val: AlertSeverity) => setFormData({ ...formData, severity: val })}
                  >
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Clinical">Clinical</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                      <SelectItem value="System">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert_patient">Patient (Optional)</Label>
                <Select
                  value={formData.patient_id}
                  onValueChange={(val) => setFormData({ ...formData, patient_id: val })}
                >
                  <SelectTrigger id="alert_patient">
                    <SelectValue placeholder="None / General Hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None (Hospital Wide)</SelectItem>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.full_name} ({p.mrn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="msg">Alert Message *</Label>
                <Textarea
                  id="msg"
                  required
                  placeholder="e.g. Critical SpO2 drop observed in ICU Bed 4..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAlert.isPending}>
                  {createAlert.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Broadcast Alert
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Notifications;
