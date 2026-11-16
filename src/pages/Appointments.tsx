import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  Plus, 
  Search, 
  Trash2, 
  Edit, 
  User, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileText
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useAppointments, Appointment } from "@/hooks/useAppointments";
import { usePatients } from "@/hooks/usePatients";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from "date-fns";

type AppointmentStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";

const Appointments = () => {
  const { appointments, isLoading, error, createAppointment, updateAppointment, deleteAppointment } = useAppointments();
  const { patients } = usePatients();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    patient_id: "",
    scheduled_at: "",
    duration_minutes: 30,
    appointment_type: "Consultation",
    status: "scheduled" as AppointmentStatus,
    notes: "",
  });

  const resetForm = () => {
    setFormData({
      patient_id: patients[0]?.id || "",
      scheduled_at: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      duration_minutes: 30,
      appointment_type: "Consultation",
      status: "scheduled",
      notes: "",
    });
    setEditingAppt(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (appt: Appointment) => {
    setEditingAppt(appt);
    setFormData({
      patient_id: appt.patient_id,
      scheduled_at: appt.scheduled_at ? appt.scheduled_at.slice(0, 16) : "",
      duration_minutes: appt.duration_minutes || 30,
      appointment_type: appt.appointment_type || "Consultation",
      status: appt.status as AppointmentStatus,
      notes: appt.notes || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.patient_id) {
      toast({ title: "Please select a patient", variant: "destructive" });
      return;
    }
    if (!formData.scheduled_at) {
      toast({ title: "Please pick a date and time", variant: "destructive" });
      return;
    }

    try {
      if (editingAppt) {
        await updateAppointment.mutateAsync({
          id: editingAppt.id,
          updates: {
            ...formData,
            scheduled_at: new Date(formData.scheduled_at).toISOString(),
          },
        });
        toast({ title: "Appointment updated successfully" });
      } else {
        await createAppointment.mutateAsync({
          ...formData,
          scheduled_at: new Date(formData.scheduled_at).toISOString(),
        });
        toast({ title: "Appointment scheduled successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({
        title: "Error saving appointment",
        description: err.message || "Failed to save",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    try {
      await updateAppointment.mutateAsync({
        id,
        updates: { status: newStatus },
      });
      toast({ title: `Status updated to ${newStatus}` });
    } catch (err: any) {
      toast({ title: "Failed to update status", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to cancel and remove this appointment?")) {
      try {
        await deleteAppointment.mutateAsync(id);
        toast({ title: "Appointment deleted" });
      } catch (err: any) {
        toast({ title: "Error deleting appointment", variant: "destructive" });
      }
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const patientName = appt.patients?.full_name || "";
    const matchesSearch =
      patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.appointment_type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || appt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline" className="text-blue-600 border-blue-400">Scheduled</Badge>;
      case "in_progress":
        return <Badge className="bg-amber-500 hover:bg-amber-600">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "no_show":
        return <Badge variant="secondary">No Show</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <Calendar className="mr-3 h-8 w-8 text-primary" />
              Appointment Scheduling
            </h1>
            <p className="text-muted-foreground">Manage consultations, check-ups, and procedures</p>
          </div>
          <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Book New Appointment
          </Button>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span>All Appointments ({filteredAppointments.length})</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8 text-destructive">
                Error loading appointments: {(error as any).message}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Calendar className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p className="text-base font-medium">No appointments found</p>
                <p className="text-sm">Click "Book New Appointment" to schedule an appointment.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type & Duration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAppointments.map((appt) => {
                      let formattedDate = appt.scheduled_at;
                      try {
                        formattedDate = format(parseISO(appt.scheduled_at), "PPP p");
                      } catch (e) {
                        // fallback
                      }

                      return (
                        <TableRow key={appt.id}>
                          <TableCell>
                            <div>
                              <div className="font-semibold text-foreground">
                                {appt.patients?.full_name || "Unknown Patient"}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {appt.patients?.mrn || ""} {appt.patients?.phone ? `• ${appt.patients.phone}` : ""}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center text-sm font-medium">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              {formattedDate}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <Badge variant="secondary" className="font-normal">
                                {appt.appointment_type}
                              </Badge>
                              <span className="text-xs text-muted-foreground ml-2">
                                {appt.duration_minutes} mins
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={appt.status}
                              onValueChange={(val: AppointmentStatus) => handleStatusChange(appt.id, val)}
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                <SelectItem value="no_show">No Show</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="max-w-[180px] truncate text-xs text-muted-foreground">
                            {appt.notes || "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditDialog(appt)}
                                title="Edit Appointment"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => handleDelete(appt.id)}
                                title="Delete Appointment"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Schedule / Edit Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingAppt ? "Update Appointment" : "Schedule New Appointment"}</DialogTitle>
              <DialogDescription>
                Select a patient and set appointment slot details.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient *</Label>
                <Select
                  value={formData.patient_id}
                  onValueChange={(val) => setFormData({ ...formData, patient_id: val })}
                >
                  <SelectTrigger id="patient">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No patients available (Add patients first)
                      </SelectItem>
                    ) : (
                      patients.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.full_name} ({p.mrn})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at">Date & Time *</Label>
                  <Input
                    id="scheduled_at"
                    type="datetime-local"
                    required
                    value={formData.scheduled_at}
                    onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Minutes)</Label>
                  <Select
                    value={String(formData.duration_minutes)}
                    onValueChange={(val) => setFormData({ ...formData, duration_minutes: Number(val) })}
                  >
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 mins</SelectItem>
                      <SelectItem value="30">30 mins</SelectItem>
                      <SelectItem value="45">45 mins</SelectItem>
                      <SelectItem value="60">60 mins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select
                    value={formData.appointment_type}
                    onValueChange={(val) => setFormData({ ...formData, appointment_type: val })}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Consultation">Consultation</SelectItem>
                      <SelectItem value="Follow-up">Follow-up</SelectItem>
                      <SelectItem value="Routine Checkup">Routine Checkup</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: AppointmentStatus) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="no_show">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Clinical Notes / Reason for Visit</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g. Regular BP checkup, recurring migraine..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createAppointment.isPending || updateAppointment.isPending}
                >
                  {(createAppointment.isPending || updateAppointment.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingAppt ? "Save Changes" : "Confirm Booking"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Appointments;
