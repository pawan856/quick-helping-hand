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
import { motion } from "framer-motion";

const prescriptionsData = [
  {
    id: "1",
    prescriptionId: "RX-2024-001",
    patientName: "Arjun Singh",
    patientId: "P-2024-001",
    doctorName: "Dr. Priya Patel",
    medications: [
      { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" },
      { name: "Paracetamol", dosage: "650mg", frequency: "As needed", duration: "5 days" }
    ],
    prescribedDate: "2024-01-20",
    status: "Active",
    notes: "Take with food. Complete the full course of antibiotics."
  },
  {
    id: "2",
    prescriptionId: "RX-2024-002",
    patientName: "Kavya Reddy",
    patientId: "P-2024-002",
    doctorName: "Dr. Rajesh Kumar",
    medications: [
      { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", duration: "30 days" },
      { name: "Aspirin", dosage: "75mg", frequency: "Once daily", duration: "30 days" }
    ],
    prescribedDate: "2024-01-19",
    status: "Active",
    notes: "Monitor liver function. Take in the evening."
  },
  {
    id: "3",
    prescriptionId: "RX-2024-003",
    patientName: "Vikram Gupta",
    patientId: "P-2024-003",
    doctorName: "Dr. Sunita Sharma",
    medications: [
      { name: "Levothyroxine", dosage: "100mcg", frequency: "Once daily", duration: "90 days" }
    ],
    prescribedDate: "2024-01-18",
    status: "Completed",
    notes: "Take on empty stomach, 30 minutes before breakfast."
  }
];

const prescriptionColumns = [
  {
    key: "prescriptionId" as keyof typeof prescriptionsData[0],
    header: "Prescription ID",
    sortable: true
  },
  {
    key: "patientName" as keyof typeof prescriptionsData[0],
    header: "Patient",
    cell: (value: any, row: any) => (
      <div>
        <p className="font-medium">{value}</p>
        <p className="text-xs text-muted-foreground">{row.patientId}</p>
      </div>
    )
  },
  {
    key: "doctorName" as keyof typeof prescriptionsData[0],
    header: "Prescribed By"
  },
  {
    key: "medications" as keyof typeof prescriptionsData[0],
    header: "Medications",
    cell: (value: any) => (
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
    )
  },
  {
    key: "prescribedDate" as keyof typeof prescriptionsData[0],
    header: "Date",
    sortable: true
  },
  {
    key: "status" as keyof typeof prescriptionsData[0],
    header: "Status",
    cell: (value: any) => (
      <Badge variant={value === "Active" ? "secondary" : "outline"}>
        {value}
      </Badge>
    )
  },
  {
    key: "actions" as keyof typeof prescriptionsData[0],
    header: "Actions",
    cell: (value: any, row: any) => (
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
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Printer className="h-4 w-4" />
        </Button>
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Prescriptions</h1>
            <p className="text-muted-foreground mt-1">Manage digital prescriptions and medication orders</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Prescription
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Prescription</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Patient Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patient">Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="arjun">Arjun Singh (P-2024-001)</SelectItem>
                          <SelectItem value="kavya">Kavya Reddy (P-2024-002)</SelectItem>
                          <SelectItem value="vikram">Vikram Gupta (P-2024-003)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctor">Prescribing Doctor</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="priya">Dr. Priya Patel</SelectItem>
                          <SelectItem value="rajesh">Dr. Rajesh Kumar</SelectItem>
                          <SelectItem value="sunita">Dr. Sunita Sharma</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Medications */}
                  <div className="space-y-4">
                    <Label>Medications</Label>
                    <div className="border rounded-lg p-4 space-y-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Medication Name</Label>
                          <Input placeholder="e.g., Amoxicillin" />
                        </div>
                        <div className="space-y-2">
                          <Label>Dosage</Label>
                          <Input placeholder="e.g., 500mg" />
                        </div>
                        <div className="space-y-2">
                          <Label>Frequency</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="once">Once daily</SelectItem>
                              <SelectItem value="twice">Twice daily</SelectItem>
                              <SelectItem value="thrice">3 times daily</SelectItem>
                              <SelectItem value="asneeded">As needed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Duration</Label>
                          <Input placeholder="e.g., 7 days" />
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Another Medication
                      </Button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes & Instructions</Label>
                    <Textarea 
                      id="notes"
                      placeholder="Additional notes, instructions, or precautions..."
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateModalOpen(false)}>
                      Create Prescription
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                    searchKey="patientName"
                    searchPlaceholder="Search prescriptions..."
                  />
                </TabsContent>
                <TabsContent value="active" className="mt-6">
                  <DataTable
                    data={prescriptionsData.filter(p => p.status === "Active")}
                    columns={prescriptionColumns}
                    searchKey="patientName"
                    searchPlaceholder="Search active prescriptions..."
                  />
                </TabsContent>
                <TabsContent value="completed" className="mt-6">
                  <DataTable
                    data={prescriptionsData.filter(p => p.status === "Completed")}
                    columns={prescriptionColumns}
                    searchKey="patientName"
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