import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Stethoscope, 
  FileText, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";

const labResultsData = [
  {
    id: "1",
    testName: "Complete Blood Count (CBC)",
    patientName: "Arjun Singh",
    patientId: "P-2024-001",
    orderDate: "2024-01-20",
    completedDate: "2024-01-21",
    status: "Completed",
    priority: "Routine",
    doctor: "Dr. Priya Patel",
    department: "Hematology",
    result: "Normal ranges"
  },
  {
    id: "2",
    testName: "Lipid Profile",
    patientName: "Kavya Reddy",
    patientId: "P-2024-002", 
    orderDate: "2024-01-19",
    completedDate: "2024-01-20",
    status: "Critical",
    priority: "Urgent",
    doctor: "Dr. Rajesh Kumar",
    department: "Cardiology",
    result: "High cholesterol"
  },
  {
    id: "3",
    testName: "Thyroid Function Test",
    patientName: "Vikram Gupta",
    patientId: "P-2024-003",
    orderDate: "2024-01-21",
    completedDate: null,
    status: "Pending",
    priority: "Routine",
    doctor: "Dr. Sunita Sharma",
    department: "Endocrinology",
    result: null
  },
  {
    id: "4",
    testName: "Blood Glucose",
    patientName: "Priya Nair",
    patientId: "P-2024-004",
    orderDate: "2024-01-20",
    completedDate: "2024-01-21",
    status: "Completed",
    priority: "Stat",
    doctor: "Dr. Amit Verma",
    department: "Internal Medicine",
    result: "Within normal limits"
  }
];

const labColumns = [
  {
    key: "testName" as keyof typeof labResultsData[0],
    header: "Test Name",
    sortable: true
  },
  {
    key: "patientName" as keyof typeof labResultsData[0],
    header: "Patient",
    cell: (item: any) => (
      <div>
        <p className="font-medium">{item.patientName}</p>
        <p className="text-xs text-muted-foreground">{item.patientId}</p>
      </div>
    )
  },
  {
    key: "orderDate" as keyof typeof labResultsData[0],
    header: "Order Date",
    sortable: true
  },
  {
    key: "status" as keyof typeof labResultsData[0],
    header: "Status",
    cell: (value: any) => {
      const variants = {
        Completed: "secondary",
        Critical: "destructive", 
        Pending: "default"
      } as const;
      
      const icons = {
        Completed: CheckCircle,
        Critical: AlertTriangle,
        Pending: Clock
      };
      
      const Icon = icons[value as keyof typeof icons];
      
      return (
        <Badge variant={variants[value as keyof typeof variants] || "default"} className="flex items-center gap-1">
          <Icon className="h-3 w-3" />
          {value}
        </Badge>
      );
    }
  },
  {
    key: "priority" as keyof typeof labResultsData[0],
    header: "Priority",
    cell: (value: any) => (
      <Badge 
        variant={value === "Stat" ? "destructive" : value === "Urgent" ? "default" : "outline"}
        className={value === "Stat" ? "animate-pulse" : ""}
      >
        {value}
      </Badge>
    )
  },
  {
    key: "doctor" as keyof typeof labResultsData[0],
    header: "Ordered By"
  },
  {
    key: "actions" as keyof typeof labResultsData[0],
    header: "Actions",
    cell: (item: any) => (
      <div className="flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" disabled={row.status === "Pending"}>
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Lab Result Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Test: {row.testName}</p>
                  <p className="text-sm text-muted-foreground">Patient: {row.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status: {row.status}</p>
                  <p className="text-sm text-muted-foreground">Completed: {row.completedDate || "Pending"}</p>
                </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Results:</h4>
                <p className="text-sm">{row.result || "Results pending..."}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="ghost" size="sm" disabled={row.status === "Pending"}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    )
  }
];

export default function LabResults() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredData = labResultsData.filter(item => {
    const matchesSearch = item.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    completed: labResultsData.filter(item => item.status === "Completed").length,
    pending: labResultsData.filter(item => item.status === "Pending").length,
    critical: labResultsData.filter(item => item.status === "Critical").length
  };

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
            <h1 className="text-3xl font-bold text-foreground">Lab Results</h1>
            <p className="text-muted-foreground mt-1">Manage and review laboratory test results</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Order
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
                  <p className="text-2xl font-bold text-foreground">{labResultsData.length}</p>
                  <p className="text-sm text-muted-foreground">Total Tests</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-success">{statusCounts.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-warning">{statusCounts.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-destructive">{statusCounts.critical}</p>
                  <p className="text-sm text-muted-foreground">Critical</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
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
                  <FileText className="h-5 w-5 text-primary" />
                  Laboratory Results
                </CardTitle>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search tests or patients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="completed">Completed</TabsTrigger>
                      <TabsTrigger value="pending">Pending</TabsTrigger>
                      <TabsTrigger value="critical">Critical</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={filteredData}
                columns={labColumns}
                searchKey="testName"
                searchPlaceholder="Search lab results..."
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppLayout>
  );
}