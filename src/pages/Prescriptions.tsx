import { motion } from "framer-motion";

// Mock data for prescriptions
const prescriptionsData = [
  {
    prescriptionId: "RX001",
    patientName: "John Doe",
    patientId: "P001",
    doctorName: "Dr. Smith",
    medications: [
      { name: "Aspirin", dosage: "100mg", frequency: "Once daily", duration: "7 days" },
      { name: "Paracetamol", dosage: "500mg", frequency: "Twice daily", duration: "5 days" }
    ],
    prescribedDate: "2025-08-15",
    status: "Active",
    notes: "Take after meals."
  },
  {
    prescriptionId: "RX002",
    patientName: "Jane Smith",
    patientId: "P002",
    doctorName: "Dr. Adams",
    medications: [
      { name: "Ibuprofen", dosage: "200mg", frequency: "Once daily", duration: "10 days" }
    ],
    prescribedDate: "2025-08-10",
    status: "Completed",
    notes: "Drink plenty of water."
  }
];
import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Plus, 
  Download, 
  Printer, 
  Search, 
  Calendar,
  Pill,
  FileText,
  User,
  Clock
} from "lucide-react";

const prescriptionColumns = [
  {
    key: "prescriptionId",
    header: "Prescription ID",
    sortable: true
  },
  {
    key: "patientName",
    header: "Patient",
    cell: (value, row: any) => (
      <div>
        <p className="font-medium">{typeof value === 'object' ? JSON.stringify(value) : String(value ?? "")}</p>
        <p className="text-xs text-muted-foreground">{row.patientId}</p>
      </div>
    )
  },
  {
    key: "doctorName",
    header: "Prescribed By"
  },
  {
    key: "medications",
    header: "Medications",
    cell: (value: any[]) => (
      Array.isArray(value) ? (
        <div className="space-y-1">
          {value.slice(0, 2).map((med: any, index: number) => (
            <p key={index} className="text-sm">
              {med.name} - {med.dosage}
            </p>
          ))}
          {value.length > 2 && (
            <p className="text-xs text-muted-foreground">+{value.length - 2} more</p>
          )}
        </div>
      ) : String(value ?? "")
    )
  },
  {
    key: "prescribedDate",
    header: "Date",
    sortable: true
  },
  {
    key: "status",
    header: "Status",
    cell: (value: string) => (
      <Badge variant={value === "Active" ? "secondary" : "outline"}>
        {value}
      </Badge>
    )
  },
  {
    key: "actions",
    header: "Actions",
    cell: (_value, row: any) => (
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Prescription Header */}
              <div className="bg-gradient-to-r from-primary/5 to-accent/5 p-6 rounded-lg border border-primary/20">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-lg">HealthCare Management System</h3>
                    <p className="text-sm text-muted-foreground">Prescription #{row.prescriptionId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">Date: {row.prescribedDate}</p>
                    <p className="text-sm">Doctor: {row.doctorName}</p>
                  </div>
                </div>
              </div>
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Patient Information</h4>
                  <p className="text-sm">Name: {row.patientName}</p>
                  <p className="text-sm">ID: {row.patientId}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <Badge variant={row.status === "Active" ? "secondary" : "outline"}>
                    {row.status}
                  </Badge>
                </div>
              </div>
              {/* Medications */}
              <div>
                <h4 className="font-medium mb-3">Prescribed Medications</h4>
                <div className="space-y-3">
                  {row.medications.map((med: any, index: number) => (
                    <div key={index} className="bg-muted/50 p-4 rounded-lg">
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm font-medium">Medication</p>
                          <p className="text-sm text-muted-foreground">{med.name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Dosage</p>
                          <p className="text-sm text-muted-foreground">{med.dosage}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Frequency</p>
                          <p className="text-sm text-muted-foreground">{med.frequency}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">{med.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Notes */}
              {row.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{row.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
];

export default function Prescriptions() {
  const [activeTab, setActiveTab] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const activePrescriptions = prescriptionsData.filter(p => p.status === "Active").length;
  const completedPrescriptions = prescriptionsData.filter(p => p.status === "Completed").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}


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
                  <p className="text-2xl font-bold text-foreground">{prescriptionsData.length}</p>
                  <p className="text-sm text-muted-foreground">Total Prescriptions</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{activePrescriptions}</p>
                  <p className="text-sm text-muted-foreground">Active</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <Pill className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-muted-foreground">{completedPrescriptions}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-muted/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-accent">3</p>
                  <p className="text-sm text-muted-foreground">Today</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-accent" />
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
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Prescription Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Prescriptions</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  <DataTable
                    data={prescriptionsData}
                    columns={prescriptionColumns}
                    searchPlaceholder="Search prescriptions..."
                  />
                </TabsContent>
                <TabsContent value="active" className="mt-6">
                  <DataTable
                    data={prescriptionsData.filter(p => p.status === "Active")}
                    columns={prescriptionColumns}
                    searchPlaceholder="Search active prescriptions..."
                  />
                </TabsContent>
                <TabsContent value="completed" className="mt-6">
                  <DataTable
                    data={prescriptionsData.filter(p => p.status === "Completed")}
                    columns={prescriptionColumns}
                    searchPlaceholder="Search completed prescriptions..."
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}