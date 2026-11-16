import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Eye, 
  Trash2, 
  Phone, 
  Mail, 
  Calendar,
  Loader2,
  Activity
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
import { usePatients, Patient } from "@/hooks/usePatients";
import { useToast } from "@/components/ui/use-toast";

type PatientStatus = "stable" | "monitoring" | "critical" | "discharged";

const Patients = () => {
  const { patients, isLoading, error, createPatient, updatePatient, deletePatient } = usePatients();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: "",
    gender: "Male",
    date_of_birth: "",
    phone: "",
    email: "",
    blood_group: "O+",
    primary_condition: "",
    status: "stable" as PatientStatus,
  });

  const resetForm = () => {
    setFormData({
      full_name: "",
      gender: "Male",
      date_of_birth: "",
      phone: "",
      email: "",
      blood_group: "O+",
      primary_condition: "",
      status: "stable",
    });
    setEditingPatient(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      full_name: patient.full_name || "",
      gender: patient.gender || "Male",
      date_of_birth: patient.date_of_birth || "",
      phone: patient.phone || "",
      email: patient.email || "",
      blood_group: patient.blood_group || "O+",
      primary_condition: patient.primary_condition || "",
      status: patient.status as PatientStatus,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    try {
      if (editingPatient) {
        await updatePatient.mutateAsync({
          id: editingPatient.id,
          updates: formData,
        });
        toast({ title: "Patient updated successfully" });
      } else {
        await createPatient.mutateAsync(formData);
        toast({ title: "Patient added successfully" });
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast({
        title: "Error saving patient",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete patient "${name}"?`)) {
      try {
        await deletePatient.mutateAsync(id);
        toast({ title: "Patient deleted successfully" });
      } catch (err: any) {
        toast({
          title: "Error deleting patient",
          description: err.message || "Failed to delete",
          variant: "destructive",
        });
      }
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchQuery)) ||
      (patient.mrn && patient.mrn.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "monitoring":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Monitoring</Badge>;
      case "stable":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700">Stable</Badge>;
      case "discharged":
        return <Badge variant="secondary">Discharged</Badge>;
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
              <Users className="mr-3 h-8 w-8 text-primary" />
              Patient Management
            </h1>
            <p className="text-muted-foreground">Manage and track all admitted and outpatient records</p>
          </div>
          <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, MRN, email, or phone..."
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
                  <SelectItem value="stable">Stable</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="discharged">Discharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center text-lg">
              <span>All Patients ({filteredPatients.length})</span>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center py-8 text-destructive">
                Error loading patients: {(error as any).message}
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p className="text-base font-medium">No patients found</p>
                <p className="text-sm">Click "Add New Patient" to register the first patient record.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MRN & Name</TableHead>
                      <TableHead>Demographics</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-foreground">{patient.full_name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{patient.mrn}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span>{patient.gender || "N/A"}</span>
                            {patient.date_of_birth && (
                              <span className="text-muted-foreground ml-1">
                                • DOB: {patient.date_of_birth}
                              </span>
                            )}
                            {patient.blood_group && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {patient.blood_group}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5 text-xs">
                            {patient.phone && (
                              <div className="flex items-center text-muted-foreground">
                                <Phone className="mr-1.5 h-3 w-3" />
                                {patient.phone}
                              </div>
                            )}
                            {patient.email && (
                              <div className="flex items-center text-muted-foreground">
                                <Mail className="mr-1.5 h-3 w-3" />
                                {patient.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {patient.primary_condition ? (
                            <Badge variant="secondary" className="font-normal">
                              {patient.primary_condition}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(patient.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(patient)}
                              title="Edit Patient"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDelete(patient.id, patient.full_name)}
                              title="Delete Patient"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Patient Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingPatient ? "Edit Patient Details" : "Register New Patient"}</DialogTitle>
              <DialogDescription>
                Fill in the basic demographic and medical condition details.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(val) => setFormData({ ...formData, gender: val })}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select
                    value={formData.blood_group}
                    onValueChange={(val) => setFormData({ ...formData, blood_group: val })}
                  >
                    <SelectTrigger id="blood_group">
                      <SelectValue placeholder="Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                        <SelectItem key={bg} value={bg}>
                          {bg}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Patient Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: PatientStatus) => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="discharged">Discharged</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="condition">Primary Condition / Diagnosis</Label>
                  <Input
                    id="condition"
                    placeholder="e.g. Hypertension, Acute Gastritis"
                    value={formData.primary_condition}
                    onChange={(e) => setFormData({ ...formData, primary_condition: e.target.value })}
                  />
                </div>
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
                  disabled={createPatient.isPending || updatePatient.isPending}
                >
                  {(createPatient.isPending || updatePatient.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingPatient ? "Save Changes" : "Register Patient"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Patients;
