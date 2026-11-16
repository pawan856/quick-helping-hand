import { useState, useEffect } from "react";
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
  Loader2
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
import { useToast } from "@/components/ui/use-toast";

export interface LocalPatient {
  id: string | number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit: string;
  condition: string;
  status: "Active" | "Inactive";
  mrn?: string;
  bloodGroup?: string;
}

const INITIAL_PATIENTS: LocalPatient[] = [
  {
    id: 1,
    name: "Rajesh Sharma",
    age: 45,
    gender: "Male",
    phone: "+91 98765-43210",
    email: "rajesh.sharma@email.com",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
    status: "Active",
    bloodGroup: "B+",
    mrn: "MRN-RS101"
  },
  {
    id: 2,
    name: "Priya Patel",
    age: 32,
    gender: "Female",
    phone: "+91 98765-43211",
    email: "priya.patel@email.com",
    lastVisit: "2024-01-12",
    condition: "Diabetes",
    status: "Active",
    bloodGroup: "A+",
    mrn: "MRN-PP102"
  },
  {
    id: 3,
    name: "Arjun Singh",
    age: 28,
    gender: "Male",
    phone: "+91 98765-43212",
    email: "arjun.singh@email.com",
    lastVisit: "2024-01-10",
    condition: "Asthma",
    status: "Inactive",
    bloodGroup: "O+",
    mrn: "MRN-AS103"
  },
  {
    id: 4,
    name: "Kavya Reddy",
    age: 55,
    gender: "Female",
    phone: "+91 98765-43213",
    email: "kavya.reddy@email.com",
    lastVisit: "2024-01-08",
    condition: "Arthritis",
    status: "Active",
    bloodGroup: "AB+",
    mrn: "MRN-KR104"
  },
  {
    id: 5,
    name: "Vikram Gupta",
    age: 38,
    gender: "Male",
    phone: "+91 98765-43214",
    email: "vikram.gupta@email.com",
    lastVisit: "2024-01-05",
    condition: "Migraine",
    status: "Active",
    bloodGroup: "B-",
    mrn: "MRN-VG105"
  }
];

const LOCAL_STORAGE_KEY = "hospital_patients_data";

export default function Patients() {
  const { toast } = useToast();

  const [patients, setPatients] = useState<LocalPatient[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_PATIENTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      // ignore
    }
  }, [patients]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<LocalPatient | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    age: 30,
    gender: "Male",
    phone: "",
    email: "",
    bloodGroup: "O+",
    condition: "",
    status: "Active" as "Active" | "Inactive",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      age: 30,
      gender: "Male",
      phone: "",
      email: "",
      bloodGroup: "O+",
      condition: "",
      status: "Active",
    });
    setEditingPatient(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (patient: LocalPatient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age || 30,
      gender: patient.gender || "Male",
      phone: patient.phone || "",
      email: patient.email || "",
      bloodGroup: patient.bloodGroup || "O+",
      condition: patient.condition || "",
      status: patient.status || "Active",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    if (editingPatient) {
      setPatients((prev) =>
        prev.map((p) =>
          p.id === editingPatient.id
            ? {
                ...p,
                ...formData,
              }
            : p
        )
      );
      toast({ title: "Patient updated successfully" });
    } else {
      const newPatient: LocalPatient = {
        id: Date.now(),
        ...formData,
        lastVisit: new Date().toISOString().slice(0, 10),
        mrn: `MRN-${Math.floor(1000 + Math.random() * 9000)}`,
      };
      setPatients((prev) => [newPatient, ...prev]);
      toast({ title: "Patient added successfully" });
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string | number, name: string) => {
    if (confirm(`Are you sure you want to delete patient "${name}"?`)) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Patient deleted successfully" });
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (patient.email && patient.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (patient.phone && patient.phone.includes(searchQuery)) ||
      (patient.condition && patient.condition.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
            <p className="text-muted-foreground">Manage and monitor all hospital patient records</p>
          </div>
          <Button onClick={openAddDialog} className="bg-primary hover:bg-primary/90 shadow-sm">
            <Plus className="mr-2 h-4 w-4" />
            Add New Patient
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, condition or phone..."
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
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
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 opacity-30 mb-3" />
                <p className="text-base font-medium">No patients found</p>
                <p className="text-sm">Click "Add New Patient" to register a patient.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Last Visit</TableHead>
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
                            <div className="font-semibold text-foreground">{patient.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {patient.age} years • {patient.gender} {patient.bloodGroup ? `• ${patient.bloodGroup}` : ""}
                            </div>
                            {patient.mrn && (
                              <div className="text-[11px] font-mono text-muted-foreground/80">{patient.mrn}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <Phone className="mr-1.5 h-3 w-3 text-muted-foreground" />
                              {patient.phone}
                            </div>
                            <div className="flex items-center text-xs">
                              <Mail className="mr-1.5 h-3 w-3 text-muted-foreground" />
                              {patient.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-xs">
                            <Calendar className="mr-1.5 h-3 w-3 text-muted-foreground" />
                            {patient.lastVisit}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{patient.condition}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={patient.status === "Active" ? "default" : "secondary"}
                            className={patient.status === "Active" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                          >
                            {patient.status}
                          </Badge>
                        </TableCell>
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
                              onClick={() => handleDelete(patient.id, patient.name)}
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
                Fill in the demographic and medical details.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="full_name">Patient Name *</Label>
                  <Input
                    id="full_name"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
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
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(val) => setFormData({ ...formData, bloodGroup: val })}
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
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(val: "Active" | "Inactive") => setFormData({ ...formData, status: val })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765-43210"
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
                  <Label htmlFor="condition">Medical Condition</Label>
                  <Input
                    id="condition"
                    placeholder="e.g. Hypertension, Diabetes"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
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
                <Button type="submit">
                  {editingPatient ? "Save Changes" : "Register Patient"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
